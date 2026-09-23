// Versioned, bounded import from the LINE guided flow. This only fills the form;
// membership, authorization and analysis still use the existing server checks.
const guideRegions = new Set(['taipei', 'taoyuan', 'hsinchu', 'central', 'changhua', 'chiayi', 'tainan', 'kaohsiung']);
const guideGrades = ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C'];

export function parseLineGuideImport(hash: string) {
  if (hash.length > 200) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  // Do not consume a LINE login callback or an unrelated fragment.
  if (Array.from(params.keys()).length !== 1) return null;
  const value = params.get('line-guide');
  const match = value?.match(/^v1\.([a-z]+)\.([0-6]{6})$/);
  if (!match || !guideRegions.has(match[1])) return null;
  const digits = match[2];
  return {
    region: match[1],
    chinese: guideGrades[Number(digits[0])],
    english: guideGrades[Number(digits[1])],
    math: guideGrades[Number(digits[2])],
    science: guideGrades[Number(digits[3])],
    social: guideGrades[Number(digits[4])],
    composition: digits[5],
  };
}
