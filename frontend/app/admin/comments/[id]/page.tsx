'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { http, type Comment, type ApiResponse } from '@/lib/http';

export default function AdminCommentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id as string;
  const commentId = Number(idParam);

  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComment = async () => {
    try {
      setLoading(true);
      const res = await http.getComment(commentId);
      if (res.success && res.data) {
        setComment(res.data);
      } else {
        setError(res.message || '获取评论失败');
      }
    } catch (e: any) {
      setError(e?.message || '获取评论失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(commentId)) {
      setError('无效的评论ID');
      setLoading(false);
      return;
    }
    fetchComment();
  }, [commentId]);

  const doAction = async (fn: () => Promise<ApiResponse>, onDone?: () => void) => {
    try {
      setActionLoading(true);
      const res = await fn();
      if (!res.success) throw new Error(res.message || '操作失败');
      await fetchComment();
      onDone && onDone();
    } catch (e: any) {
      setError(e?.message || '操作失败');
    } finally {
      setActionLoading(false);
    }
  };

  const statusBadge = (status?: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-orange-100 text-orange-500 text-xs rounded-full">待审核</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-500 text-xs rounded-full">已通过</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-500 text-xs rounded-full">已拒绝</span>;
      case 'hidden':
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">已隐藏</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">未知</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => fetchComment()} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">重试</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">评论详情</h2>
          <p className="text-gray-500">查看与管理单条评论</p>
        </div>
        <button onClick={() => router.back()} className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">返回</button>
      </div>

      {comment && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5 lg:col-span-2">
            <h3 className="font-bold text-lg mb-4">评论内容</h3>
            <div className="text-gray-900 whitespace-pre-wrap break-words">{comment.Content}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-lg mb-4">信息</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">状态</span><span>{statusBadge(comment.Status)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">创建时间</span><span>{new Date(comment.CreatedAt).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">点赞</span><span>{comment.Likes}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">回复</span><span>{comment.Replies}</span></div>
            </div>

            <div className="mt-6 space-y-2">
              {comment.Status === 'pending' && (
                <>
                  <button disabled={actionLoading} onClick={() => doAction(() => http.approveComment(comment.ID))} className="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50">通过</button>
                  <button disabled={actionLoading} onClick={() => doAction(() => http.rejectComment(comment.ID))} className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">拒绝</button>
                  <button disabled={actionLoading} onClick={() => doAction(() => http.hideComment(comment.ID))} className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">隐藏</button>
                </>
              )}
              {comment.Status === 'approved' && (
                <>
                  <button disabled={actionLoading} onClick={() => doAction(() => http.pendComment(comment.ID))} className="w-full px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50">退回待审核</button>
                  <button disabled={actionLoading} onClick={() => doAction(() => http.hideComment(comment.ID))} className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">隐藏</button>
                </>
              )}
              {comment.Status === 'hidden' && (
                <button disabled={actionLoading} onClick={() => doAction(() => http.unhideComment(comment.ID))} className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">取消隐藏（设为已通过）</button>
              )}
              {comment.Status === 'rejected' && (
                <button disabled={actionLoading} onClick={() => doAction(() => http.pendComment(comment.ID))} className="w-full px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50">重新审核</button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 lg:col-span-3">
            <h3 className="font-bold text-lg mb-4">关联信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg border">
                <div className="text-gray-500 mb-1">作者</div>
                <div className="font-medium">{comment.Author?.Name || '未知作者'}</div>
                <div className="text-gray-500">{comment.Author?.Email || '未知邮箱'}</div>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="text-gray-500 mb-1">作品</div>
                <div className="font-medium">{comment.Work?.Title || '未知作品'}</div>
                <div className="text-gray-500">ID: {comment.WorkID}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

