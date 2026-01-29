import { useEffect, useMemo, useState } from 'react';

export default function ProfilerPanel() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const urlEnabled = new URLSearchParams(window.location.search).get('perf') === '1';
    const stored = localStorage.getItem('showProfiler') === 'true';
    return urlEnabled || stored;
  });
  const [logs, setLogs] = useState(() => (typeof window !== 'undefined' ? (window.__perfLogs || []) : []));

  useEffect(() => {
    const handle = (event) => {
      setLogs((prev) => {
        const next = [...prev, event.detail];
        return next.length > 200 ? next.slice(-200) : next;
      });
    };
    window.addEventListener('perf_log', handle);
    return () => window.removeEventListener('perf_log', handle);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('showProfiler', enabled ? 'true' : 'false');
  }, [enabled]);

  const summary = useMemo(() => {
    if (!logs.length) return { count: 0, avgClient: 0, avgServer: 0, slowCount: 0 };
    const totalClient = logs.reduce((sum, l) => sum + (l.clientDurationMs || 0), 0);
    const serverValues = logs.map((l) => l.serverDurationMs).filter((v) => typeof v === 'number');
    const totalServer = serverValues.reduce((sum, v) => sum + v, 0);
    const slowCount = logs.filter((l) => (l.clientDurationMs || 0) > 800).length;
    return {
      count: logs.length,
      avgClient: totalClient / logs.length,
      avgServer: serverValues.length ? totalServer / serverValues.length : 0,
      slowCount
    };
  }, [logs]);

  if (!enabled) {
    return (
      <button
        type="button"
        onClick={() => setEnabled(true)}
        className="fixed bottom-4 right-4 z-[9999] text-xs px-3 py-2 rounded-full bg-black text-white shadow-lg opacity-70 hover:opacity-100"
      >
        Show Profiler
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[360px] max-h-[60vh] bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900 text-white">
        <div className="text-xs font-semibold">Performance Profiler</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLogs([])}
            className="text-[11px] px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setEnabled(false)}
            className="text-[11px] px-2 py-1 rounded bg-red-600 hover:bg-red-500"
          >
            Hide
          </button>
        </div>
      </div>

      <div className="px-3 py-2 border-b border-gray-200 text-xs text-gray-700 grid grid-cols-2 gap-2">
        <div>Requests: <span className="font-semibold">{summary.count}</span></div>
        <div>Slow (>800ms): <span className="font-semibold">{summary.slowCount}</span></div>
        <div>Avg client: <span className="font-semibold">{summary.avgClient.toFixed(1)}ms</span></div>
        <div>Avg server: <span className="font-semibold">{summary.avgServer.toFixed(1)}ms</span></div>
      </div>

      <div className="max-h-[45vh] overflow-auto">
        {logs.length === 0 ? (
          <div className="p-3 text-xs text-gray-500">No requests captured yet.</div>
        ) : (
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="text-left px-2 py-1">Method</th>
                <th className="text-left px-2 py-1">Endpoint</th>
                <th className="text-right px-2 py-1">Client</th>
                <th className="text-right px-2 py-1">Server</th>
                <th className="text-right px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...logs].reverse().map((log, idx) => (
                <tr key={`${log.ts}-${idx}`} className="border-t border-gray-100">
                  <td className="px-2 py-1 font-medium">{log.method}</td>
                  <td className="px-2 py-1 truncate max-w-[160px]" title={log.endpoint}>{log.endpoint}</td>
                  <td className="px-2 py-1 text-right">
                    {log.clientDurationMs?.toFixed ? log.clientDurationMs.toFixed(1) : log.clientDurationMs}ms
                  </td>
                  <td className="px-2 py-1 text-right">
                    {log.serverDurationMs != null ? `${log.serverDurationMs.toFixed(1)}ms` : '—'}
                  </td>
                  <td className="px-2 py-1 text-right">
                    <span className={log.status >= 400 ? 'text-red-600' : 'text-green-600'}>{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
