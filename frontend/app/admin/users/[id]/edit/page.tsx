'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { http, type User } from '@/lib/http';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member',
    bio: '',
    gender: 'male',
    phone: '',
    weibo: '',
    wechat: '',
    tags: [] as string[],
    status: 'active'
  });

  // 获取用户详情
  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await http.getUser(parseInt(userId));
      if (response.success && response.data) {
        const userData = response.data;
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          bio: userData.bio,
          gender: userData.gender,
          phone: userData.phone,
          weibo: userData.weibo,
          wechat: userData.wechat,
          tags: userData.tags || [],
          status: userData.status
        });
      } else {
        setError('获取用户详情失败');
      }
    } catch (err: any) {
      setError(err.message || '获取用户详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存用户信息
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      await http.updateUser(parseInt(userId), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        bio: formData.bio,
        gender: formData.gender,
        phone: formData.phone,
        weibo: formData.weibo,
        wechat: formData.wechat
      });

      // 如果状态发生变化，更新状态
      if (formData.status !== user?.status) {
        await http.updateUserStatus(parseInt(userId), formData.status);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/users');
      }, 1500);
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 处理标签输入
  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData({ ...formData, tags });
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="mt-2 text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/admin/users"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← 返回用户列表
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">编辑用户</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-green-500 mr-3">✅</div>
              <p className="text-green-700">用户信息更新成功！</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-500 mr-3">❌</div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">基本信息</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱 *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                角色
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                <option value="member">会员</option>
                <option value="editor">编辑</option>
                <option value="admin">管理员</option>
                <option value="guest">游客</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                <option value="active">活跃</option>
                <option value="inactive">不活跃</option>
                <option value="banned">已封禁</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                电话
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                微博
              </label>
              <input
                type="text"
                value={formData.weibo}
                onChange={(e) => setFormData({ ...formData, weibo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                微信
              </label>
              <input
                type="text"
                value={formData.wechat}
                onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                个人简介
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                placeholder="请输入个人简介..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签 (用逗号分隔)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                placeholder="例如: 小说, 诗歌, 散文"
              />
              <p className="text-sm text-gray-500 mt-1">
                当前标签: {formData.tags.length > 0 ? formData.tags.join(', ') : '无'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}