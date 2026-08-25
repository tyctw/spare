const COMPARISON_STORAGE_KEY = 'tw-admission-analysis-comparison-schools';

export const getComparisonSchools = (): any[] => {
  try {
    const stored = sessionStorage.getItem(COMPARISON_STORAGE_KEY);
    const schools = stored ? JSON.parse(stored) : [];
    return Array.isArray(schools) ? schools.slice(0, 4) : [];
  } catch {
    return [];
  }
};

export const saveComparisonSchools = (schools: any[]) => {
  const nextSchools = schools.slice(0, 4);
  sessionStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(nextSchools));
  window.dispatchEvent(new Event('admission-comparison-updated'));
};
