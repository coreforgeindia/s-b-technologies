import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ActivityLog } from '@/lib/supabase';
import {
  ScrollText, Clock, Filter, RefreshCw, LogIn, Plus, Pencil, Trash2,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

const ACTION_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  LOGIN: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  CREATE: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-500' },
  UPDATE: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-500' },
  DELETE: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-500' },
};

const ACTION_ICONS: Record<string, typeof LogIn> = {
  LOGIN: LogIn,
  CREATE: Plus,
  UPDATE: Pencil,
  DELETE: Trash2,
};

const PAGE_SIZE = 20;

export default function AdminLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [filterEntity, setFilterEntity] = useState<string>('ALL');

  const loadLogs = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filterAction !== 'ALL') query = query.eq('action', filterAction);
    if (filterEntity !== 'ALL') query = query.eq('entity_type', filterEntity);

    query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    const { data, count } = await query;
    setLogs((data as ActivityLog[]) || []);
    setTotal(count || 0);
    setLoading(false);
  }, [page, filterAction, filterEntity]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl">
            <ScrollText className="text-amber-400 w-5 h-5" />
          </div>
          <div>
            <span className="text-white font-bold text-lg">{total}</span>
            <span className="text-zinc-500 text-sm ml-2">Total Logs</span>
          </div>
        </div>

        <button
          onClick={loadLogs}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-400 rounded-xl text-xs font-bold hover:text-white hover:bg-zinc-700 transition-all"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-zinc-500" />
          <span className="text-zinc-500 text-xs font-bold uppercase">Action:</span>
          {['ALL', 'LOGIN', 'CREATE', 'UPDATE', 'DELETE'].map((action) => (
            <button
              key={action}
              onClick={() => { setFilterAction(action); setPage(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterAction === action
                  ? 'bg-primary text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
              }`}
            >
              {action}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-xs font-bold uppercase">Entity:</span>
          {['ALL', 'auth', 'product', 'service', 'gallery', 'profile'].map((entity) => (
            <button
              key={entity}
              onClick={() => { setFilterEntity(entity); setPage(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterEntity === entity
                  ? 'bg-primary text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
              }`}
            >
              {entity}
            </button>
          ))}
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-zinc-600 text-sm">No logs found matching your filters</div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {logs.map((log) => {
              const colors = ACTION_COLORS[log.action] || { bg: 'bg-zinc-800', text: 'text-zinc-400', dot: 'bg-zinc-500' };
              const Icon = ACTION_ICONS[log.action] || ScrollText;
              return (
                <div key={log.id} className="px-6 py-4 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${colors.bg} flex-shrink-0 mt-0.5`}>
                      <Icon size={14} className={colors.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white text-sm font-medium">{log.details}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-zinc-500 text-xs">{log.user_email}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${colors.bg} ${colors.text} border border-current/10`}>
                              {log.action}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                              {log.entity_type}
                            </span>
                            {log.entity_id && (
                              <span className="text-zinc-600 text-xs font-mono">{log.entity_id}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-600 text-xs flex-shrink-0">
                          <Clock size={12} />
                          {new Date(log.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-500 text-xs">
              Page {page + 1} of {totalPages} ({total} total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
