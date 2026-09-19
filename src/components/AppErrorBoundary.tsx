import React from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10 text-slate-900">
        <section className="w-full max-w-lg rounded-3xl border-4 border-slate-900 bg-white p-7 text-center shadow-[8px_8px_0_#0f172a] sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-4 border-slate-900 bg-amber-300 shadow-[3px_3px_0_#0f172a]"><AlertTriangle className="h-8 w-8" /></div>
          <h1 className="mt-5 text-2xl font-black">頁面暫時無法顯示</h1>
          <p className="mt-3 text-sm font-bold leading-6 text-slate-600">分析資料可能已過期或不完整。請回到首頁重新進行分析；你的其他設定不會受到影響。</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => window.location.reload()} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-sky-200 px-4 py-3 text-sm font-black shadow-[2px_2px_0_#0f172a]"><RefreshCw className="h-4 w-4" />重新載入</button>
            <a href={withBasePath('/')} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-[2px_2px_0_#0f172a]"><ArrowLeft className="h-4 w-4" />回到首頁</a>
          </div>
        </section>
      </main>
    );
  }
}
