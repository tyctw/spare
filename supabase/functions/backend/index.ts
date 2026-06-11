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
  name: string;
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
    const prefixes = ['TYCTW', 'TW', 'CTTW', 'KHTW', 'CHCTW'];
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

function calculateScores(region: string, scores: Scores) {
  const standardPoints = { 'A++': 6, 'A+': 6, A: 6, 'B++': 4, 'B+': 4, B: 4, C: 2 };
  const standardCredits = { 'A++': 7, 'A+': 6, A: 5, 'B++': 4, 'B+': 3, B: 2, C: 1 };
  const detailedPoints = { 'A++': 7, 'A+': 6, A: 5, 'B++': 4, 'B+': 3, B: 2, C: 1 };
  const compositionDecimal = [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1];

  if (region === 'taoyuan') {
    return {
      totalPoints: sumSubjects(scores, standardPoints) + [0, 1, 2, 2, 3, 3, 3][scores.composition],
      totalCredits: sumSubjects(scores, standardCredits),
    };
  }
  if (region === 'kaohsiung' || region === 'hsinchu') {
    return {
      totalPoints: sumSubjects(scores, standardPoints),
      totalCredits: sumSubjects(scores, standardCredits),
    };
  }
  if (region === 'central') {
    const credits = { 'A++': 21, 'A+': 18, A: 15, 'B++': 12, 'B+': 9, B: 6, C: 3 };
    return {
      totalPoints: sumSubjects(scores, standardPoints),
      totalCredits: sumSubjects(scores, credits) + scores.composition,
    };
  }
  if (region === 'changhua') {
    const points = { 'A++': 9, 'A+': 8, A: 7, 'B++': 6, 'B+': 5, B: 4, C: 3 };
    return { totalPoints: sumSubjects(scores, points), totalCredits: null };
  }
  if (region === 'taipei' || region === 'tainan') {
    return {
      totalPoints: sumSubjects(scores, detailedPoints) + compositionDecimal[scores.composition],
      totalCredits: null,
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

  return rows.map((row) => {
    const school = {
      name: row.name,
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
    const diff = totalPoints - school.points;
    const hasCredits = school.credits !== null;
    let zone = 'safe';

    if (diff < 0) zone = 'reach';
    else if (diff === 0) {
      if (hasCredits && totalCredits !== null) {
        const creditDiff = totalCredits - school.credits!;
        zone = creditDiff < 0 ? 'reach' : creditDiff <= 2 ? 'target' : 'safe';
      } else zone = 'target';
    } else if (diff <= margin / 2) zone = 'target';

    let meetsMinRequirements = true;
    if (diff === 0 && (!hasCredits || totalCredits === school.credits)) {
      meetsMinRequirements = Object.entries(school.minRequirements).every(
        ([subject, minimum]) => !minimum || scoreValues[scores[subject as keyof Scores] as string] >= minimum,
      );
    }
    if (!meetsMinRequirements) zone = 'reach';
    return { ...school, zone, scoreDiff: diff, meetsMinRequirements };
  }).filter((school) => {
    const ownershipMatch = !filters.schoolOwnership || filters.schoolOwnership === 'all' ||
      school.ownership === filters.schoolOwnership;
    const typeMatch = !filters.schoolType || filters.schoolType === 'all' ||
      school.type === filters.schoolType;
    const groups = filters.vocationalGroups || [];
    const groupMatch = groups.length === 0 || groups.includes('all') || groups.includes(school.group || '');
    const isReach = school.scoreDiff < 0 && school.scoreDiff >= -margin;
    const creditDiff = school.credits !== null && totalCredits !== null
      ? totalCredits - school.credits
      : 0;
    const creditMargin = region === 'central' ? 5 : 3;
    const isCreditReach = school.scoreDiff === 0 && school.credits !== null &&
      creditDiff < 0 && creditDiff >= -creditMargin;
    const pointsMatch = totalPoints >= school.points || isReach;
    const creditsMatch = school.credits === null || totalPoints > school.points ||
      (totalPoints === school.points && totalCredits !== null && totalCredits >= school.credits) ||
      isReach || isCreditReach;
    return ownershipMatch && typeMatch && groupMatch && pointsMatch && creditsMatch;
  }).sort((a, b) => b.points - a.points || (b.credits || 0) - (a.credits || 0));
}

function analysisReport(scores: Scores, schools: Array<{ zone: string }>) {
  const values = Object.values(scores);
  const aCount = values.filter((score) => typeof score === 'string' && score.startsWith('A')).length;
  const bCount = values.filter((score) => typeof score === 'string' && score.startsWith('B')).length;
  const cCount = values.filter((score) => score === 'C').length;
  let summary = '建議審慎選填志願，擴充保守區的學校數量，或者考慮技職體系發展一技之長。';
  if (aCount === 5) summary = '您的成績非常優異，已達頂尖群水準，建議可大膽挑戰第一志願或明星高中。';
  else if (aCount >= 3) summary = '成績表現亮眼，具備競爭前段班學校的強大優勢。';
  else if (aCount >= 1 || bCount >= 4) summary = '成績平穩，落點多在中堅學校，建議將符合您特長的學校列為優先排序。';
  else if (bCount >= 2 && cCount <= 2) summary = '建議多放幾所實際區與保守區的學校，可多加利用就近入學或特色招生策略。';

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
    case 'analyzeScores': {
      assertScores(payload.scores);
      const region = String(payload.region || '');
      const valid = await validateInvitationCode(payload.invitationCode, request, true);
      if (!valid) throw new Error('邀請碼無效或已過期');
      const calculated = calculateScores(region, payload.scores);
      const { data, error } = await supabase
        .from('schools')
        .select('name, points, credits, type, ownership, vocational_group, min_chinese, min_english, min_math, min_science, min_social')
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
        eligibleSchools,
        analysisReport: analysisReport(payload.scores, eligibleSchools),
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
