'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { http, type User } from '@/lib/http';

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const getAssetUrl = (url?: string) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1';
    const origin = apiBase.replace(/\/api\/v1$/, '');
    return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
  };

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: currentPage,
        per_page: 20,
        sort_by: 'created_at',
        sort_dir: 'desc'
      };
      
      if (filterRole !== 'all') {
        params.role = filterRole;
      }
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await http.getUsers(params);
      setUsers(response.data || []);
      setTotalPages(response.meta?.total_pages || 1);
      setTotal(response.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 封禁用户
  const handleBanUser = async (id: number) => {
    if (!confirm('确定要封禁此用户吗？')) return;
    
    try {
      await http.banUser(id, '管理员封禁');
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || '封禁用户失败');
    }
  };

  // 解封用户
  const handleUnbanUser = async (id: number) => {
    if (!confirm('确定要解封此用户吗？')) return;
    
    try {
      await http.unbanUser(id);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || '解封用户失败');
    }
  };

  // 更新用户状态
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await http.updateUserStatus(id, status);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || '更新用户状态失败');
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchUsers();
  }, [currentPage, filterRole, filterStatus, searchTerm]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 bg-red-100 text-red-500 text-xs rounded-full">管理员</span>;
      case 'member':
        return <span className="px-2 py-1 bg-blue-100 text-blue-500 text-xs rounded-full">会员</span>;
      case 'guest':
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">游客</span>;
      case 'editor':
        return <span className="px-2 py-1 bg-green-100 text-green-500 text-xs rounded-full">编辑</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">未知</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-500 text-xs rounded-full">活跃</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-orange-100 text-orange-500 text-xs rounded-full">不活跃</span>;
      case 'banned':
        return <span className="px-2 py-1 bg-red-100 text-red-500 text-xs rounded-full">已封禁</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">未知</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">用户管理</h2>
        <p className="text-gray-500">管理平台用户账户，查看用户信息和活动状态</p>
      </div>

      {/* 搜索和筛选器 */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索用户名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
              <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">角色筛选：</label>
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="all">全部</option>
              <option value="admin">管理员</option>
              <option value="editor">编辑</option>
              <option value="reviewer">审核员</option>
              <option value="member">会员</option>
              <option value="visitor">游客</option>
              <option value="super_admin">超级管理员</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">状态筛选：</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="all">全部</option>
              <option value="active">活跃</option>
              <option value="inactive">不活跃</option>
              <option value="banned">已封禁</option>
            </select>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户信息</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">加入时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最后活跃</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作品数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                    <p className="mt-2 text-gray-500">加载中...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="text-red-500 text-xl mb-4">❌</div>
                    <p className="text-gray-600">{error}</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="text-gray-500 text-xl mb-4">👥</div>
                    <p className="text-gray-600">暂无用户数据</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.ID} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={user.AvatarURL ? getAssetUrl(user.AvatarURL) : '/default-avatar.svg'} 
                          alt={user.Name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                          onError={(e) => {
                            e.currentTarget.src = '/default-avatar.svg';
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.Name}</div>
                          <div className="text-sm text-gray-500">{user.Email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.Role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.Status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.CreatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.LastLoginAt ? new Date(user.LastLoginAt).toLocaleDateString() : '从未登录'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.Works ? user.Works.length : 0}                      
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/admin/users/${user.ID}`}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          查看详情
                        </Link>
                        {user.Role !== 'admin' && (
                          <>
                            <Link 
                              href={`/admin/users/${user.ID}/edit`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              编辑
                            </Link>
                            {user.Status === 'active' ? (
                              <button 
                                onClick={() => handleBanUser(user.ID)}
                                className="text-red-600 hover:text-red-900"
                              >
                                封禁
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUnbanUser(user.ID)}
                                className="text-green-600 hover:text-green-900"
                              >
                                解封
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总用户数</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-users"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">活跃用户</p>
              <p className="text-2xl font-bold text-green-500">{users.filter(u => (u as any).Status === 'active').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <i className="fa fa-user-check"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">会员用户</p>
              <p className="text-2xl font-bold text-blue-500">{users.filter(u => (u as any).Role === 'member').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-user"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">管理员</p>
              <p className="text-2xl font-bold text-red-500">{users.filter(u => (u as any).Role === 'admin').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <i className="fa fa-user-shield"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}