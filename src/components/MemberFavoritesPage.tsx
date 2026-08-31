import React, { useEffect, useState } from 'react';
import { ArrowLeft, Crown, Heart, MapPin, NotebookPen, Trash2 } from 'lucide-react';
import { getMemberFavorites, removeMemberFavorite, saveMemberFavorite, type MemberFavorite } from '../lib/memberFavorites';
import { withBasePath } from '../lib/routes';

export default function MemberFavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [favorites, setFavorites] = useState<MemberFavorite[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const response = await getMemberFavorites();
      setActive(response.active);
      setFavorites(response.favorites);
    } catch {
      setActive(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const saveNote = async (favorite: MemberFavorite) => {
    try {
      const result = await saveMemberFavorite(favorite.school, note);
      if (!result.active) return setActive(false);
      setFavorites((current) => current.map((item) => item.schoolKey === favorite.schoolKey && result.favorite ? result.favorite : item));
      setEditing(null);
    } catch { window.alert('備註暫時無法儲存，請稍後再試。'); }
  };
  const remove = async (favorite: MemberFavorite) => {
    if (!window.confirm(`要從收藏中移除「${favorite.school.name || '這個校科'}」嗎？`)) return;
    try {
      const result = await removeMemberFavorite(favorite.schoolKey);
      if (!result.active) return setActive(false);
      setFavorites((current) => current.filter((item) => item.schoolKey !== favorite.schoolKey));
    } catch { window.alert('暫時無法移除收藏，請稍後再試。'); }
  };

  if (loading) return <main className="min-h-screen bg-slate-50 px-4 py-16 text-center font-black text-slate-600">正在讀取你的收藏…</main>;
  if (!active) return <main className="min-h-screen bg-violet-50 px-4 py-12 text-slate-900"><section className="mx-auto max-w-2xl rounded-3xl border-4 border-slate-900 bg-white p-7 text-center shadow-[6px_6px_0_#161b35]"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-2 border-slate-900 bg-amber-300"><Crown className="h-8 w-8" /></div><h1 className="mt-5 text-3xl font-black">我的校科收藏</h1><p className="mt-3 font-bold leading-7 text-slate-600">這是會員專屬功能。啟用並以 LINE 登入後，收藏的校科、備註會安全同步到你的其他裝置。</p><a href={withBasePath('/membership')} className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-violet-600 px-5 py-3 font-black text-white shadow-[3px_3px_0_#161b35]"><Crown className="h-4 w-4" />查看會員方案</a></section></main>;

  return <main className="min-h-screen bg-slate-50 px-4 py-7 text-slate-900 sm:px-6"><section className="mx-auto max-w-4xl"><a href={withBasePath('/membership/account')} className="inline-flex items-center gap-2 text-sm font-black text-slate-600 hover:text-slate-950"><ArrowLeft className="h-4 w-4" />我的會員帳號</a><header className="mt-5 rounded-3xl border-4 border-slate-900 bg-rose-100 p-6 shadow-[6px_6px_0_#161b35]"><div className="flex items-start gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-slate-900 bg-white"><Heart className="h-7 w-7 fill-rose-500 text-rose-500" /></div><div><p className="text-xs font-black tracking-[.14em] text-rose-700">MEMBERSHIP FEATURE</p><h1 className="mt-1 text-3xl font-black">我的校科收藏</h1><p className="mt-2 text-sm font-bold text-slate-700">已同步 {favorites.length} 個校科；你的備註只會顯示在此會員帳號中。</p></div></div></header>
  {favorites.length === 0 ? <div className="mt-7 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center"><Heart className="mx-auto h-9 w-9 text-rose-400" /><h2 className="mt-3 text-xl font-black">還沒有收藏校科</h2><p className="mt-2 text-sm font-bold text-slate-500">在落點結果中按下「收藏校科」，就能在所有裝置接續整理。</p><a href={withBasePath('/')} className="mt-5 inline-flex rounded-xl border-2 border-slate-900 bg-indigo-600 px-4 py-2.5 text-sm font-black text-white">開始落點分析</a></div> : <div className="mt-7 grid gap-4">{favorites.map((favorite) => <article key={favorite.id} className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[3px_3px_0_#161b35]"><div className="flex justify-between gap-4"><div><h2 className="text-xl font-black">{String(favorite.school.name || '')}</h2><p className="mt-1 text-sm font-bold text-slate-600">{[favorite.school.region || favorite.school.district, favorite.school.type, favorite.school.group].filter(Boolean).join('・')}</p></div><button onClick={() => void remove(favorite)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-rose-300 bg-rose-50 text-rose-700" aria-label={`移除 ${favorite.school.name || ''} 的收藏`}><Trash2 className="h-4 w-4" /></button></div><div className="mt-4 rounded-xl border-2 border-slate-200 bg-slate-50 p-3">{editing === favorite.schoolKey ? <><label className="text-xs font-black text-slate-700">我的備註（最多 500 字）</label><textarea value={note} maxLength={500} onChange={(event) => setNote(event.target.value)} className="mt-2 min-h-24 w-full rounded-lg border-2 border-slate-900 bg-white p-2 text-sm font-bold" /><div className="mt-2 flex gap-2"><button onClick={() => void saveNote(favorite)} className="rounded-lg border-2 border-slate-900 bg-indigo-600 px-3 py-2 text-xs font-black text-white">儲存備註</button><button onClick={() => setEditing(null)} className="rounded-lg border-2 border-slate-300 bg-white px-3 py-2 text-xs font-black">取消</button></div></> : <div className="flex items-start justify-between gap-3"><p className="whitespace-pre-wrap text-sm font-bold text-slate-700">{favorite.note || '尚未留下備註。'}</p><button onClick={() => { setNote(favorite.note); setEditing(favorite.schoolKey); }} className="inline-flex shrink-0 items-center gap-1 text-xs font-black text-indigo-700"><NotebookPen className="h-4 w-4" />編輯</button></div>}</div></article>)}</div>}</section></main>;
}
