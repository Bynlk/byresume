/**
 * 管理后台统计数据自定义Hook
 * 从服务器API获取实时统计数据
 */

import { useState, useEffect, useCallback } from 'react';

export interface AdminStats {
  pdfExports: number;
  aiUsage: number;
  exportsLast30Days: number;
  aiUsageLast30Days: number;
  totalEvents: number;
  eventsLast30Days: number;
}

export interface TemplateDistribution {
  templateId: string;
  count: number;
}

export interface RecentExport {
  id: string;
  exportedAt: string;
  format: string;
  templateId?: string;
}

export interface DailyTrend {
  date: string;
  pdfExports: number;
  aiUsage: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [templateDistribution, setTemplateDistribution] = useState<TemplateDistribution[]>([]);
  const [recentExports, setRecentExports] = useState<RecentExport[]>([]);
  const [dailyTrends, setDailyTrends] = useState<DailyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/byresume/api/admin/stats');
      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await res.json();

      setStats({
        pdfExports: data.stats?.pdfExports || 0,
        aiUsage: data.stats?.aiUsage || 0,
        exportsLast30Days: data.stats?.exportsLast30Days || 0,
        aiUsageLast30Days: data.stats?.aiUsageLast30Days || 0,
        totalEvents: (data.stats?.pdfExports || 0) + (data.stats?.aiUsage || 0),
        eventsLast30Days: (data.stats?.exportsLast30Days || 0) + (data.stats?.aiUsageLast30Days || 0),
      });
      setTemplateDistribution(data.templateDistribution || []);
      setRecentExports(data.recentExports || []);
      setDailyTrends([]);
      setError(null);
    } catch (err) {
      console.error('获取统计数据失败:', err);
      setError('无法加载统计数据');
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = useCallback(async () => {
    try {
      const res = await fetch('/byresume/api/admin/stats');
      const data = await res.json();
      const events = [
        ...(data.recentExports || []).map((e: RecentExport) => ({
          type: 'pdf_export',
          timestamp: e.exportedAt,
          format: e.format,
        })),
      ];
      const headers = ['type', 'timestamp', 'format'];
      const csvContent = [
        headers.join(','),
        ...events.map((e: Record<string, string>) => [e.type, e.timestamp, e.format].join(',')),
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `byresume-stats-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('导出报告失败:', err);
      return false;
    }
  }, []);

  const clearAllData = useCallback(() => {
    // Server-side data cannot be cleared from client
    alert('统计数据存储在服务器数据库中，无法从客户端清除。');
    return false;
  }, []);

  useEffect(() => {
    fetchStats();

    const intervalId = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchStats]);

  return {
    stats,
    templateDistribution,
    recentExports,
    dailyTrends,
    loading,
    error,
    refresh: fetchStats,
    exportReport,
    clearAllData,
  };
}