'use client';

import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { http, type StatisticsResponse, type UserGrowthData, type ContentTrendData, type ActivityParticipationData, type MonthlyStatsData } from '@/lib/http';

// 注册 Chart.js 组件
Chart.register(...registerables);

export default function StatisticsPage() {
  const userGrowthChartRef = useRef<HTMLCanvasElement>(null);
  const contentTrendChartRef = useRef<HTMLCanvasElement>(null);
  const activityParticipationChartRef = useRef<HTMLCanvasElement>(null);
  const categoryDistributionChartRef = useRef<HTMLCanvasElement>(null);
  
  const userGrowthChartInstance = useRef<Chart | null>(null);
  const contentTrendChartInstance = useRef<Chart | null>(null);
  const activityParticipationChartInstance = useRef<Chart | null>(null);
  const categoryDistributionChartInstance = useRef<Chart | null>(null);

  // 状态管理
  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [contentTrendData, setContentTrendData] = useState<ContentTrendData[]>([]);
  const [activityParticipationData, setActivityParticipationData] = useState<ActivityParticipationData | null>(null);
  const [monthlyStatsData, setMonthlyStatsData] = useState<MonthlyStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取统计数据
  const fetchStatisticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        statsResponse,
        userGrowthResponse,
        contentTrendResponse,
        activityParticipationResponse,
        monthlyStatsResponse
      ] = await Promise.all([
        http.getDashboardStats(),
        http.getUserGrowthStats(),
        http.getContentTrendStats(),
        http.getActivityParticipationStats(),
        http.getMonthlyStats()
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
      if (userGrowthResponse.success && userGrowthResponse.data) {
        setUserGrowthData(userGrowthResponse.data);
      }
      if (contentTrendResponse.success && contentTrendResponse.data) {
        setContentTrendData(contentTrendResponse.data);
      }
      if (activityParticipationResponse.success && activityParticipationResponse.data) {
        setActivityParticipationData(activityParticipationResponse.data);
      }
      if (monthlyStatsResponse.success && monthlyStatsResponse.data) {
        setMonthlyStatsData(monthlyStatsResponse.data);
      }
    } catch (err: any) {
      setError(err.message || '获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatisticsData();
  }, []);

  useEffect(() => {
    // 清理旧的图表实例
    if (userGrowthChartInstance.current) {
      userGrowthChartInstance.current.destroy();
    }
    if (contentTrendChartInstance.current) {
      contentTrendChartInstance.current.destroy();
    }
    if (activityParticipationChartInstance.current) {
      activityParticipationChartInstance.current.destroy();
    }
    if (categoryDistributionChartInstance.current) {
      categoryDistributionChartInstance.current.destroy();
    }

    // 用户增长趋势图
    if (userGrowthChartRef.current && userGrowthData.length > 0) {
      const userGrowthCtx = userGrowthChartRef.current.getContext('2d');
      if (userGrowthCtx) {
        userGrowthChartInstance.current = new Chart(userGrowthCtx, {
          type: 'line',
          data: {
            labels: userGrowthData.map(item => item.month),
            datasets: [
              {
                label: '新增用户',
                data: userGrowthData.map(item => item.new_users),
                borderColor: '#F5C332',
                backgroundColor: 'rgba(245, 195, 50, 0.1)',
                tension: 0.3,
                fill: true
              },
              {
                label: '活跃用户',
                data: userGrowthData.map(item => item.active_users),
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

    // 内容发布趋势图
    if (contentTrendChartRef.current && contentTrendData.length > 0) {
      const contentTrendCtx = contentTrendChartRef.current.getContext('2d');
      if (contentTrendCtx) {
        contentTrendChartInstance.current = new Chart(contentTrendCtx, {
          type: 'bar',
          data: {
            labels: contentTrendData.map(item => item.category),
            datasets: [{
              label: '发布数量',
              data: contentTrendData.map(item => item.count),
              backgroundColor: [
                '#F5C332',
                '#2196F3',
                '#4CAF50',
                '#FF9800',
                '#9C27B0'
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
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

    // 活动参与度图
    if (activityParticipationChartRef.current && activityParticipationData) {
      const activityParticipationCtx = activityParticipationChartRef.current.getContext('2d');
      if (activityParticipationCtx) {
        activityParticipationChartInstance.current = new Chart(activityParticipationCtx, {
          type: 'doughnut',
          data: {
            labels: ['已参与', '未参与'],
            datasets: [{
              data: [activityParticipationData.participated, activityParticipationData.not_participated],
              backgroundColor: [
                '#4CAF50',
                '#E0E0E0'
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
    }

    // 分类分布图
    if (categoryDistributionChartRef.current && contentTrendData.length > 0) {
      const categoryDistributionCtx = categoryDistributionChartRef.current.getContext('2d');
      if (categoryDistributionCtx) {
        categoryDistributionChartInstance.current = new Chart(categoryDistributionCtx, {
          type: 'pie',
          data: {
            labels: contentTrendData.map(item => item.category),
            datasets: [{
              data: contentTrendData.map(item => item.count),
              backgroundColor: [
                '#F5C332',
                '#2196F3',
                '#4CAF50',
                '#FF9800',
                '#9C27B0'
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right'
              }
            }
          }
        });
      }
    }

    // 清理函数
    return () => {
      if (userGrowthChartInstance.current) {
        userGrowthChartInstance.current.destroy();
      }
      if (contentTrendChartInstance.current) {
        contentTrendChartInstance.current.destroy();
      }
      if (activityParticipationChartInstance.current) {
        activityParticipationChartInstance.current.destroy();
      }
      if (categoryDistributionChartInstance.current) {
        categoryDistributionChartInstance.current.destroy();
      }
    };
  }, [userGrowthData, contentTrendData, activityParticipationData]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">数据加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchStatisticsData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">数据统计</h2>
        <p className="text-gray-500">平台运营数据分析和趋势统计</p>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">总用户数</p>
              <h3 className="text-3xl font-bold">
                {loading ? '...' : stats?.total_users?.toLocaleString() || '0'}
              </h3>
              <p className={`text-sm mt-2 flex items-center ${stats?.user_growth_rate && stats.user_growth_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <i className={`fa fa-arrow-${stats?.user_growth_rate && stats.user_growth_rate >= 0 ? 'up' : 'down'} mr-1`}></i> 
                {stats?.user_growth_rate ? `${Math.abs(stats.user_growth_rate).toFixed(1)}%` : '0%'} 
                <span className="text-gray-500 ml-1">较上月</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-users text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">总作品数</p>
              <h3 className="text-3xl font-bold">
                {loading ? '...' : stats?.total_works?.toLocaleString() || '0'}
              </h3>
              <p className={`text-sm mt-2 flex items-center ${stats?.work_growth_rate && stats.work_growth_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <i className={`fa fa-arrow-${stats?.work_growth_rate && stats.work_growth_rate >= 0 ? 'up' : 'down'} mr-1`}></i> 
                {stats?.work_growth_rate ? `${Math.abs(stats.work_growth_rate).toFixed(1)}%` : '0%'} 
                <span className="text-gray-500 ml-1">较上月</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
              <i className="fa fa-book text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">总浏览量</p>
              <h3 className="text-3xl font-bold">
                {loading ? '...' : stats?.total_views?.toLocaleString() || '0'}
              </h3>
              <p className={`text-sm mt-2 flex items-center ${stats?.view_growth_rate && stats.view_growth_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <i className={`fa fa-arrow-${stats?.view_growth_rate && stats.view_growth_rate >= 0 ? 'up' : 'down'} mr-1`}></i> 
                {stats?.view_growth_rate ? `${Math.abs(stats.view_growth_rate).toFixed(1)}%` : '0%'} 
                <span className="text-gray-500 ml-1">较上月</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <i className="fa fa-eye text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">总评论数</p>
              <h3 className="text-3xl font-bold">
                {loading ? '...' : stats?.total_comments?.toLocaleString() || '0'}
              </h3>
              <p className={`text-sm mt-2 flex items-center ${stats?.comment_growth_rate && stats.comment_growth_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <i className={`fa fa-arrow-${stats?.comment_growth_rate && stats.comment_growth_rate >= 0 ? 'up' : 'down'} mr-1`}></i> 
                {stats?.comment_growth_rate ? `${Math.abs(stats.comment_growth_rate).toFixed(1)}%` : '0%'} 
                <span className="text-gray-500 ml-1">较上月</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
              <i className="fa fa-comments text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 用户增长趋势 */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-lg mb-6">用户增长趋势</h3>
          <div className="h-80">
            <canvas ref={userGrowthChartRef}></canvas>
          </div>
        </div>

        {/* 内容发布趋势 */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-lg mb-6">内容发布趋势</h3>
          <div className="h-80">
            <canvas ref={contentTrendChartRef}></canvas>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 活动参与度 */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-lg mb-6">活动参与度</h3>
          <div className="h-80 flex items-center justify-center">
            <canvas ref={activityParticipationChartRef}></canvas>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              平均参与率: {activityParticipationData ? `${activityParticipationData.participation_rate.toFixed(1)}%` : '0%'}
            </p>
          </div>
        </div>

        {/* 内容分类分布 */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-lg mb-6">内容分类分布</h3>
          <div className="h-80">
            <canvas ref={categoryDistributionChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* 详细统计表格 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-bold text-lg">月度详细统计</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">月份</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">新增用户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布作品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">总浏览量</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">新增评论</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动参与</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">加载中...</td>
                </tr>
              ) : monthlyStatsData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">暂无数据</td>
                </tr>
              ) : (
                monthlyStatsData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.new_users}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.new_works}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.total_views.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.new_comments}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.activities}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}