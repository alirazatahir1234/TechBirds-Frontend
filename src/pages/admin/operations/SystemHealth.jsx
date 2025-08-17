import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { RefreshCw, Server, Activity, HardDrive, Database, Wifi, Shield, Clock } from 'lucide-react';

export default function SystemHealth() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHealth = async () => {
    setLoading(true);
    setError('');
    try {
      // Try common health endpoints; first one that works is used
      const candidates = ['/health', '/api/health', '/admin/health'];
      let res;
      for (const path of candidates) {
        try {
          res = await api.get(path);
          if (res?.status >= 200 && res?.status < 300) break;
        } catch(err) { /* try next */ }
      }
      if (!res) throw new Error('No health endpoint responded');
      setData(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to fetch system health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHealth(); }, []);

  const statusPill = (status) => {
    const ok = (status || '').toString().toLowerCase();
    const cls = ok === 'healthy' || ok === 'ok' || ok === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    return <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>{status || 'unknown'}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Health</h1>
        <button onClick={fetchHealth} className="inline-flex items-center px-3 py-2 border rounded-md bg-white hover:bg-gray-50">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}

      {!data && !error && (
        <div className="p-4 bg-white border rounded">Loading...</div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white border rounded p-4">
            <div className="flex items-center gap-2 mb-3"><Server className="w-4 h-4 text-gray-500" /><h2 className="font-semibold">Application</h2></div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Status</span>{statusPill(data.status || data.appStatus)}</div>
              <div className="flex justify-between"><span>Version</span><span>{data.version || data.appVersion || 'n/a'}</span></div>
              <div className="flex justify-between"><span>Environment</span><span>{data.environment || data.env || 'n/a'}</span></div>
              <div className="flex justify-between"><span>Uptime</span><span>{data.uptime || data.uptimeSeconds ? `${data.uptimeSeconds}s` : 'n/a'}</span></div>
            </div>
          </div>

          <div className="bg-white border rounded p-4">
            <div className="flex items-center gap-2 mb-3"><Database className="w-4 h-4 text-gray-500" /><h2 className="font-semibold">Database</h2></div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Status</span>{statusPill((data.database && data.database.status) || data.dbStatus)}</div>
              <div className="flex justify-between"><span>Provider</span><span>{(data.database && data.database.provider) || data.dbProvider || 'n/a'}</span></div>
              <div className="flex justify-between"><span>Latency</span><span>{(data.database && data.database.latencyMs) || data.dbLatencyMs || 'n/a'} ms</span></div>
            </div>
          </div>

          <div className="bg-white border rounded p-4">
            <div className="flex items-center gap-2 mb-3"><Wifi className="w-4 h-4 text-gray-500" /><h2 className="font-semibold">External Services</h2></div>
            <div className="space-y-2 text-sm">
              {(data.services || data.external || []).map((s, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{s.name}</span>
                  {statusPill(s.status)}
                </div>
              ))}
              {(!data.services || data.services.length === 0) && <div className="text-gray-500">No external services reported</div>}
            </div>
          </div>

          <div className="bg-white border rounded p-4">
            <div className="flex items-center gap-2 mb-3"><HardDrive className="w-4 h-4 text-gray-500" /><h2 className="font-semibold">Storage</h2></div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Disk Usage</span><span>{(data.storage && data.storage.diskUsage) || 'n/a'}</span></div>
              <div className="flex justify-between"><span>Uploads Path</span><span>{(data.storage && data.storage.uploadsPath) || 'n/a'}</span></div>
            </div>
          </div>

          <div className="bg-white border rounded p-4">
            <div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-gray-500" /><h2 className="font-semibold">Security</h2></div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Auth</span>{statusPill((data.security && data.security.auth) || 'unknown')}</div>
              <div className="flex justify-between"><span>CORS</span>{statusPill((data.security && data.security.cors) || 'unknown')}</div>
            </div>
          </div>

          <div className="bg-white border rounded p-4">
            <div className="flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-gray-500" /><h2 className="font-semibold">Metrics</h2></div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Requests/min</span><span>{(data.metrics && data.metrics.rpm) || 'n/a'}</span></div>
              <div className="flex justify-between"><span>Error Rate</span><span>{(data.metrics && data.metrics.errorRate) || 'n/a'}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
