'use client';

import { useEffect, useState } from 'react';
import { http } from '@/lib/http';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [thread, setThread] = useState<any[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    setLoading(true);
    const res = await http.getConversations();
    const convs = res.data || [];
    setConversations(convs);
    if (convs.length > 0 && activeUserId == null) {
      const firstId = convs[0]?.ID || convs[0]?.id;
      if (firstId) setActiveUserId(Number(firstId));
    }
    setLoading(false);
  };

  const loadThread = async (uid: number) => {
    const res = await http.getMessagesWith(uid);
    setThread(res.data || []);
    await http.markMessagesRead(uid);
  };

  const sendMessage = async () => {
    if (!draft.trim() || activeUserId == null || sending) return;
    try {
      setSending(true);
      await http.sendMessageTo(activeUserId, draft.trim());
      setDraft('');
      await loadThread(activeUserId);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { if (activeUserId != null) loadThread(activeUserId); }, [activeUserId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">站内私信</h2>
        <p className="text-gray-500">与用户进行一对一沟通</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
        {/* 会话列表 */}
        <div className="border-r p-3 space-y-2 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-gray-500 text-sm">加载会话中...</div>
          ) : conversations.length === 0 ? (
            <div className="text-gray-500 text-sm">暂无会话</div>
          ) : (
            conversations.map((u: any) => (
              <button key={u.ID} onClick={() => setActiveUserId(u.ID)} className={`w-full text-left px-3 py-2 rounded ${activeUserId === u.ID ? 'bg-yellow-50 text-yellow-700' : 'hover:bg-gray-50'}`}>
                <div className="font-medium line-clamp-1">{u.Name}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{u.Email}</div>
              </button>
            ))
          )}
        </div>

        {/* 对话内容 */}
        <div className="md:col-span-2 flex flex-col">
          <div className="flex-1 p-4 space-y-3 max-h-[60vh] overflow-y-auto">
            {activeUserId == null ? (
              <div className="text-gray-500 text-sm">选择一个会话以查看消息</div>
            ) : thread.length === 0 ? (
              <div className="text-gray-500 text-sm">暂无消息</div>
            ) : (
              thread.map((m: any) => (
                <div key={m.ID} className={`text-sm max-w-[80%] ${m.FromUserID === activeUserId ? '' : 'ml-auto'}`}>
                  <div className="text-gray-400 mb-1">{new Date(m.CreatedAt).toLocaleString()}</div>
                  <div className={`rounded p-2 ${m.FromUserID === activeUserId ? 'bg-gray-100' : 'bg-yellow-100'}`}>{m.Content}</div>
                </div>
              ))
            )}
          </div>
          {/* 发送框：当且仅当选择了会话时显示 */}
          {activeUserId != null && (
            <div className="p-4 border-t flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="输入消息内容..."
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
              <button onClick={sendMessage} disabled={sending} className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50">{sending ? '发送中' : '发送'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

