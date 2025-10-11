'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

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
    if (userGrowthChartRef.current) {
      const userGrowthCtx = userGrowthChartRef.current.getContext('2d');
      if (userGrowthCtx) {
        userGrowthChartInstance.current = new Chart(userGrowthCtx, {
          type: 'line',
          data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'],
            datasets: [
              {
                label: '新增用户',
                data: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82],
                borderColor: '#F5C332',
                backgroundColor: 'rgba(245, 195, 50, 0.1)',
                tension: 0.3,
                fill: true
              },
              {
                label: '活跃用户',
                data: [120, 135, 128, 145, 142, 158, 165, 162, 175, 186],
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
    if (contentTrendChartRef.current) {
      const contentTrendCtx = contentTrendChartRef.current.getContext('2d');
      if (contentTrendCtx) {
        contentTrendChartInstance.current = new Chart(contentTrendCtx, {
          type: 'bar',
          data: {
            labels: ['诗歌', '散文', '小说', '摄影配文', '其他'],
            datasets: [{
              label: '发布数量',
              data: [156, 98, 67, 45, 23],
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
    if (activityParticipationChartRef.current) {
      const activityParticipationCtx = activityParticipationChartRef.current.getContext('2d');
      if (activityParticipationCtx) {
        activityParticipationChartInstance.current = new Chart(activityParticipationCtx, {
          type: 'doughnut',
          data: {
            labels: ['已参与', '未参与'],
            datasets: [{
              data: [68, 32],
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
    if (categoryDistributionChartRef.current) {
      const categoryDistributionCtx = categoryDistributionChartRef.current.getContext('2d');
      if (categoryDistributionCtx) {
        categoryDistributionChartInstance.current = new Chart(categoryDistributionCtx, {
          type: 'pie',
          data: {
            labels: ['诗歌', '散文', '小说', '摄影配文', '其他'],
            datasets: [{
              data: [42, 28, 18, 8, 4],
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
  }, []);

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
              <h3 className="text-3xl font-bold">1,286</h3>
              <p className="text-green-500 text-sm mt-2 flex items-center">
                <i className="fa fa-arrow-up mr-1"></i> 12.5% <span className="text-gray-500 ml-1">较上月</span>
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
              <h3 className="text-3xl font-bold">3,752</h3>
              <p className="text-green-500 text-sm mt-2 flex items-center">
                <i className="fa fa-arrow-up mr-1"></i> 8.3% <span className="text-gray-500 ml-1">较上月</span>
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
              <h3 className="text-3xl font-bold">28,456</h3>
              <p className="text-green-500 text-sm mt-2 flex items-center">
                <i className="fa fa-arrow-up mr-1"></i> 15.2% <span className="text-gray-500 ml-1">较上月</span>
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
              <h3 className="text-3xl font-bold">1,234</h3>
              <p className="text-green-500 text-sm mt-2 flex items-center">
                <i className="fa fa-arrow-up mr-1"></i> 6.8% <span className="text-gray-500 ml-1">较上月</span>
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
            <p className="text-sm text-gray-500">平均参与率: 68%</p>
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
              {[
                { month: '10月', users: 82, works: 156, views: 3456, comments: 234, activities: 68 },
                { month: '9月', users: 75, works: 142, views: 3123, comments: 198, activities: 72 },
                { month: '8月', users: 68, works: 128, views: 2890, comments: 167, activities: 65 },
                { month: '7月', users: 72, works: 135, views: 3012, comments: 189, activities: 58 },
                { month: '6月', users: 67, works: 118, views: 2678, comments: 145, activities: 61 }
              ].map((data, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.users}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.works}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.views.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.comments}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.activities}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}