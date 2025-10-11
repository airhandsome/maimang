'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

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
    <div className="bg-gray-50 font-sans text-gray-800 min-h-screen flex overflow-hidden">
      {/* 侧边栏 */}
      <aside className={`w-64 bg-white shadow-md h-screen flex-shrink-0 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'block' : 'hidden md:block'
      }`}>
        <div className="p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
              <i className="fa fa-pencil text-white"></i>
            </div>
            <h1 className="text-xl font-bold">麦芒管理系统</h1>
          </div>
        </div>
        
        <div className="p-4">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
              >
                <i className={`fa ${item.icon} w-5 text-center`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3">
            <img src="https://picsum.photos/id/64/100/100" alt="管理员头像" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-medium text-sm">王管理员</p>
              <p className="text-gray-500 text-xs">超级管理员</p>
            </div>
            <button className="ml-auto text-gray-400 hover:text-red-500 transition-colors">
              <i className="fa fa-sign-out"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航 */}
        <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between">
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fa fa-bars text-xl"></i>
          </button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 w-64"
              />
              <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative">
                <i className="fa fa-bell-o"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <i className="fa fa-envelope-o"></i>
              </button>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}