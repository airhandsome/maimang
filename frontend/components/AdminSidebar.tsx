'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { http, type User } from '@/lib/http';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const hasRequested = useRef(false);

  // 获取当前用户信息
  const fetchCurrentUser = useCallback(async () => {
    // 防止重复请求
    if (hasRequested.current) {
      return;
    }
    
    hasRequested.current = true;
    
    try {
      setLoading(true);
      const response = await http.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('AdminSidebar: 获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const sidebarItems = [
    { href: '/admin/dashboard', icon: 'fa-tachometer', label: '仪表盘' },
    { href: '/admin/works', icon: 'fa-book', label: '作品管理' },
    { href: '/admin/users', icon: 'fa-users', label: '用户管理' },
    { href: '/admin/activities', icon: 'fa-calendar', label: '活动管理' },
    { href: '/admin/comments', icon: 'fa-comments', label: '评论管理' },
    { href: '/admin/statistics', icon: 'fa-bar-chart', label: '数据统计' },
    { href: '/admin/materials', icon: 'fa-folder-open', label: '素材库' },
    { href: '/admin/settings', icon: 'fa-cog', label: '系统设置' },
  ];

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div 
          className="admin-overlay"
          onClick={onClose}
        />
      )}
      
      {/* 侧边栏 */}
      <aside className={`
        admin-sidebar admin-sidebar-mobile
        ${isOpen ? 'open' : 'closed'}
      `}>
        {/* 头部 */}
        <div className="p-5 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
              <i className="fa fa-pencil text-white"></i>
            </div>
            <h1 className="text-xl font-bold">麦芒管理系统</h1>
          </div>
        </div>
        
        {/* 导航菜单 */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
                onClick={onClose}
              >
                <i className={`fa ${item.icon} w-5 text-center`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* 底部用户信息 - 固定在底部 */}
        <div className="flex-shrink-0 p-4 border-t bg-white">
          <div className="flex items-center gap-3">
            {loading ? (
              // 加载状态
              <>
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </>
            ) : user ? (
              // 显示真实用户信息
              <>
                <img 
                  src={user.avatar ? `http://localhost:8080${user.avatar}` : '/default-avatar.svg'} 
                  alt="用户头像" 
                  className="w-10 h-10 rounded-full object-cover" 
                  onError={(e) => {
                    // 头像加载失败时使用默认头像
                    e.currentTarget.src = '/default-avatar.svg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.role}</p>
                </div>
              </>
            ) : (
              // 用户信息获取失败时的默认显示
              <>
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <i className="fa fa-user text-gray-500"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">未知用户</p>
                  <p className="text-gray-500 text-xs">管理员</p>
                </div>
              </>
            )}
            <button 
              className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
              title="退出登录"
              onClick={() => {
                // 清除本地存储的令牌
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // 跳转到登录页面
                window.location.href = '/login';
              }}
            >
              <i className="fa fa-sign-out text-lg"></i>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}