export const getSchoolOwnershipKey = (ownership: unknown) => {
  const value = String(ownership || '').trim().toLowerCase();
  if (value === 'private' || value === '私立') return 'private';
  if (value === 'public' || value === '公立') return 'public';
  return '';
};

export const formatSchoolOwnership = (ownership: unknown) => {
  const key = getSchoolOwnershipKey(ownership);
  if (key === 'private') return '私立';
  if (key === 'public') return '公立';
  return String(ownership || '未知');
};

export const formatSchoolOwnershipPreference = (ownership: unknown) => {
  if (String(ownership || '').trim().toLowerCase() === 'all') return '公私立不拘';
  return formatSchoolOwnership(ownership);
};
