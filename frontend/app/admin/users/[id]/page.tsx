'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { http, type User } from '@/lib/http';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // 获取用户详情
  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await http.getUser(parseInt(userId));
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError('获取用户详情失败');
      }
    } catch (err: any) {
      setError(err.message || '获取用户详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 封禁用户
  const handleBanUser = async () => {
    if (!user) return;
    if (!confirm('确定要封禁此用户吗？')) return;
    
    try {
      setActionLoading(true);
      await http.banUser(user.id, '管理员封禁');
      await fetchUserDetail();
    } catch (err: any) {
      setError(err.message || '封禁用户失败');
    } finally {
      setActionLoading(false);
    }
  };

  // 解封用户
  const handleUnbanUser = async () => {
    if (!user) return;
    if (!confirm('确定要解封此用户吗？')) return;
    
    try {
      setActionLoading(true);
      await http.unbanUser(user.id);
      await fetchUserDetail();
    } catch (err: any) {
      setError(err.message || '解封用户失败');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-3 py-1 bg-red-100 text-red-500 text-sm rounded-full">管理员</span>;
      case 'editor':
        return <span className="px-3 py-1 bg-blue-100 text-blue-500 text-sm rounded-full">编辑</span>;
      case 'member':
        return <span className="px-3 py-1 bg-green-100 text-green-500 text-sm rounded-full">会员</span>;
      case 'guest':
        return <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">游客</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">未知</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-500 text-sm rounded-full">活跃</span>;
      case 'inactive':
        return <span className="px-3 py-1 bg-orange-100 text-orange-500 text-sm rounded-full">不活跃</span>;
      case 'banned':
        return <span className="px-3 py-1 bg-red-100 text-red-500 text-sm rounded-full">已封禁</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">未知</span>;
    }
  };

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

  if (error) {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">👤</div>
          <p className="text-gray-600 mb-4">用户不存在</p>
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
              <h1 className="text-xl font-semibold text-gray-900">用户详情</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/users/${user.id}/edit`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                编辑用户
              </Link>
              {user.role !== 'admin' && (
                <>
                  {user.status === 'active' ? (
                    <button
                      onClick={handleBanUser}
                      disabled={actionLoading}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      {actionLoading ? '处理中...' : '封禁用户'}
                    </button>
                  ) : (
                    <button
                      onClick={handleUnbanUser}
                      disabled={actionLoading}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {actionLoading ? '处理中...' : '解封用户'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 用户基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <img 
                src={user.avatar ? `http://localhost:8080${user.avatar}` : '/default-avatar.png'} 
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                <div className="flex items-center gap-4">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>用户ID: {user.id}</div>
              <div>注册时间: {new Date(user.created_at).toLocaleString()}</div>
              <div>更新时间: {new Date(user.updated_at).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* 详细信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500">邮箱:</span>
                <span className="ml-2 font-medium">{user.email}</span>
              </div>
              <div>
                <span className="text-gray-500">性别:</span>
                <span className="ml-2">{user.gender === 'male' ? '男' : user.gender === 'female' ? '女' : '未知'}</span>
              </div>
              <div>
                <span className="text-gray-500">电话:</span>
                <span className="ml-2">{user.phone || '未设置'}</span>
              </div>
              <div>
                <span className="text-gray-500">最后登录:</span>
                <span className="ml-2">{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : '从未登录'}</span>
              </div>
            </div>
          </div>

          {/* 社交信息 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">社交信息</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500">微博:</span>
                <span className="ml-2">{user.weibo || '未设置'}</span>
              </div>
              <div>
                <span className="text-gray-500">微信:</span>
                <span className="ml-2">{user.wechat || '未设置'}</span>
              </div>
              <div>
                <span className="text-gray-500">标签:</span>
                <div className="mt-1">
                  {user.tags && user.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {user.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">无标签</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 个人简介 */}
        {user.bio && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">个人简介</h3>
            <div className="text-gray-700 leading-relaxed">
              {user.bio}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}