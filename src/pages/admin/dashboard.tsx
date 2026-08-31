import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import type { ActivityLog } from '@/lib/supabase';
import {
  Package,
  Images,
  UserCog,
  ScrollText,
  ArrowRight,
  TrendingUp,
  Clock,
  Activity,
} from 'lucide-react';

interface DashboardStats {
  products: number;
  services: number;
  gallery: number;
  logs: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ products: 0, services: 0, gallery: 0, logs: 0 });
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [
        { count: productCount },
        { count: serviceCount },
        { count: galleryCount },
        { count: logCount },
        { data: logs },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
        supabase.from('activity_logs').select('*', { count: 'exact', head: true }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      setStats({
        products: productCount || 0,
        services: serviceCount || 0,
        gallery: galleryCount || 0,
        logs: logCount || 0,
      });
      setRecentLogs((logs as ActivityLog[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const quickLinks = [
    {
      label: 'Products & Services',
      description: 'Manage your product catalog and services',
      href: '/admin/products',
      icon: Package,
      count: stats.products + stats.services,
      color: 'from-primary/20 to-blue-500/20',
      border: 'border-primary/20',
      text: 'text-primary',
    },
    {
      label: 'Gallery',
      description: 'Upload and manage gallery images',
      href: '/admin/gallery',
      icon: Images,
      count: stats.gallery,
      color: 'from-violet-500/20 to-purple-500/20',
      border: 'border-violet-500/20',
      text: 'text-violet-400',
    },
    {
      label: 'Profile & Contact',
      description: 'Edit company info and contact details',
      href: '/admin/profile',
      icon: UserCog,
      count: null,
      color: 'from-emerald-500/20 to-green-500/20',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
    },
    {
      label: 'Activity Logs',
      description: 'View login and change history',
      href: '/admin/logs',
      icon: ScrollText,
      count: stats.logs,
      color: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-blue-500/5 to-transparent border border-primary/15 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/15 rounded-xl">
            <TrendingUp className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome to Admin Panel</h2>
            <p className="text-zinc-400 text-sm">Manage your website content, galleryand company profile from here.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`bg-gradient-to-br ${item.color} border ${item.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-zinc-900/50 ${item.text}`}>
                    <Icon size={20} />
                  </div>
                  {item.count !== null && (
                    <span className={`text-2xl font-extrabold ${item.text}`}>{item.count}</span>
                  )}
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{item.label}</h3>
                <p className="text-zinc-500 text-xs">{item.description}</p>
                <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${item.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Manage <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="text-primary w-5 h-5" />
            <h3 className="text-white font-bold text-sm">Recent Activity</h3>
          </div>
          <Link href="/admin/logs" className="text-primary text-xs font-semibold hover:text-primary/80 flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div className="p-12 text-center text-zinc-600 text-sm">No activity logs yet</div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {recentLogs.map((log) => (
              <div key={log.id} className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-800/30 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.action === 'LOGIN' ? 'bg-emerald-500' :
                    log.action === 'CREATE' ? 'bg-blue-500' :
                      log.action === 'UPDATE' ? 'bg-amber-500' :
                        log.action === 'DELETE' ? 'bg-red-500' : 'bg-zinc-500'
                  }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{log.details}</p>
                  <p className="text-zinc-500 text-xs">{log.user_email} · {log.entity_type}</p>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-600 text-xs flex-shrink-0">
                  <Clock size={12} />
                  {new Date(log.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
