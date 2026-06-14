import { createClient } from 'npm:@supabase/supabase-js@2';

type Scores = {
  chinese: string;
  english: string;
  math: string;
  science: string;
  social: string;
  composition: number;
};

type Filters = {
  schoolOwnership?: string;
  schoolType?: string;
  vocationalGroups?: string[];
};

type SchoolRow = {
  id?: string;
  region: string;
  name: string;
  district: string | null;
  points: number | string;
  credits: number | string | null;
  type: string | null;
  ownership: string | null;
  vocational_group: string | null;
  min_chinese: number | null;
  min_english: number | null;
  min_math: number | null;
  min_science: number | null;
  min_social: number | null;
  created_at?: string;
  updated_at?: string;
};

type ScoreBreakdownItem = {
  subject: keyof Scores;
  label: string;
  grade: string | number;
  points: number;
  credits: number | null;
};

type ScoreResult = {
  totalPoints: number;
  totalCredits: number | null;
  breakdown: ScoreBreakdownItem[];
  scoringMethod: string;
};

type AnalyzedSchool = {
  name: string;
  points: number;
  credits: number | null;
  type: string | null;
  ownership: string | null;
  group: string | null;
  minRequirements: Record<string, number | null>;
  zone: string;
  scoreDiff: number;
  pointsDiff: number;
  creditDiff: number | null;
  distanceScore: number;
  dynamicMargin: number;
  meetsMinRequirements: boolean;
  unmetRequirements: string[];
  analysisNote: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  });

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function taipeiParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

function rollingCode(prefix: string, date: Date) {
  const p = taipeiParts(date);
  return `${prefix}${p.year}${p.month}${p.day}${p.hour}`;
}

async function validateInvitationCode(code: unknown, request: Request, consume = false) {
  const invitationCode = String(code || '').trim().toUpperCase();
  let valid = false;

  if (invitationCode) {
    const now = new Date();
    const prefixes = ['TYCTW', 'TW', 'CTTW', 'KHTW', 'CHCTW', 'SH'];
    const generatedCodes = prefixes.flatMap((prefix) => [
      rollingCode(prefix, now),
      rollingCode(prefix, new Date(now.getTime() - 60 * 60 * 1000)),
    ]);
    valid = generatedCodes.includes(invitationCode);

    if (!valid && consume) {
      const { data, error } = await supabase.rpc('consume_invitation_code', {
        requested_code: invitationCode,
      });
      if (error) throw error;
      valid = data === true;
    } else if (!valid) {
      const { data } = await supabase
        .from('invitation_codes')
        .select('active, expires_at, max_uses, use_count')
        .eq('code', invitationCode)
        .maybeSingle();

      if (data) {
        const notExpired = !data.expires_at || new Date(data.expires_at) > now;
        const hasUses = data.max_uses === null || data.use_count < data.max_uses;
        valid = data.active && notExpired && hasUses;
      }
    }
  }

  await supabase.from('invitation_logs').insert({
    action: consume ? '使用' : '驗證',
    invitation_code: invitationCode || null,
    success: valid,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
    user_agent: request.headers.get('user-agent'),
  });

  return valid;
}

async function validateAdminCode(code: unknown, request: Request) {
  const adminCode = Deno.env.get('ADMIN_ACCESS_CODE')?.trim();
  const requestedCode = String(code || '').trim();

  if (adminCode) {
    const valid = requestedCode === adminCode;
    await supabase.from('invitation_logs').insert({
      action: 'admin',
      invitation_code: requestedCode ? '[admin-code]' : null,
      success: valid,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
      user_agent: request.headers.get('user-agent'),
    });
    return valid;
  }

  return validateInvitationCode(requestedCode, request);
}

function assertAdmin(valid: boolean) {
  if (!valid) throw new Error('管理驗證碼無效或已過期');
}

function nullableNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error('數字欄位格式不正確');
  return number;
}

function assertScores(value: unknown): asserts value is Scores {
  const scores = value as Scores;
  const grades = new Set(['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C']);
  const subjects: (keyof Scores)[] = ['chinese', 'english', 'math', 'science', 'social'];
  if (!scores || subjects.some((subject) => !grades.has(String(scores[subject])))) {
    throw new Error('成績格式不正確');
  }
  const composition = Number(scores.composition);
  if (!Number.isInteger(composition) || composition < 0 || composition > 6) {
    throw new Error('作文級分必須為 0 到 6');
  }
  scores.composition = composition;
}

function sumSubjects(scores: Scores, points: Record<string, number>) {
  return ['chinese', 'english', 'math', 'science', 'social']
    .reduce((sum, subject) => sum + points[scores[subject as keyof Scores] as string], 0);
}

function roundScore(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildBreakdown(
  scores: Scores,
  pointMap: Record<string, number>,
  creditMap: Record<string, number> | null,
  compositionPoints = 0,
  compositionCredits: number | null = null,
) {
  const labels: Record<string, string> = {
    chinese: '國文',
    english: '英文',
    math: '數學',
    science: '自然',
    social: '社會',
    composition: '寫作測驗',
  };
  const subjects: (keyof Scores)[] = ['chinese', 'english', 'math', 'science', 'social'];
  const breakdown = subjects.map((subject) => {
    const grade = scores[subject] as string;
    return {
      subject,
      label: labels[subject],
      grade,
      points: pointMap[grade],
      credits: creditMap ? creditMap[grade] : null,
    };
  });

  if (compositionPoints > 0 || compositionCredits !== null) {
    breakdown.push({
      subject: 'composition',
      label: labels.composition,
      grade: scores.composition,
      points: compositionPoints,
      credits: compositionCredits,
    });
  }

  return breakdown;
}

function calculateScores(region: string, scores: Scores): ScoreResult {
  const standardPoints = { 'A++': 6, 'A+': 6, A: 6, 'B++': 4, 'B+': 4, B: 4, C: 2 };
  const standardCredits = { 'A++': 7, 'A+': 6, A: 5, 'B++': 4, 'B+': 3, B: 2, C: 1 };
  const detailedPoints = { 'A++': 7, 'A+': 6, A: 5, 'B++': 4, 'B+': 3, B: 2, C: 1 };
  const compositionDecimal = [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1];

  if (region === 'taoyuan') {
    const compositionPoints = [0, 1, 2, 2, 3, 3, 3][scores.composition];
    return {
      totalPoints: roundScore(sumSubjects(scores, standardPoints) + compositionPoints),
      totalCredits: sumSubjects(scores, standardCredits),
      breakdown: buildBreakdown(scores, standardPoints, standardCredits, compositionPoints),
      scoringMethod: '五科以 A=6、B=4、C=2 計積分，寫作測驗另依級分加計；同積分時以積點作為精細排序依據。',
    };
  }
  if (region === 'kaohsiung' || region === 'hsinchu') {
    return {
      totalPoints: sumSubjects(scores, standardPoints),
      totalCredits: sumSubjects(scores, standardCredits),
      breakdown: buildBreakdown(scores, standardPoints, standardCredits),
      scoringMethod: '五科以 A=6、B=4、C=2 計積分，並以 A++ 至 C 的積點作為同分比較依據。',
    };
  }
  if (region === 'central') {
    const credits = { 'A++': 21, 'A+': 18, A: 15, 'B++': 12, 'B+': 9, B: 6, C: 3 };
    return {
      totalPoints: sumSubjects(scores, standardPoints),
      totalCredits: sumSubjects(scores, credits) + scores.composition,
      breakdown: buildBreakdown(scores, standardPoints, credits, 0, scores.composition),
      scoringMethod: '五科以 A=6、B=4、C=2 計積分；積點採 A++=21 至 C=3，並加計寫作級分以提升同分推估精度。',
    };
  }
  if (region === 'changhua') {
    const points = { 'A++': 9, 'A+': 8, A: 7, 'B++': 6, 'B+': 5, B: 4, C: 3 };
    return {
      totalPoints: sumSubjects(scores, points),
      totalCredits: null,
      breakdown: buildBreakdown(scores, points, null),
      scoringMethod: '五科直接採 A++=9 至 C=3 的細分積分，已將同等級內差異納入總分。',
    };
  }
  if (region === 'taipei' || region === 'tainan') {
    const compositionPoints = compositionDecimal[scores.composition];
    return {
      totalPoints: roundScore(sumSubjects(scores, detailedPoints) + compositionPoints),
      totalCredits: null,
      breakdown: buildBreakdown(scores, detailedPoints, null, compositionPoints),
      scoringMethod: '五科採 A++=7 至 C=1 的細分積分，寫作測驗以小數加權，適合做更細緻的門檻差距比較。',
    };
  }
  throw new Error(`無效的地區指定: ${region}`);
}

function filterSchools(
  rows: SchoolRow[],
  totalPoints: number,
  totalCredits: number | null,
  filters: Filters,
  scores: Scores,
  region: string,
) {
  let margin = 2;
  if (region === 'central' || region === 'changhua') margin = 3;
  if (region === 'taipei' || region === 'tainan' || region === 'hsinchu') margin = 1.5;
  const scoreValues: Record<string, number> = {
    'A++': 9, 'A+': 8, A: 7, 'B++': 6, 'B+': 5, B: 4, C: 3,
  };
  const subjectLabels: Record<string, string> = {
    chinese: '國文',
    english: '英文',
    math: '數學',
    science: '自然',
    social: '社會',
  };
  return rows.map((row) => {
    const school = {
      region: row.region,
      name: row.name,
      district: row.district,
      points: Number(row.points),
      credits: row.credits === null || row.credits === '' ? null : Number(row.credits),
      type: row.type,
      ownership: row.ownership,
      group: row.vocational_group,
      minRequirements: {
        chinese: row.min_chinese,
        english: row.min_english,
        math: row.min_math,
        science: row.min_science,
        social: row.min_social,
      },
    };
    const diff = roundScore(totalPoints - school.points);
    const creditDiff = school.credits !== null && totalCredits !== null
      ? roundScore(totalCredits - school.credits)
      : null;
    const hasCredits = school.credits !== null;
    const isVocational = school.type !== null && school.type !== '普通科';
    const dynamicMargin = roundScore(clamp(
      margin +
      (isVocational ? 0.35 : 0) +
      (totalCredits !== null ? 0.15 : 0),
      0.8,
      3.5,
    ));
    let zone = 'safe';

    if (diff < 0) zone = 'reach';
    else if (diff === 0) {
      if (hasCredits && totalCredits !== null) {
        zone = creditDiff !== null && creditDiff < 0 ? 'reach' : creditDiff !== null && creditDiff <= 2 ? 'target' : 'safe';
      } else zone = 'target';
    } else if (diff <= dynamicMargin * 0.5) zone = 'target';

    const shouldCheckMinRequirements = diff === 0 && (
      !hasCredits || (creditDiff !== null && creditDiff === 0)
    );
    const unmetRequirements = shouldCheckMinRequirements
      ? Object.entries(school.minRequirements)
        .filter(([subject, minimum]) =>
          minimum && scoreValues[scores[subject as keyof Scores] as string] < minimum,
        )
        .map(([subject]) => subjectLabels[subject] || subject)
      : [];
    const meetsMinRequirements = unmetRequirements.length === 0;
    if (!meetsMinRequirements) zone = 'reach';

    const creditPenalty = creditDiff !== null && creditDiff < 0 ? Math.abs(creditDiff) / 10 : 0;
    const minRequirementPenalty = unmetRequirements.length * 0.75;
    const positiveCreditBonus = creditDiff !== null && creditDiff > 0 ? Math.min(creditDiff, 6) * 0.05 : 0;
    const distanceScore = roundScore(diff - creditPenalty - minRequirementPenalty + positiveCreditBonus);
    const analysisNote = !meetsMinRequirements
      ? `科目門檻未達：${unmetRequirements.join('、')}，即使總分接近仍建議列為夢幻區。`
      : creditDiff !== null && diff === 0 && creditDiff < 0
        ? `總積分相同，但積點少 ${Math.abs(creditDiff)} 點，屬同分比序挑戰。`
        : diff < 0
          ? `總積分低 ${Math.abs(diff)} 分，仍屬可挑戰範圍。`
          : diff === 0
            ? '總積分與門檻相同，需留意同分比序與實際招生名額變動。'
            : `總積分高於門檻 ${diff} 分，落點相對穩定。`;

    return {
      ...school,
      zone,
      scoreDiff: diff,
      pointsDiff: diff,
      creditDiff,
      distanceScore,
      dynamicMargin,
      meetsMinRequirements,
      unmetRequirements,
      analysisNote,
    };
  }).filter((school) => {
    const ownershipMatch = !filters.schoolOwnership || filters.schoolOwnership === 'all' ||
      school.ownership === filters.schoolOwnership;
    const typeMatch = !filters.schoolType || filters.schoolType === 'all' ||
      school.type === filters.schoolType;
    const groups = filters.vocationalGroups || [];
    const groupMatch = groups.length === 0 || groups.includes('all') || groups.includes(school.group || '');
    const isReach = school.scoreDiff < 0 && school.scoreDiff >= -school.dynamicMargin;
    const isCreditReach = school.scoreDiff === 0 && school.creditDiff !== null && school.creditDiff < 0;
    const pointsMatch = totalPoints >= school.points || isReach;
    const creditsMatch = school.credits === null || totalPoints > school.points ||
      (totalPoints === school.points && totalCredits !== null && totalCredits >= school.credits) ||
      isReach || isCreditReach;
    return ownershipMatch && typeMatch && groupMatch && pointsMatch && creditsMatch;
  }).sort((a, b) => {
    const zoneOrder: Record<string, number> = { reach: 0, target: 1, safe: 2 };
    return (zoneOrder[a.zone] ?? 99) - (zoneOrder[b.zone] ?? 99) ||
    (a.zone === 'reach' && b.zone === 'reach'
      ? Math.abs(b.scoreDiff) - Math.abs(a.scoreDiff)
      : Math.abs(a.scoreDiff) - Math.abs(b.scoreDiff)) ||
    b.points - a.points ||
    (b.credits || 0) - (a.credits || 0);
  });
}

function analysisReport(scores: Scores, schools: Array<{ zone: string }>) {
  const values = Object.values(scores);
  const aCount = values.filter((score) => typeof score === 'string' && score.startsWith('A')).length;
  const bCount = values.filter((score) => typeof score === 'string' && score.startsWith('B')).length;
  const cCount = values.filter((score) => score === 'C').length;
  let summary = '整體落點風險偏高，建議審慎選填志願，擴充保守區學校數量，並同步評估技職體系、就近入學與特色招生等多元管道。';
  if (aCount === 5) {
    summary = '您的成績非常優異，已達頂尖群水準，可大膽挑戰第一志願或明星高中；但熱門校仍可能受同分比序、作文級分、單科門檻與招生名額影響，建議仍保留少量實際區作為穩定配置。';
  } else if (aCount >= 4) {
    summary = '成績位於前段高競爭群，具備挑戰明星高中與熱門校系的實力。志願排序可由夢幻區展開，但中段應放入錄取機率較穩的實際區，避免全部集中在高門檻學校。';
  } else if (aCount >= 3) {
    summary = '成績表現亮眼，具備競爭前段班學校的強大優勢。建議優先比較同分比序、通勤距離與學校特色，將最想就讀且差距接近的學校排在前段。';
  } else if (aCount >= 2) {
    summary = '成績具有一定前段競爭力，但不同學校門檻差距會被積點與單科標準放大。建議以實際區為主、夢幻區少量挑戰，並補足保守區確保志願安全。';
  } else if (aCount >= 1 || bCount >= 4) {
    summary = '成績平穩，落點多在中堅學校。建議將符合興趣、通勤與升學方向的學校列為優先排序，同時留意同積分時積點不足可能使結果轉為夢幻區。';
  } else if (bCount >= 3 && cCount <= 1) {
    summary = '基礎能力穩定，適合以實際區與保守區作為志願主軸。可挑選少量門檻接近的夢幻區，但志願序後段務必安排錄取穩定度高的學校。';
  } else if (bCount >= 2 && cCount <= 2) {
    summary = '建議多放幾所實際區與保守區的學校，可多加利用就近入學、技職群科或特色招生策略，並優先選擇與興趣及未來升學路徑相符的校系。';
  } else if (cCount >= 3) {
    summary = '目前待加強科目較多，落點容易集中在保守區或技職類科。建議擴大志願範圍，優先確認單科門檻、招生名額與交通可行性，避免只填少數熱門學校。';
  }

  const zoneCounts = schools.reduce((counts, school) => {
    counts[school.zone] = (counts[school.zone] || 0) + 1;
    return counts;
  }, { safe: 0, target: 0, reach: 0 } as Record<string, number>);

  return {
    analysisSummary: summary,
    zoneCounts,
    suggestion: '志願選填依照順序，可以分成「夢幻」、「實際」、「保守」三大區。前2志願是「夢幻區」，第3-4志願是「實際區」，第5-6志願為「保守區」。',
  };
}

function analysisReportV2(scores: Scores, schools: AnalyzedSchool[], calculated: ScoreResult, region: string) {
  const values = Object.values(scores);
  const aCount = values.filter((score) => typeof score === 'string' && score.startsWith('A')).length;
  const bCount = values.filter((score) => typeof score === 'string' && score.startsWith('B')).length;
  const cCount = values.filter((score) => score === 'C').length;
  const zoneCounts = schools.reduce((counts, school) => {
    counts[school.zone] = (counts[school.zone] || 0) + 1;
    return counts;
  }, { safe: 0, target: 0, reach: 0 } as Record<string, number>);
  const total = schools.length || 1;
  const reachRatio = Math.round((zoneCounts.reach / total) * 100);
  const targetRatio = Math.round((zoneCounts.target / total) * 100);
  const safeRatio = Math.round((zoneCounts.safe / total) * 100);
  const samePointCreditReach = schools.filter((school) =>
    school.scoreDiff === 0 && school.creditDiff !== null && school.creditDiff < 0
  ).length;
  const unmetRequirementCount = schools.filter((school) => !school.meetsMinRequirements).length;
  let levelComment = '整體落點風險偏高，建議採取穩健策略，優先把實際區與保守區補足，再少量挑戰夢幻區。';
  if (aCount === 5) levelComment = '五科皆達 A 群，具備挑戰前段與熱門學校的條件；熱門校仍需留意同分比序、作文級分與招生名額變動。';
  else if (aCount >= 4) levelComment = 'A 群科目非常完整，前段學校競爭力強，建議以夢幻區搭配實際區建立志願序。';
  else if (aCount >= 3) levelComment = 'A 群科目比例高，前段學校競爭力明顯，但仍要留意同分比序與單科門檻。';
  else if (aCount >= 2) levelComment = '具備一定前段競爭力，建議以實際區為主、少量挑戰夢幻區，並補足保守區。';
  else if (aCount >= 1 || bCount >= 4) levelComment = '整體成績穩定，適合以實際區為主軸建立志願序，並依興趣與通勤條件排序。';
  else if (bCount >= 3 && cCount <= 1) levelComment = '基礎能力穩定，建議以實際區與保守區為核心，挑戰校不宜過多。';
  else if (bCount >= 2 && cCount <= 2) levelComment = '落點會集中在中後段與技職類科，建議擴大校系選擇並重視興趣適配。';
  else if (cCount >= 3) levelComment = '待加強科目較多，建議優先確認單科門檻、招生名額與交通可行性，並增加保守選項。';

  const summaryParts = [
    `試算總積分為 ${calculated.totalPoints}${calculated.totalCredits !== null ? `，總積點為 ${calculated.totalCredits}` : ''}。`,
    levelComment,
    `符合篩選條件的學校共 ${schools.length} 所：夢幻區 ${zoneCounts.reach} 所、實際區 ${zoneCounts.target} 所、保守區 ${zoneCounts.safe} 所。`,
  ];
  if (samePointCreditReach > 0) {
    summaryParts.push(`其中 ${samePointCreditReach} 所是積分相同但積點未達，已視為同分比序挑戰並歸入夢幻區。`);
  }
  if (unmetRequirementCount > 0) {
    summaryParts.push(`${unmetRequirementCount} 所學校有單科門檻未達，系統已提高風險判定。`);
  }
  const suggestionParts = [
    '填寫115會考志願時，建議依「夢幻、落點、安全」三層配置。前段可放幾個想挑戰、分數略高的夢幻志願；中段以歷年錄取分數與自身成績相近的落點志願為主；後段則保留2至3個錄取機率較高的安全志願，降低落榜風險。安排時也要考量通勤時間、校風、學習壓力與升學風氣，選擇真正適合自己的高中。',
  ];
  return {
    analysisSummary: summaryParts.join(''),
    zoneCounts,
    suggestion: suggestionParts.join(''),
    scoringExplanation: calculated.scoringMethod,
    scoreBreakdown: calculated.breakdown,
    riskNotes: {
      reachRatio,
      targetRatio,
      safeRatio,
      samePointCreditReach,
      unmetRequirementCount,
    },
    region,
  };
}

async function handleAction(payload: Record<string, any>, request: Request) {
  switch (payload.action) {
    case 'wakeup':
      return { message: 'System is awake and ready!' };
    case 'getInvitationCode':
      return { invitationCode: rollingCode(String(payload.prefix || 'TW').toUpperCase(), new Date()) };
    case 'validateInvitationCode':
      return { valid: await validateInvitationCode(payload.invitationCode, request) };
    case 'submitFeedback': {
      const rating = Number(payload.payload?.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('評分格式不正確');
      const { error } = await supabase.from('feedback').insert({
        rating,
        feedback: String(payload.payload?.feedback || '').slice(0, 2000),
        client_info: payload.clientInfo || {},
      });
      if (error) throw error;
      return { success: true };
    }
    case 'reportError': {
      const description = String(payload.payload?.description || '').trim();
      if (!description) throw new Error('請輸入問題描述');
      const { error } = await supabase.from('error_reports').insert({
        type: String(payload.payload?.type || 'other').slice(0, 100),
        description: description.slice(0, 5000),
        email: String(payload.payload?.email || '').slice(0, 320) || null,
        client_info: payload.clientInfo || {},
      });
      if (error) throw error;
      return { success: true };
    }
    case 'getVolunteerSchools': {
      const pageSize = 1000;
      const schools = [];
      for (let from = 0; ; from += pageSize) {
        const { data, error } = await supabase
          .from('volunteer_schools')
          .select('id, county, code, name, level_info, shift, group_code, group_name, dept_code, dept_name')
          .order('county')
          .order('name')
          .range(from, from + pageSize - 1);
        if (error) throw error;
        schools.push(...(data || []));
        if (!data || data.length < pageSize) break;
      }
      return {
        schools: schools.map((school) => ({
          id: school.id,
          county: school.county,
          code: school.code,
          name: school.name,
          levelInfo: school.level_info,
          shift: school.shift,
          groupCode: school.group_code,
          groupName: school.group_name,
          deptCode: school.dept_code,
          deptName: school.dept_name,
        })),
      };
    }
    case 'adminListSchools': {
      assertAdmin(await validateAdminCode(payload.invitationCode, request));

      const pageSize = 1000;
      const rows: SchoolRow[] = [];
      const region = String(payload.region || 'all');

      for (let from = 0; ; from += pageSize) {
        let query = supabase
          .from('schools')
          .select('id, region, name, district, points, credits, type, ownership, vocational_group, min_chinese, min_english, min_math, min_science, min_social, created_at, updated_at')
          .order('region')
          .order('points', { ascending: false });

        if (region !== 'all') query = query.eq('region', region);

        const { data, error } = await query.range(from, from + pageSize - 1);
        if (error) throw error;
        rows.push(...((data || []) as SchoolRow[]));
        if (!data || data.length < pageSize) break;
      }

      return { schools: rows };
    }
    case 'adminUpsertSchool': {
      assertAdmin(await validateAdminCode(payload.invitationCode, request));

      const school = payload.school || {};
      const validRegions = new Set(['taoyuan', 'kaohsiung', 'central', 'changhua', 'taipei', 'tainan', 'hsinchu']);
      const region = String(school.region || '');
      const name = String(school.name || '').trim();
      const points = Number(school.points);
      const credits = nullableNumber(school.credits);

      if (!validRegions.has(region)) throw new Error('區域格式不正確');
      if (!name) throw new Error('請輸入學校名稱');
      if (!Number.isFinite(points)) throw new Error('請輸入分數門檻');
      if (credits !== null && !Number.isFinite(credits)) throw new Error('請輸入正確積分');

      const row = {
        ...(school.id ? { id: school.id } : {}),
        region,
        name,
        district: String(school.district || '').trim() || null,
        points,
        credits,
        type: String(school.type || '').trim() || null,
        ownership: String(school.ownership || '').trim() || null,
        vocational_group: String(school.vocational_group || '').trim() || null,
        min_chinese: nullableNumber(school.min_chinese),
        min_english: nullableNumber(school.min_english),
        min_math: nullableNumber(school.min_math),
        min_science: nullableNumber(school.min_science),
        min_social: nullableNumber(school.min_social),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('schools')
        .upsert(row)
        .select('id, region, name, district, points, credits, type, ownership, vocational_group, min_chinese, min_english, min_math, min_science, min_social, created_at, updated_at')
        .single();

      if (error) throw error;
      return { school: data };
    }
    case 'adminDeleteSchool': {
      assertAdmin(await validateAdminCode(payload.invitationCode, request));

      const id = String(payload.id || '');
      if (!id) throw new Error('缺少資料 ID');
      const { error } = await supabase.from('schools').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    }
    case 'analyzeScores': {
      assertScores(payload.scores);
      const region = String(payload.region || '');
      const valid = await validateInvitationCode(payload.invitationCode, request, true);
      if (!valid) throw new Error('邀請碼無效或已過期');
      const calculated = calculateScores(region, payload.scores);
      const { data, error } = await supabase
        .from('schools')
        .select('region, name, district, points, credits, type, ownership, vocational_group, min_chinese, min_english, min_math, min_science, min_social')
        .eq('region', region);
      if (error) throw error;
      const eligibleSchools = filterSchools(
        (data || []) as SchoolRow[],
        calculated.totalPoints,
        calculated.totalCredits,
        payload.filters || {},
        payload.scores,
        region,
      );
      await supabase.from('app_logs').insert({
        region,
        action: '分析完成',
        invitation_code: String(payload.invitationCode || ''),
        details: {
          totalPoints: calculated.totalPoints,
          totalCredits: calculated.totalCredits,
          eligibleSchoolCount: eligibleSchools.length,
        },
        client_info: payload.clientInfo || {},
      });
      return {
        totalPoints: calculated.totalPoints,
        ...(calculated.totalCredits !== null && region !== 'hsinchu'
          ? { totalCredits: calculated.totalCredits }
          : {}),
        scoreBreakdown: calculated.breakdown,
        scoringMethod: calculated.scoringMethod,
        eligibleSchools,
        analysisReport: analysisReportV2(payload.scores, eligibleSchools, calculated, region),
      };
    }
    default:
      throw new Error('不支援的後端操作');
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const payload = await request.json();
    return json(await handleAction(payload, request));
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : '未知錯誤';
    const status = message.includes('邀請碼') ? 401 : 400;
    return json({ error: message }, status);
  }
});
