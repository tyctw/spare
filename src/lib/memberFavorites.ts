import { callBackend } from './api';

export type MemberFavorite = {
  id: string;
  schoolKey: string;
  school: Record<string, unknown>;
  note: string;
  updatedAt: string;
};

export type FavoritesResponse = { active: boolean; favorites: MemberFavorite[] };

const favoriteKey = (school: Record<string, any>) => [
  school.region || school.district || '', school.name || '', school.type || '', school.group || '',
].map((value) => String(value).trim()).join('|');

export const getSchoolFavoriteKey = favoriteKey;

export const getMemberFavorites = () =>
  callBackend<FavoritesResponse>({ action: 'getMemberSchoolFavorites' }, { timeoutMs: 8_000 });

export const saveMemberFavorite = (school: Record<string, unknown>, note = '') =>
  callBackend<{ active: boolean; favorite?: MemberFavorite }>({ action: 'upsertMemberSchoolFavorite', school, note });

export const removeMemberFavorite = (schoolKey: string) =>
  callBackend<{ active: boolean }>({ action: 'deleteMemberSchoolFavorite', schoolKey });
