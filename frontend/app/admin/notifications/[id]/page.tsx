'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { http } from '@/lib/http';

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 暂无后端详情接口：从列表抓取并根据 index/id 兜底
      const res = await http.getMyNotifications();
      const list = res.data || [];
      const found = list.find((n: any) => String(n.id) === id) ?? list[Number(id)] ?? null;
      setItem(found);
      setLoading(false);
    })();
  }, [id]);

  const goOrigin = () => {
    if (!item) return;
    const link = item.link || item.link_url || item.url || item.LinkURL;
    if (link && typeof link === 'string') {
      if (link.startsWith('/')) router.push(link);
      else if (/^https?:\/\//i.test(link)) typeof window !== 'undefined' && window.open(link, '_blank');
      else router.push(link);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">通知详情</h2>
          <p className="text-gray-500">查看通知内容与跳转</p>
        </div>
        <a href="/admin/notifications" className="text-sm text-gray-600 hover:text-gray-800">返回列表</a>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">加载中...</div>
      ) : !item ? (
        <div className="p-8 text-center text-gray-500">未找到该通知</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <div className="text-xl font-semibold">{item.title || item.message || '通知'}</div>
          {item.description && <div className="text-gray-700">{item.description}</div>}
          {item.time && <div className="text-sm text-gray-400">{new Date(item.time).toLocaleString()}</div>}
          <div className="pt-2">
            <button onClick={goOrigin} className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">前往原内容</button>
          </div>
        </div>
      )}
    </div>
  );
}

