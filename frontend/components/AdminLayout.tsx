'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { http } from '@/lib/http';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // global search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{ works: any[]; users: any[]; activities: any[] }>({ works: [], users: [], activities: [] });

  // notifications state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);

  const router = useRouter();

  const doSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults({ works: [], users: [], activities: [] });
      setSearchOpen(false);
      return;
    }
    try {
      setSearching(true);
      const [worksRes, usersRes, actsRes] = await Promise.all([
        http.getWorks({ page: 1, per_page: 5, search: searchTerm }),
        http.getUsers({ page: 1, per_page: 5, search: searchTerm }),
        http.getAdminActivities({ page: 1, per_page: 5, search: searchTerm })
      ]);
      setSearchResults({
        works: worksRes?.data || [],
        users: usersRes?.data || [],
        activities: actsRes?.data || []
      });
      setSearchOpen(true);
    } finally {
      setSearching(false);
    }
  };

  const refreshNotifications = async () => {
    try {
      setNotifLoading(true);
      const res = await http.getMyNotifications();
      setNotifications(res.data || []);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    if (notifOpen) {
      refreshNotifications();
    }
  }, [notifOpen]);

  const openNotificationTarget = (n: any) => {
    const link = n.link || n.link_url || n.url || n.LinkURL;
    if (link && typeof link === 'string') {
      if (link.startsWith('/')) router.push(link);
      else if (/^https?:\/\//i.test(link)) typeof window !== 'undefined' && window.open(link, '_blank');
      else router.push(link);
      return;
    }
    if (n.work_id || n.WorkID) { router.push('/admin/works'); return; }
    if (n.comment_id || n.CommentID) { router.push('/admin/comments'); return; }
    if (n.activity_id || n.ActivityID) { router.push('/admin/activities'); return; }
    // 默认跳到通知列表/详情
    router.push('/admin/notifications');
  };

  return (
    <div className="admin-layout font-sans text-gray-800">
      {/* 侧边栏 */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* 主内容区 */}
      <div className="admin-main">
        {/* 顶部导航 */}
        <header className="admin-header">
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fa fa-bars text-xl"></i>
          </button>
          <div className="flex items-center gap-4 relative">
            {/* 全局搜索 */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索作品/用户/活动..." 
                className="pl-10 pr-16 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={async (e) => { if (e.key === 'Enter') await doSearch(); }}
                onFocus={() => { if ((searchResults.works.length + searchResults.users.length + searchResults.activities.length) > 0) setSearchOpen(true); }}
              />
              <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <button
                onClick={doSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                disabled={searching}
              >{searching ? '搜索中' : '搜索'}</button>

              {searchOpen && (
                <div className="absolute z-50 mt-2 w-[28rem] bg-white border rounded-lg shadow-lg">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <div className="text-xs text-gray-500">搜索结果</div>
                    <button className="text-xs text-gray-500 hover:text-gray-700" onClick={() => setSearchOpen(false)}>关闭</button>
                  </div>
                  <div className="max-h-80 overflow-auto divide-y">
                    {(searchResults.works || []).length > 0 && (
                      <div className="p-3">
                        <div className="text-sm font-medium mb-2">作品</div>
                        <div className="space-y-1">
                          {searchResults.works.map((w: any) => (
                            <a key={w.ID} href={`/admin/works/${w.ID}`} className="block text-sm text-gray-700 hover:text-yellow-600 line-clamp-1">{w.Title}</a>
                          ))}
                        </div>
                      </div>
                    )}
                    {(searchResults.users || []).length > 0 && (
                      <div className="p-3">
                        <div className="text-sm font-medium mb-2">用户</div>
                        <div className="space-y-1">
                          {searchResults.users.map((u: any) => (
                            <a key={u.ID} href={`/admin/users/${u.ID}`} className="block text-sm text-gray-700 hover:text-yellow-600 line-clamp-1">{u.Name}（{u.Email}）</a>
                          ))}
                        </div>
                      </div>
                    )}
                    {(searchResults.activities || []).length > 0 && (
                      <div className="p-3">
                        <div className="text-sm font-medium mb-2">活动</div>
                        <div className="space-y-1">
                          {searchResults.activities.map((a: any) => (
                            <a key={a.ID} href={`/admin/activities/${a.ID}`} className="block text-sm text-gray-700 hover:text-yellow-600 line-clamp-1">{a.Title}</a>
                          ))}
                        </div>
                      </div>
                    )}
                    {(searchResults.works.length + searchResults.users.length + searchResults.activities.length) === 0 && (
                      <div className="p-3 text-sm text-gray-500">无匹配结果</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 提醒 */}
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative" onClick={() => setNotifOpen((v) => !v)}>
                <i className="fa fa-bell-o"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <div className="font-medium text-sm">提醒</div>
                    <button className="text-xs text-yellow-600" onClick={refreshNotifications}>{notifLoading ? '刷新中' : '刷新'}</button>
                  </div>
                  <div className="max-h-80 overflow-auto p-2 space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-sm text-gray-500 px-2 py-3">暂无提醒</div>
                    ) : notifications.map((n: any, idx: number) => (
                      <button key={idx} onClick={() => openNotificationTarget(n)} className="w-full text-left text-sm text-gray-700 hover:text-yellow-700 line-clamp-2 px-2 py-1 rounded hover:bg-gray-50">
                        {n.message || n.title || JSON.stringify(n)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 私信跳转 */}
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" onClick={() => router.push('/admin/messages')}>
                <i className="fa fa-envelope-o"></i>
              </button>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}