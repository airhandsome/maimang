'use client';

import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  joinDate: string;
  lastActive: string;
  worksCount: number;
  status: 'active' | 'inactive' | 'banned';
  avatar: string;
}

export default function UsersManagement() {
  const [users] = useState<User[]>([
    {
      id: 1,
      name: "张小明",
      email: "zhangxiaoming@example.com",
      role: "member",
      joinDate: "2023-08-15",
      lastActive: "2023-10-20",
      worksCount: 5,
      status: "active",
      avatar: "https://picsum.photos/id/64/100/100"
    },
    {
      id: 2,
      name: "李小红",
      email: "lixiaohong@example.com",
      role: "member",
      joinDate: "2023-09-02",
      lastActive: "2023-10-19",
      worksCount: 3,
      status: "active",
      avatar: "https://picsum.photos/id/65/100/100"
    },
    {
      id: 3,
      name: "王小华",
      email: "wangxiaohua@example.com",
      role: "admin",
      joinDate: "2023-07-10",
      lastActive: "2023-10-20",
      worksCount: 12,
      status: "active",
      avatar: "https://picsum.photos/id/66/100/100"
    },
    {
      id: 4,
      name: "赵小强",
      email: "zhaoxiaoqiang@example.com",
      role: "member",
      joinDate: "2023-09-20",
      lastActive: "2023-10-15",
      worksCount: 1,
      status: "inactive",
      avatar: "https://picsum.photos/id/67/100/100"
    },
    {
      id: 5,
      name: "陈小美",
      email: "chenxiaomei@example.com",
      role: "guest",
      joinDate: "2023-10-01",
      lastActive: "2023-10-18",
      worksCount: 0,
      status: "active",
      avatar: "https://picsum.photos/id/68/100/100"
    }
  ]);

  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredUsers = users.filter(user => {
    const roleMatch = filterRole === 'all' || user.role === filterRole;
    const statusMatch = filterStatus === 'all' || user.status === filterStatus;
    const searchMatch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return roleMatch && statusMatch && searchMatch;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 bg-red-100 text-red-500 text-xs rounded-full">管理员</span>;
      case 'member':
        return <span className="px-2 py-1 bg-blue-100 text-blue-500 text-xs rounded-full">会员</span>;
      case 'guest':
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">游客</span>;
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
              <option value="member">会员</option>
              <option value="guest">游客</option>
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.worksCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-yellow-600 hover:text-yellow-900">
                        查看详情
                      </button>
                      {user.role !== 'admin' && (
                        <>
                          <button className="text-blue-600 hover:text-blue-900">
                            编辑
                          </button>
                          {user.status === 'active' ? (
                            <button className="text-red-600 hover:text-red-900">
                              封禁
                            </button>
                          ) : (
                            <button className="text-green-600 hover:text-green-900">
                              解封
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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
              <p className="text-2xl font-bold text-green-500">{users.filter(u => u.status === 'active').length}</p>
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
              <p className="text-2xl font-bold text-blue-500">{users.filter(u => u.role === 'member').length}</p>
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
              <p className="text-2xl font-bold text-red-500">{users.filter(u => u.role === 'admin').length}</p>
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