import { useState, useEffect } from 'react';
import { 
  Activity, RefreshCw, CheckCircle, XCircle, 
  AlertCircle, Clock, MessageSquare, AtSign,
  Filter, Search
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WebhookLog {
  id: string;
  event_type: string;
  instagram_user_id: string | null;
  sender_id: string | null;
  message_text: string | null;
  comment_text: string | null;
  media_id: string | null;
  automation_id: string | null;
  automation_name: string | null;
  response_sent: string | null;
  status: 'received' | 'matched' | 'replied' | 'error' | 'ignored';
  error_message: string | null;
  processing_time_ms: number | null;
  created_at: string;
}

export function AdminWebhookLogsPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLogs();
    
    // Real-time subscription
    const channel = supabase
      .channel('webhook_logs_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'webhook_logs' 
      }, (payload) => {
        setLogs(prev => [payload.new as WebhookLog, ...prev].slice(0, 100));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'replied':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'ignored':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'dm':
        return <MessageSquare className="w-4 h-4" />;
      case 'comment':
        return <AtSign className="w-4 h-4" />;
      case 'story_mention':
        return <Activity className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        log.message_text?.toLowerCase().includes(searchLower) ||
        log.comment_text?.toLowerCase().includes(searchLower) ||
        log.automation_name?.toLowerCase().includes(searchLower) ||
        log.sender_id?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: logs.length,
    replied: logs.filter(l => l.status === 'replied').length,
    errors: logs.filter(l => l.status === 'error').length,
    ignored: logs.filter(l => l.status === 'ignored').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhook Logs</h1>
          <p className="text-gray-500 text-sm">Real-time monitoring of Instagram events</p>
        </div>
        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Replied</p>
          <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Errors</p>
          <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Ignored</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.ignored}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="replied">Replied</option>
            <option value="error">Errors</option>
            <option value="ignored">Ignored</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No webhook events yet</p>
            <p className="text-gray-400 text-sm">Events will appear here when Instagram sends them</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Content</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Automation</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                          {getEventIcon(log.event_type)}
                        </span>
                        <span className="text-sm font-medium capitalize">{log.event_type}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900 max-w-xs truncate">
                        {log.message_text || log.comment_text || '-'}
                      </p>
                      {log.sender_id && (
                        <p className="text-xs text-gray-400">From: {log.sender_id}</p>
                      )}
                    </td>
                    <td className="p-4">
                      {log.automation_name ? (
                        <span className="text-sm text-purple-600 font-medium">{log.automation_name}</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span className={`text-sm capitalize ${
                          log.status === 'replied' ? 'text-green-600' :
                          log.status === 'error' ? 'text-red-600' :
                          log.status === 'ignored' ? 'text-yellow-600' :
                          'text-gray-500'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      {log.error_message && (
                        <p className="text-xs text-red-500 mt-1 max-w-xs truncate">{log.error_message}</p>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {log.processing_time_ms ? `${log.processing_time_ms}ms` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Live Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Live updates enabled - new events will appear automatically
      </div>
    </div>
  );
}

export default AdminWebhookLogsPage;
