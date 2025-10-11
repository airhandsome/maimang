'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { http, type Activity } from '@/lib/http';

export default function EditActivityPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.id as string;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    date: '',
    time: '',
    location: '',
    instructor: '',
    max_participants: 0,
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 获取活动详情
  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await http.getActivity(parseInt(activityId));
      const activity = response.data;
      
      if (activity) {
        setFormData({
          title: activity.Title || '',
          description: activity.Description || '',
          image_url: activity.ImageURL || '',
          date: activity.Date ? new Date(activity.Date).toISOString().split('T')[0] : '',
          time: activity.Time || '',
          location: activity.Location || '',
          instructor: activity.Instructor || '',
          max_participants: activity.MaxParticipants || 0,
          status: activity.Status || 'upcoming'
        });
      }
    } catch (err: any) {
      setError(err.message || '获取活动详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存活动
  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('请输入活动标题');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('请输入活动描述');
      return;
    }
    
    if (!formData.date) {
      setError('请选择活动日期');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      await http.updateActivity(parseInt(activityId), formData);
      setSuccess(true);
      
      setTimeout(() => {
        router.push(`/admin/activities/${activityId}`);
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || '保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (activityId) {
      fetchActivity();
    }
  }, [activityId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4 text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">保存成功！</h2>
          <p className="text-gray-600 mb-4">
            活动信息已更新成功。
          </p>
          <p className="text-sm text-gray-500">
            正在跳转到活动详情页面...
          </p>
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
            href={`/admin/activities/${activityId}`}
            className="text-yellow-600 hover:text-yellow-900 text-sm mb-2 inline-block"
          >
            ← 返回活动详情
          </Link>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">编辑活动</h2>
          <p className="text-gray-500">修改活动信息</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/activities/${activityId}`}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存更改'}
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：表单 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-6">基本信息</h3>
            
            <div className="space-y-6">
              {/* 活动标题 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="请输入活动标题"
                />
              </div>

              {/* 活动描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="请详细描述活动内容、目的和要求"
                />
              </div>

              {/* 活动图片 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动图片
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="请输入图片URL"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.image_url} 
                      alt="活动预览" 
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 日期和时间 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    活动日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    活动时间
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    placeholder="例如：09:00-17:00"
                  />
                </div>
              </div>

              {/* 地点和指导老师 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    活动地点
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    placeholder="请输入活动地点"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    指导老师
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => handleInputChange('instructor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    placeholder="请输入指导老师姓名"
                  />
                </div>
              </div>

              {/* 最大参与人数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最大参与人数
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="请输入最大参与人数"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：状态管理 */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">状态管理</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                >
                  <option value="upcoming">即将开始</option>
                  <option value="ongoing">进行中</option>
                  <option value="completed">已结束</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
            </div>
          </div>

          {/* 保存提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
            <div className="flex items-start">
              <i className="fa fa-info-circle text-blue-500 mt-1 mr-2"></i>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">保存提示</p>
                <p>修改活动信息后，请点击"保存更改"按钮。保存成功后会自动跳转到活动详情页面。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}