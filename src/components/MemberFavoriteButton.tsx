import React, { useState } from 'react';
import { Crown, Heart, Loader2 } from 'lucide-react';
import { getSchoolFavoriteKey, removeMemberFavorite, saveMemberFavorite } from '../lib/memberFavorites';
import { withBasePath } from '../lib/routes';

type Props = {
  school: Record<string, any>;
  isFavorite: boolean;
  onChange: (key: string, favorite: boolean) => void;
};

export default function MemberFavoriteButton({ school, isFavorite, onChange }: Props) {
  const [saving, setSaving] = useState(false);
  const [needsMembership, setNeedsMembership] = useState(false);
  const schoolKey = getSchoolFavoriteKey(school);

  const toggle = async () => {
    setSaving(true);
    setNeedsMembership(false);
    try {
      const result = isFavorite
        ? await removeMemberFavorite(schoolKey)
        : await saveMemberFavorite(school);
      if (!result.active) {
        setNeedsMembership(true);
        return;
      }
      onChange(schoolKey, !isFavorite);
    } catch {
      window.alert('收藏暫時無法同步，請稍後再試。');
    } finally {
      setSaving(false);
    }
  };

  if (needsMembership) {
    return <a href={withBasePath('/membership')} onClick={(event) => event.stopPropagation()} className="flex-[3] inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border-2 border-violet-800 bg-violet-100 px-2 text-xs font-black text-violet-900"><Crown className="h-4 w-4" />會員可收藏</a>;
  }

  return <button type="button" onClick={(event) => { event.stopPropagation(); void toggle(); }} disabled={saving} aria-pressed={isFavorite} aria-label={`${isFavorite ? '取消收藏' : '收藏校科'}：${school.name || ''}`} className={`flex-[3] inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border-2 border-slate-900 px-2 text-xs font-black transition-all disabled:opacity-60 ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white text-slate-800 hover:bg-rose-50'}`}>
    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isFavorite ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />}
    {isFavorite ? '已收藏' : '收藏校科'}
  </button>;
}
