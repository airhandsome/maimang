'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { http, type StatisticsResponse, type Activity, type ContentTrendData, type MonthlyStatsData } from '@/lib/http';
import { Chart, registerables } from 'chart.js';

// 注册 Chart.js 组件
Chart.register(...registerables);

export default function AdminDashboard() {
  const router = useRouter();
  const activityChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const activityChartInstance = useRef<Chart | null>(null);
  const categoryChartInstance = useRef<Chart | null>(null);

  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [contentTrend, setContentTrend] = useState<ContentTrendData[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStatsData[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [pendingWorksTotal, setPendingWorksTotal] = useState<number>(0);
  const [pendingCommentsTotal, setPendingCommentsTotal] = useState<number>(0);
  // 已移至 AdminLayout 头部：搜索/提醒/私信

  // 私信逻辑移至头部/独立页面
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAssetUrl = (url?: string) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1';
    const origin = apiBase.replace(/\/api\/v1$/, '');
    return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
  };

  // 搜索逻辑移至头部

  const openNotificationTarget = (n: any) => {
    console.log('[Dashboard] notification click', n);
    // 优先使用后端提供的链接
    const link = n.link || n.link_url || n.url || n.LinkURL;
    console.log('[Dashboard] resolved link', link);
    if (link && typeof link === 'string') {
      // 内部路由直接跳转，外部URL使用window.open
      if (link.startsWith('/')) {
        console.log('[Dashboard] router.push', link);
        router.push(link);
      } else if (/^https?:\/\//i.test(link)) {
        console.log('[Dashboard] window.open', link);
        if (typeof window !== 'undefined') window.open(link, '_blank');
      } else {
        console.log('[Dashboard] router.push (fallback)', link);
        router.push(link);
      }
      return;
    }
    // 根据可能的字段类型推断跳转
    if (n.work_id || n.WorkID) {
      console.log('[Dashboard] go to works');
      router.push('/admin/works');
      return;
    }
    if (n.comment_id || n.CommentID) {
      console.log('[Dashboard] go to comments');
      router.push('/admin/comments');
      return;
    }
    if (n.activity_id || n.ActivityID) {
      console.log('[Dashboard] go to activities');
      router.push('/admin/activities');
      return;
    }
    console.log('[Dashboard] notification no target');
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, contentTrendRes, monthlyRes, activitiesRes, pendingWorksRes, pendingCommentsRes] = await Promise.all([
          http.getDashboardStats(),
          http.getContentTrendStats(),
          http.getMonthlyStats(),
          http.getAdminActivities({ page: 1, per_page: 5, sort_by: 'date', sort_dir: 'desc' }),
          http.getPendingWorks({ page: 1, per_page: 1 }),
          http.getComments({ page: 1, per_page: 1, status: 'pending' })
        ]);

        if (statsRes.success && statsRes.data) setStats(statsRes.data);
        if (contentTrendRes.success && contentTrendRes.data) setContentTrend(contentTrendRes.data);
        if (monthlyRes.success && monthlyRes.data) setMonthlyStats(monthlyRes.data);
        if (activitiesRes.success) setRecentActivities(activitiesRes.data || []);
        setPendingWorksTotal(pendingWorksRes?.meta?.total || 0);
        setPendingCommentsTotal(pendingCommentsRes?.meta?.total || 0);
      } catch (e: any) {
        setError(e?.message || '获取仪表盘数据失败');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    // 清理旧的图表实例
    if (activityChartInstance.current) {
      activityChartInstance.current.destroy();
    }
    if (categoryChartInstance.current) {
      categoryChartInstance.current.destroy();
    }

    // 活跃度趋势图
    if (activityChartRef.current && monthlyStats.length > 0) {
      const activityCtx = activityChartRef.current.getContext('2d');
      if (activityCtx) {
        activityChartInstance.current = new Chart(activityCtx, {
          type: 'line',
          data: {
            labels: monthlyStats.map(m => m.month),
            datasets: [
              {
                label: '新增作品',
                data: monthlyStats.map(m => m.new_works),
                borderColor: '#F5C332',
                backgroundColor: 'rgba(245, 195, 50, 0.1)',
                tension: 0.3,
                fill: true
              },
              {
                label: '新增用户',
                data: monthlyStats.map(m => m.new_users),
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                tension: 0.3,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }

    // 作品分类占比图
    if (categoryChartRef.current && contentTrend.length > 0) {
      const categoryCtx = categoryChartRef.current.getContext('2d');
      if (categoryCtx) {
        categoryChartInstance.current = new Chart(categoryCtx, {
          type: 'doughnut',
          data: {
            labels: contentTrend.map(c => c.category),
            datasets: [{
              data: contentTrend.map(c => c.count),
              backgroundColor: [
                '#F5C332',
                '#2196F3',
                '#4CAF50',
                '#FF9800'
              ],
              borderWidth: 0,
              hoverOffset: 5
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    }

    // 清理函数
    return () => {
      if (activityChartInstance.current) {
        activityChartInstance.current.destroy();
      }
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }
    };
  }, [monthlyStats, contentTrend]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">仪表盘</h2>
        <p className="text-gray-500">欢迎回来！以下是平台最新数据概览</p>
        {/* 头部已提供全局搜索/提醒/私信，这里移除重复模块 */}
      </div>

      {/* 数据统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* 用户统计 */}
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">总用户数</p>
              <h3 className="text-3xl font-bold">{loading ? '...' : (stats?.total_users?.toLocaleString?.() || '0')}</h3>
              <p className={`text-sm mt-2 flex items-center ${stats && stats.user_growth_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <i className={`fa fa-arrow-${stats && stats.user_growth_rate >= 0 ? 'up' : 'down'} mr-1`}></i>
                {stats ? `${Math.abs(stats.user_growth_rate).toFixed(1)}%` : '0%'} <span className="text-gray-500 ml-1">较上月</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-users text-xl"></i>
            </div>
          </div>
        </div>

        {/* 作品统计 */}
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">总作品数</p>
              <h3 className="text-3xl font-bold">{loading ? '...' : (stats?.total_works?.toLocaleString?.() || '0')}</h3>
              <p className={`text-sm mt-2 flex items-center ${stats && stats.work_growth_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <i className={`fa fa-arrow-${stats && stats.work_growth_rate >= 0 ? 'up' : 'down'} mr-1`}></i>
                {stats ? `${Math.abs(stats.work_growth_rate).toFixed(1)}%` : '0%'} <span className="text-gray-500 ml-1">较上月</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
              <i className="fa fa-book text-xl"></i>
            </div>
          </div>
        </div>

        {/* 待审核作品 */}
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">待审核作品</p>
              <h3 className="text-3xl font-bold">{loading ? '...' : (stats ? (stats.new_works_this_month || 0) : 0)}</h3>
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <i className="fa fa-arrow-up mr-1"></i> <span className="text-gray-500 ml-1">本月新增</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <i className="fa fa-clock-o text-xl"></i>
            </div>
          </div>
        </div>

        {/* 活动统计 */}
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">进行中活动</p>
              <h3 className="text-3xl font-bold">{loading ? '...' : (stats?.active_activities || 0)}</h3>
              <p className="text-gray-500 text-sm mt-2 flex items-center"></p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <i className="fa fa-calendar text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 活跃度趋势图 */}
        <div className="bg-white rounded-xl shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">平台活跃度趋势</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">周</button>
              <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg">月</button>
              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">年</button>
            </div>
          </div>
          <div className="h-80">
            <canvas ref={activityChartRef}></canvas>
          </div>
        </div>

        {/* 作品分类占比 */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-lg mb-6">作品分类占比</h3>
          <div className="h-80 flex items-center justify-center">
            <canvas ref={categoryChartRef}></canvas>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-sm">诗歌 (42%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-sm">散文 (28%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm">小说 (18%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-sm">摄影配文 (12%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 快捷操作与待办事项 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 快捷操作 */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-lg mb-4">快捷操作</h3>
          <div className="space-y-3">
            <a href="/admin/works" className="quick-action">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                <i className="fa fa-check-square-o"></i>
              </div>
              <div>
                <p className="font-medium">审核作品</p>
                <p className="text-gray-500 text-sm">当前待处理：{pendingWorksTotal} 篇</p>
              </div>
            </a>
            <a href="/admin/activities/new" className="quick-action">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                <i className="fa fa-plus-circle"></i>
              </div>
              <div>
                <p className="font-medium">创建活动</p>
                <p className="text-gray-500 text-sm">发布新的文学社活动</p>
              </div>
            </a>
            <a href="/admin/users" className="quick-action">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <i className="fa fa-user-plus"></i>
              </div>
              <div>
                <p className="font-medium">管理用户</p>
                <p className="text-gray-500 text-sm">查看用户列表和详情</p>
              </div>
            </a>
            <a href="/admin/announcements" className="quick-action">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                <i className="fa fa-bullhorn"></i>
              </div>
              <div>
                <p className="font-medium">发布公告</p>
                <p className="text-gray-500 text-sm">向用户推送平台公告</p>
              </div>
            </a>
            <a href="/admin/messages" className="quick-action text-left">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                <i className="fa fa-envelope"></i>
              </div>
              <div>
                <p className="font-medium">打开私信</p>
                <p className="text-gray-500 text-sm">查看与发送站内私信</p>
              </div>
            </a>
          </div>
        </div>

        {/* 待办事项与近期活动 */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">待办事项</h3>
            <a href="/admin/works" className="text-yellow-500 text-sm hover:underline">前往处理</a>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-red-500 flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="font-medium">待审核作品</p>
                    <p className="text-gray-500 text-sm">当前 {pendingWorksTotal} 篇待处理</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-500 text-xs rounded-full">紧急</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="font-medium">待审核评论</p>
                    <p className="text-gray-500 text-sm">当前 {pendingCommentsTotal} 条待处理</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-500 text-xs rounded-full">中等</span>
              </div>
            </div>
          </div>

      {/* 私信抽屉已移除，使用独立页面 */}
          {/* 近期活动 */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">近期活动</h3>
              <a href="/admin/activities" className="text-yellow-500 text-sm hover:underline">管理活动</a>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y">
                {recentActivities.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">暂无近期活动</div>
                ) : (
                  recentActivities.map((act) => (
                    <div key={act.ID} className="p-4 flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={getAssetUrl(act.ImageURL) || 'https://picsum.photos/seed/m/80/80'} alt={act.Title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">{act.Title}</p>
                          <p className="text-gray-500 text-sm">{new Date(act.Date).toLocaleDateString()} {act.Time || ''} · {act.Location || '地点待定'}</p>
                          <p className="text-gray-500 text-xs mt-1">已报名：{act.CurrentParticipants} 人{act.MaxParticipants ? ` / 限额：${act.MaxParticipants} 人` : ''}</p>
                        </div>
                      </div>
                      <a href={`/admin/activities/${act.ID}`} className="text-yellow-500 hover:underline text-sm">详情</a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}