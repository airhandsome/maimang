'use client';

import { useEffect, useState } from 'react';
import { http } from '@/lib/http';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await http.getMyNotifications();
      setItems(res.data || []);
    } catch (e: any) {
      setError(e?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const resolveTargetUrl = (n: any): string | null => {
    // 1) 直接使用后端给的链接
    const link = n.link || n.link_url || n.url || n.LinkURL;
    if (link && typeof link === 'string') {
      return link.startsWith('/') || /^https?:\/\//i.test(link) ? link : `/${link}`;
    }
    // 2) 根据目标类型/ID
    const workId = n.work_id || n.WorkID || n.work?.ID || (n.target_id && (n.target_type === 'work' || n.targetType === 'work') && n.target_id);
    if (workId) return `/admin/works/${workId}`;
    const commentId = n.comment_id || n.CommentID || n.comment?.ID || (n.target_id && (n.target_type === 'comment' || n.targetType === 'comment') && n.target_id);
    if (commentId) return `/admin/comments/${commentId}`;
    const activityId = n.activity_id || n.ActivityID || n.activity?.ID || (n.target_id && (n.target_type === 'activity' || n.targetType === 'activity') && n.target_id);
    if (activityId) return `/admin/activities/${activityId}`;
    // 3) 文本启发式
    const text: string = `${n.title || ''} ${n.message || ''}`;
    if (/作品|审核|投稿/.test(text)) return '/admin/works';
    if (/评论|回复/.test(text)) return '/admin/comments';
    if (/活动|报名/.test(text)) return '/admin/activities';
    return null;
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">通知提醒</h2>
          <p className="text-gray-500">查看来自系统与内容的提醒</p>
        </div>
        <button onClick={load} className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">刷新</button>
      </div>

      {loading && (
        <div className="p-8 text-center text-gray-500">加载中...</div>
      )}
      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
      )}

      {!loading && items.length === 0 && (
        <div className="p-8 text-center text-gray-500">暂无通知</div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y">
          {items.map((n, idx) => {
            const url = resolveTargetUrl(n);
            const isExternal = !!url && /^https?:\/\//i.test(url);
            return (
            <div key={n.id ?? idx} className="p-4 flex items-start justify-between hover:bg-gray-50">
              <div className="flex-1 pr-4">
                <div className="font-medium text-gray-900 mb-1">{n.title || n.message || '通知'}</div>
                {n.description && <div className="text-sm text-gray-600">{n.description}</div>}
                {n.time && <div className="text-xs text-gray-400 mt-1">{new Date(n.time).toLocaleString()}</div>}
              </div>
              <div className="flex items-center gap-2">
                {url ? (
                  isExternal ? (
                    <a href={url} target="_blank" rel="noreferrer" className="text-yellow-600 hover:text-yellow-800 text-sm">查看</a>
                  ) : (
                    <a href={url} className="text-yellow-600 hover:text-yellow-800 text-sm">查看</a>
                  )
                ) : (
                  <button onClick={() => router.push('/admin/notifications')} className="text-gray-500 hover:text-gray-700 text-sm">查看</button>
                )}
              </div>
            </div>
          ); })}
        </div>
      </div>
    </div>
  );
}

