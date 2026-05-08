"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download, Brain, FileText, TrendingUp, RefreshCw, PieChart, Calendar, Settings, Lock, BarChart3, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useAdminStats } from "@/hooks/useAdminStats";
import TrendChart from "@/components/admin/TrendChart";
import SettingsModal from "@/components/admin/SettingsModal";
import PasswordModal from "@/components/admin/PasswordModal";

export default function AdminDashboard() {
  const [showSettings, setShowSettings] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true); // 默认显示密码验证
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const {
    stats,
    templateDistribution,
    recentExports,
    dailyTrends,
    loading,
    error,
    refresh,
    exportReport,
    clearAllData,
  } = useAdminStats();

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeedbacks();
    }
  }, [isAuthenticated]);

  const fetchFeedbacks = async () => {
    setFeedbackLoading(true);
    try {
      const adminPassword = sessionStorage.getItem("admin_password") || "";
      const res = await fetch('/byresume/api/feedback', {
        headers: { "x-admin-password": adminPassword },
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data || []);
      }
    } catch (err) {
      // 静默失败，不记录错误
    } finally {
      setFeedbackLoading(false);
    }
  };

  // 如果未认证且需要密码验证，显示密码模态框
  if (!isAuthenticated && showPasswordModal) {
    return <PasswordModal onSuccess={() => {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
    }} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载管理数据中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-destructive">错误</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
        </div>
      </div>
    );
  }

  // 默认模板名称映射
  const templateNameMap: Record<string, string> = {
    "tpl-1": "现代风格",
    "modern": "现代风格",
    "tpl-2": "经典风格",
    "tpl-7": "经典风格",
    "classic": "经典风格",
    "tpl-3": "极简风格",
    "minimal": "极简风格",
    "tpl-5": "创意风格",
    "creative": "创意风格",
    "tpl-9": "科技风格",
    "tech": "科技风格",
    "tpl-10": "优雅风格",
    "elegant": "优雅风格",
    "tpl-11": "专业风格",
    "professional": "专业风格",
    "tpl-12": "现代极简风格",
    "modernminimal": "现代极简风格",
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">管理后台</h1>
          <p className="text-muted-foreground">基于真实用户交互数据的动态监控面板</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="mr-2 h-4 w-4" />
            系统设置
          </Button>
        </div>
      </header>

      {/* 统计卡片 - 只保留核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PDF 导出次数</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pdfExports.toLocaleString() ?? 0}</div>
            <p className="text-xs text-muted-foreground">过去30天: {stats?.exportsLast30Days ?? 0} 次</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI 使用次数</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.aiUsage.toLocaleString() ?? 0}</div>
            <p className="text-xs text-muted-foreground">过去30天: {stats?.aiUsageLast30Days ?? 0} 次</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总事件数</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEvents.toLocaleString() ?? 0}</div>
            <p className="text-xs text-muted-foreground">过去30天: {stats?.eventsLast30Days ?? 0} 次</p>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>使用趋势</CardTitle>
          <CardDescription>过去30天PDF导出与AI使用量</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart data={dailyTrends} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 最近导出活动 */}
        <Card>
          <CardHeader>
            <CardTitle>最近导出记录</CardTitle>
            <CardDescription>最近的PDF导出记录（仅显示时间）</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentExports.length > 0 ? (
                recentExports.map((exportItem) => (
                  <li key={exportItem.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">PDF导出</p>
                      <p className="text-sm text-muted-foreground">
                        模板: {templateNameMap[exportItem.templateId || ''] || exportItem.templateId || '未知'}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDateTime(exportItem.exportedAt)}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">暂无导出记录</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* 模板使用情况 */}
        <Card>
          <CardHeader>
            <CardTitle>模板使用分布</CardTitle>
            <CardDescription>各模板被使用的次数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templateDistribution.length > 0 ? (
                templateDistribution.map((template) => (
                  <div key={template.templateId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mr-3" />
                      <span className="truncate max-w-[180px]">
                        {templateNameMap[template.templateId] || template.templateId}
                      </span>
                    </div>
                    <span className="font-semibold">{template.count} 次</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">暂无模板使用数据</p>
              )}
            </div>
            <div className="mt-6 pt-6 border-t">
              <Button variant="outline" className="w-full" asChild>
                <a href="/byresume/editor">前往模板管理</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 用户反馈 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              用户反馈
            </CardTitle>
            <CardDescription>用户提交的反馈与建议</CardDescription>
          </CardHeader>
          <CardContent>
            {feedbackLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">加载反馈中...</p>
              </div>
            ) : feedbacks.length > 0 ? (
              <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {feedbacks.map((feedback) => (
                  <li key={feedback.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{feedback.user?.name || feedback.email?.split('@')[0] || '匿名用户'}</p>
                        <p className="text-sm text-muted-foreground">{feedback.email || '无邮箱'}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDateTime(feedback.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium">{feedback.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{feedback.content}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${feedback.type === 'bug' ? 'bg-red-100 text-red-800' : feedback.type === 'suggestion' ? 'bg-blue-100 text-blue-800' : feedback.type === 'feature' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {feedback.type === 'bug' ? 'Bug' : feedback.type === 'suggestion' ? '建议' : feedback.type === 'feature' ? '功能请求' : '其他'}
                      </span>
                      {feedback.status === 'resolved' && (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">已处理</span>
                      )}
                      {feedback.rating && (
                        <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">评分: {feedback.rating}/5</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-8">暂无用户反馈</p>
            )}
            
          </CardContent>
        </Card>
      </div>

      {/* 底部操作 */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button onClick={exportReport}>
          <FileText className="mr-2 h-4 w-4" />
          导出完整报告 (CSV)
        </Button>
        <Button variant="outline" onClick={refresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          刷新数据
        </Button>
        <Button variant="outline" onClick={() => setShowSettings(true)}>
          <Settings className="mr-2 h-4 w-4" />
          系统设置
        </Button>
        <Button variant="outline" onClick={() => {
          setIsAuthenticated(false);
          setShowPasswordModal(true);
        }}>
          <Lock className="mr-2 h-4 w-4" />
          重新验证
        </Button>
      </div>

      {/* 设置模态框 */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onClearData={clearAllData}
        onExportReport={exportReport}
      />
    </div>
  );
}

// 格式化日期时间：年-月-日 时:分
function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
