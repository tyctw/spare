/**
 * 落點判讀共用規則。
 *
 * 單科成績只會在總積分相同，且有積點資料時積點也相同的情況下比較。
 * 資料沒有提供積點時，依既有規則只以總積分判斷是否進入單科比較。
 */
export type AdmissionComparisonSource = {
  scoreDiff?: unknown;
  pointsDiff?: unknown;
  distanceScore?: unknown;
  creditDiff?: unknown;
  creditsDiff?: unknown;
};

const EPSILON = 0.001;

const toFiniteNumber = (value: unknown): number | null => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

export function getPointsDifference(source: AdmissionComparisonSource): number | null {
  return toFiniteNumber(source.scoreDiff ?? source.pointsDiff ?? source.distanceScore);
}

export function getCreditsDifference(source: AdmissionComparisonSource): number | null {
  return toFiniteNumber(source.creditDiff ?? source.creditsDiff);
}

export function getPointsGap(source: AdmissionComparisonSource): number {
  return Math.abs(getPointsDifference(source) ?? 0);
}

export function getCreditsGap(source: AdmissionComparisonSource): number {
  return Math.abs(getCreditsDifference(source) ?? 0);
}

export function shouldCompareSubjects(source: AdmissionComparisonSource): boolean {
  const pointsDifference = getPointsDifference(source);
  const creditsDifference = getCreditsDifference(source);
  const hasCreditsComparison = source.creditDiff !== null && source.creditDiff !== undefined
    || source.creditsDiff !== null && source.creditsDiff !== undefined;

  return pointsDifference !== null
    && Math.abs(pointsDifference) < EPSILON
    && (!hasCreditsComparison || (creditsDifference !== null && Math.abs(creditsDifference) < EPSILON));
}

export function getAdmissionComparison(source: AdmissionComparisonSource) {
  const pointsDifference = getPointsDifference(source);
  const creditsDifference = getCreditsDifference(source);

  return {
    pointsDifference,
    creditsDifference,
    shouldCompareSubjects: shouldCompareSubjects(source),
  };
}
