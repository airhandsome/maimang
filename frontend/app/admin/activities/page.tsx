'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { http, type Activity, type ActivityStats } from '@/lib/http';

export default function ActivitiesManagement() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // 获取活动列表
  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: 1,
        per_page: 50,
        sort_by: 'date',
        sort_dir: 'desc'
      };
      
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      
      const response = await http.getAdminActivities(params);
      setActivities(response.data || []);
    } catch (err: any) {
      setError(err.message || '获取活动列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取活动统计
  const fetchStats = async () => {
    try {
      const response = await http.getActivityStats();
      setStats(response.data || null);
    } catch (err: any) {
      console.error('获取活动统计失败:', err);
    }
  };

  // 删除活动
  const handleDeleteActivity = async (id: number) => {
    if (!confirm('确定要删除这个活动吗？')) {
      return;
    }
    
    try {
      await http.deleteActivity(id);
      await fetchActivities();
      await fetchStats();
    } catch (err: any) {
      setError(err.message || '删除活动失败');
    }
  };

  // 更新活动状态
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await http.updateActivityStatus(id, status);
      await fetchActivities();
      await fetchStats();
    } catch (err: any) {
      setError(err.message || '更新活动状态失败');
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [filterStatus]);

  const filteredActivities = activities;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-2 py-1 bg-blue-100 text-blue-500 text-xs rounded-full">即将开始</span>;
      case 'ongoing':
        return <span className="px-2 py-1 bg-green-100 text-green-500 text-xs rounded-full">进行中</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">已结束</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-500 text-xs rounded-full">已取消</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">未知</span>;
    }
  };

  const getParticipationRate = (current: number, max: number) => {
    const rate = (current / max) * 100;
    if (rate >= 90) return 'text-red-500';
    if (rate >= 70) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">活动管理</h2>
          <p className="text-gray-500">管理文学社活动，查看报名情况和活动状态</p>
        </div>
        <Link 
          href="/admin/activities/new"
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <i className="fa fa-plus mr-2"></i>
          创建活动
        </Link>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">状态筛选：</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="all">全部</option>
              <option value="upcoming">即将开始</option>
              <option value="ongoing">进行中</option>
              <option value="completed">已结束</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
        </div>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">加载中...</div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* 活动列表 */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredActivities.map((activity) => (
            <div key={activity.ID} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <img 
                  src={activity.ImageURL || "https://picsum.photos/id/175/600/400"} 
                  alt={activity.Title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(activity.Status)}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">{activity.Title}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <i className="fa fa-calendar w-4 mr-2"></i>
                    {new Date(activity.Date).toLocaleDateString()} {activity.Time}
                  </div>
                  <div className="flex items-center">
                    <i className="fa fa-map-marker w-4 mr-2"></i>
                    {activity.Location}
                  </div>
                  <div className="flex items-center">
                    <i className="fa fa-user w-4 mr-2"></i>
                    {activity.Instructor}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{activity.Description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500">报名情况：</span>
                    <span className={`font-medium ${getParticipationRate(activity.CurrentParticipants, activity.MaxParticipants)}`}>
                      {activity.CurrentParticipants}/{activity.MaxParticipants}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/admin/activities/${activity.ID}`}
                      className="text-yellow-600 hover:text-yellow-900 text-sm"
                    >
                      查看详情
                    </Link>
                    <Link 
                      href={`/admin/activities/${activity.ID}/edit`}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      编辑
                    </Link>
                    {activity.Status === 'upcoming' && (
                      <button 
                        onClick={() => handleUpdateStatus(activity.ID, 'cancelled')}
                        className="text-orange-600 hover:text-orange-900 text-sm"
                      >
                        取消
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteActivity(activity.ID)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!loading && !error && filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">暂无活动数据</div>
        </div>
      )}

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总活动数</p>
              <p className="text-2xl font-bold">{stats?.total_activities || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-calendar"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">即将开始</p>
              <p className="text-2xl font-bold text-blue-500">{stats?.upcoming_activities || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-clock-o"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">进行中</p>
              <p className="text-2xl font-bold text-green-500">{stats?.ongoing_activities || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <i className="fa fa-play"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已结束</p>
              <p className="text-2xl font-bold text-gray-500">{stats?.completed_activities || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <i className="fa fa-check"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}