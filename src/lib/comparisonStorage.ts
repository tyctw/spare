const COMPARISON_STORAGE_KEY = 'tw-admission-analysis-comparison-schools';

export const getComparisonSchools = (): any[] => {
  try {
    const stored = sessionStorage.getItem(COMPARISON_STORAGE_KEY);
    const schools = stored ? JSON.parse(stored) : [];
    return Array.isArray(schools) ? schools : [];
  } catch {
    return [];
  }
};

export const saveComparisonSchools = (schools: any[]) => {
  sessionStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(schools));
  window.dispatchEvent(new Event('admission-comparison-updated'));
};
