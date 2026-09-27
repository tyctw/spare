import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import './app-error.css';

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
      <main className="app-error-page">
        <section className="app-error-card" role="alert" aria-labelledby="app-error-title">
          <div className="app-error-icon"><RefreshCw aria-hidden="true" size={29} strokeWidth={2.2} /></div>
          <p className="app-error-eyebrow">頁面提醒</p>
          <h1 id="app-error-title">頁面暫時無法顯示</h1>
          <p className="app-error-description">載入時遇到問題，請先重新整理頁面。若仍無法顯示，可以返回首頁重新開始。</p>
          <div className="app-error-actions">
            <button type="button" className="app-error-reload" onClick={() => window.location.reload()}><RefreshCw aria-hidden="true" size={18} />重新整理頁面</button>
            <a className="app-error-home" href={withBasePath('/')}><ArrowLeft aria-hidden="true" size={18} />返回首頁</a>
          </div>
          <p className="app-error-note">尚未儲存的輸入可能需要重新填寫。</p>
        </section>
      </main>
    );
  }
}
