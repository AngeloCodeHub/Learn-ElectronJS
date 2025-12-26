import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import netflixLogo from '@/assets/Netflix00-logo.png';
import disneyLogo from '@/assets/Disney.png';

type FlowStatus = 'idle' | 'running' | 'success' | 'skipped' | 'error';

const statusCopy: Record<FlowStatus, { label: string; dot: string; panel: string }> = {
  idle: {
    label: '待命',
    dot: 'bg-slate-400',
    panel: 'border-slate-700/60 bg-slate-900/60 text-slate-100',
  },
  running: {
    label: '執行中',
    dot: 'bg-amber-300',
    panel: 'border-amber-400/60 bg-amber-500/15 text-amber-50',
  },
  success: {
    label: '完成',
    dot: 'bg-emerald-300',
    panel: 'border-emerald-400/60 bg-emerald-500/15 text-emerald-50',
  },
  skipped: {
    label: '已登入',
    dot: 'bg-cyan-300',
    panel: 'border-cyan-400/60 bg-cyan-500/15 text-cyan-50',
  },
  error: {
    label: '錯誤',
    dot: 'bg-rose-300',
    panel: 'border-rose-500/60 bg-rose-600/15 text-rose-50',
  },
};

function App() {
  const [status, setStatus] = useState<FlowStatus>('idle');
  const [message, setMessage] = useState('準備就緒');
  const [isRunning, setIsRunning] = useState(false);
  const [disneyStatus, setDisneyStatus] = useState<FlowStatus>('idle');
  const [disneyMessage, setDisneyMessage] = useState('準備就緒');
  const [isDisneyRunning, setIsDisneyRunning] = useState(false);

  const statusMeta = useMemo(() => statusCopy[status], [status]);
  const disneyStatusMeta = useMemo(() => statusCopy[disneyStatus], [disneyStatus]);

  const handleStart = async () => {
    if (isRunning) return;

    if (!window.electronAPI?.startNetflixLogin) {
      setStatus('error');
      setMessage('缺少 electronAPI bridge');
      return;
    }

    setIsRunning(true);
    setStatus('running');
    setMessage('啟動自動登入...');

    try {
      const result = await window.electronAPI.startNetflixLogin();
      const nextStatus: FlowStatus = result.status === 'success'
        ? 'success'
        : result.status === 'skipped'
          ? 'skipped'
          : 'error';

      setStatus(nextStatus);
      setMessage(result.message);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : '觸發自動化時發生未知錯誤');
    } finally {
      setIsRunning(false);
    }
  };

  const handleDisneyLaunch = async () => {
    if (isDisneyRunning) return;

    if (!window.electronAPI?.launchDisney) {
      setDisneyStatus('error');
      setDisneyMessage('缺少 electronAPI bridge');
      return;
    }

    setIsDisneyRunning(true);
    setDisneyStatus('running');
    setDisneyMessage('啟動 Disney+...');

    try {
      const result = await window.electronAPI.launchDisney();
      const nextStatus: FlowStatus = result.status === 'success' ? 'success' : 'error';

      setDisneyStatus(nextStatus);
      setDisneyMessage(result.message);
    } catch (error) {
      setDisneyStatus('error');
      setDisneyMessage(error instanceof Error ? error.message : '啟動 Disney+ 時發生未知錯誤');
    } finally {
      setIsDisneyRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-8 px-6 py-10">
        <div className="flex items-center gap-8">
          {/* Netflix 狀態 */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
            <span className={`h-2.5 w-2.5 rounded-full ${statusMeta.dot}`} />
            <span className="text-sm font-semibold text-white">Netflix: {statusMeta.label}</span>
          </div>

          {/* Disney+ 狀態 */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
            <span className={`h-2.5 w-2.5 rounded-full ${disneyStatusMeta.dot}`} />
            <span className="text-sm font-semibold text-white">Disney+: {disneyStatusMeta.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Netflix 按鈕 */}
          <button
            type="button"
            onClick={handleStart}
            disabled={isRunning}
            className="group relative isolate flex h-55 w-55 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl shadow-red-800/30 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-red-600/40 active:scale-95 disabled:opacity-70"
            aria-label="Start Netflix Auto Login"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.35),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(248,113,113,0.28),transparent_50%)]" />
            <img
              src={netflixLogo}
              alt="Netflix"
              className="relative h-35 w-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition duration-300 group-hover:scale-105"
            />
          </button>

          {/* Disney+ 按鈕 */}
          <button
            type="button"
            onClick={handleDisneyLaunch}
            disabled={isDisneyRunning}
            className="group relative isolate flex h-55 w-55 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl shadow-blue-800/30 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-blue-600/40 active:scale-95 disabled:opacity-70"
            aria-label="Launch Disney Plus"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.35),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(96,165,250,0.28),transparent_50%)]" />
            <img
              src={disneyLogo}
              alt="Disney+"
              className="relative h-35 w-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition duration-300 group-hover:scale-105"
            />
          </button>
        </div>

        <div className="flex gap-4 w-full max-w-5xl">
          {/* Netflix 訊息面板 */}
          <div className={`flex-1 rounded-2xl border px-5 py-4 text-sm shadow-lg backdrop-blur ${statusMeta.panel}`}>
            <p className="font-mono leading-relaxed">{message}</p>
          </div>

          {/* Disney+ 訊息面板 */}
          <div className={`flex-1 rounded-2xl border px-5 py-4 text-sm shadow-lg backdrop-blur ${disneyStatusMeta.panel}`}>
            <p className="font-mono leading-relaxed">{disneyMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.body);
root.render(<App />);
