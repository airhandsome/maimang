'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { http, type Activity, type ActivityParticipant } from '@/lib/http';

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.id as string;
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [participants, setParticipants] = useState<ActivityParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);

  // 获取活动详情
  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await http.getActivity(parseInt(activityId));
      setActivity(response.data || null);
    } catch (err: any) {
      setError(err.message || '获取活动详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取活动参与者
  const fetchParticipants = async () => {
    try {
      const response = await http.getActivityParticipants(parseInt(activityId));
      setParticipants(response.data || []);
    } catch (err: any) {
      console.error('获取参与者失败:', err);
    }
  };

  // 更新活动状态
  const handleUpdateStatus = async (status: string) => {
    if (!confirm(`确定要将活动状态更新为"${getStatusText(status)}"吗？`)) {
      return;
    }
    
    try {
      await http.updateActivityStatus(parseInt(activityId), status);
      await fetchActivity();
    } catch (err: any) {
      setError(err.message || '更新活动状态失败');
    }
  };

  // 删除活动
  const handleDeleteActivity = async () => {
    if (!confirm('确定要删除这个活动吗？删除后无法恢复。')) {
      return;
    }
    
    try {
      await http.deleteActivity(parseInt(activityId));
      router.push('/admin/activities');
    } catch (err: any) {
      setError(err.message || '删除活动失败');
    }
  };

  useEffect(() => {
    if (activityId) {
      fetchActivity();
    }
  }, [activityId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-3 py-1 bg-blue-100 text-blue-500 text-sm rounded-full">即将开始</span>;
      case 'ongoing':
        return <span className="px-3 py-1 bg-green-100 text-green-500 text-sm rounded-full">进行中</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">已结束</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-500 text-sm rounded-full">已取消</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">未知</span>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return '即将开始';
      case 'ongoing': return '进行中';
      case 'completed': return '已结束';
      case 'cancelled': return '已取消';
      default: return '未知';
    }
  };

  const getParticipationRate = (current: number, max: number) => {
    const rate = (current / max) * 100;
    if (rate >= 90) return 'text-red-500';
    if (rate >= 70) return 'text-orange-500';
    return 'text-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchActivity}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              重试
            </button>
            <Link
              href="/admin/activities"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              返回列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4 text-center">
          <div className="text-gray-500 text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">活动不存在</h2>
          <p className="text-gray-600 mb-4">该活动可能已被删除或不存在</p>
          <Link
            href="/admin/activities"
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link 
            href="/admin/activities"
            className="text-yellow-600 hover:text-yellow-900 text-sm mb-2 inline-block"
          >
            ← 返回活动列表
          </Link>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">{activity.Title}</h2>
          <p className="text-gray-500">活动详情管理</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/activities/${activityId}/edit`}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <i className="fa fa-edit mr-2"></i>
            编辑活动
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：活动信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本信息 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative">
              <img 
                src={activity.ImageURL || "https://picsum.photos/id/175/800/400"} 
                alt={activity.Title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4">
                {getStatusBadge(activity.Status)}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">{activity.Title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <i className="fa fa-calendar w-5 mr-3 text-yellow-500"></i>
                  <div>
                    <div className="text-sm text-gray-500">活动日期</div>
                    <div className="font-medium">{new Date(activity.Date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-clock-o w-5 mr-3 text-yellow-500"></i>
                  <div>
                    <div className="text-sm text-gray-500">活动时间</div>
                    <div className="font-medium">{activity.Time}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-map-marker w-5 mr-3 text-yellow-500"></i>
                  <div>
                    <div className="text-sm text-gray-500">活动地点</div>
                    <div className="font-medium">{activity.Location}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fa fa-user w-5 mr-3 text-yellow-500"></i>
                  <div>
                    <div className="text-sm text-gray-500">指导老师</div>
                    <div className="font-medium">{activity.Instructor}</div>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">活动描述</h4>
                <p className="text-gray-700 leading-relaxed">{activity.Description}</p>
              </div>
            </div>
          </div>

          {/* 参与者信息 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">参与者信息</h3>
              <button
                onClick={() => {
                  setShowParticipants(!showParticipants);
                  if (!showParticipants && participants.length === 0) {
                    fetchParticipants();
                  }
                }}
                className="text-yellow-600 hover:text-yellow-900 text-sm"
              >
                {showParticipants ? '隐藏' : '查看'}参与者列表
              </button>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm">
                <span className="text-gray-500">报名情况：</span>
                <span className={`font-medium ${getParticipationRate(activity.CurrentParticipants, activity.MaxParticipants)}`}>
                  {activity.CurrentParticipants}/{activity.MaxParticipants}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                创建时间：{new Date(activity.CreatedAt).toLocaleString()}
              </div>
            </div>

            {showParticipants && (
              <div className="border-t pt-4">
                {participants.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    暂无参与者
                  </div>
                ) : (
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div key={participant.ID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            {participant.User?.Name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-medium">{participant.User?.Name || '未知用户'}</div>
                            <div className="text-sm text-gray-500">{participant.User?.Email}</div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            participant.Status === 'registered' ? 'bg-blue-100 text-blue-500' :
                            participant.Status === 'attended' ? 'bg-green-100 text-green-500' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {participant.Status === 'registered' ? '已报名' :
                             participant.Status === 'attended' ? '已参加' : '缺席'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 右侧：操作面板 */}
        <div className="space-y-6">
          {/* 状态管理 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">状态管理</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">当前状态</span>
                {getStatusBadge(activity.Status)}
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleUpdateStatus('upcoming')}
                  disabled={activity.Status === 'upcoming'}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  设置为即将开始
                </button>
                <button
                  onClick={() => handleUpdateStatus('ongoing')}
                  disabled={activity.Status === 'ongoing'}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg border border-green-200 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  设置为进行中
                </button>
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  disabled={activity.Status === 'completed'}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  设置为已结束
                </button>
                <button
                  onClick={() => handleUpdateStatus('cancelled')}
                  disabled={activity.Status === 'cancelled'}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  取消活动
                </button>
              </div>
            </div>
          </div>

          {/* 危险操作 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
            <h3 className="text-lg font-bold mb-4 text-red-600">危险操作</h3>
            <button
              onClick={handleDeleteActivity}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <i className="fa fa-trash mr-2"></i>
              删除活动
            </button>
            <p className="text-xs text-gray-500 mt-2">删除后无法恢复，请谨慎操作</p>
          </div>
        </div>
      </div>
    </div>
  );
}