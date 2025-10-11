'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { http, type Work } from '@/lib/http';

export default function WorkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workId = params.id as string;
  
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNote, setReviewNote] = useState('');
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [editReviewNote, setEditReviewNote] = useState('');
  const [editRejectReason, setEditRejectReason] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // 获取作品详情
  const fetchWorkDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await http.getWork(parseInt(workId));
      if (response.success && response.data) {
        setWork(response.data);
      } else {
        setError('获取作品详情失败');
      }
    } catch (err: any) {
      setError(err.message || '获取作品详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 审核作品
  const handleReview = async () => {
    if (!work) return;
    
    try {
      setReviewLoading(true);
      
      if (reviewAction === 'approve') {
        await http.approveWork(work.ID, reviewNote);
      } else {
        await http.rejectWork(work.ID, reviewNote);
      }
      
      // 重新获取作品详情
      await fetchWorkDetail();
      setShowReviewModal(false);
      setReviewNote('');
    } catch (err: any) {
      setError(err.message || '审核失败');
    } finally {
      setReviewLoading(false);
    }
  };

  // 打开审核模态框
  const openReviewModal = (action: 'approve' | 'reject') => {
    setReviewAction(action);
    setReviewNote('');
    setShowReviewModal(true);
  };

  // 打开编辑评审意见模态框
  const openEditReviewModal = () => {
    if (work) {
      setEditReviewNote(work.ReviewNote || '');
      setEditRejectReason(work.RejectReason || '');
      setShowEditReviewModal(true);
    }
  };

  // 保存编辑的评审意见
  const handleEditReview = async () => {
    if (!work) return;
    
    try {
      setEditLoading(true);
      
      // 调用更新评审意见的API
      await http.updateWorkReview(work.ID, {
        reviewNote: editReviewNote,
        rejectReason: editRejectReason
      });
      
      // 重新获取作品详情
      await fetchWorkDetail();
      setShowEditReviewModal(false);
    } catch (err: any) {
      setError(err.message || '更新评审意见失败');
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    if (workId) {
      fetchWorkDetail();
    }
  }, [workId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-orange-100 text-orange-500 text-sm rounded-full">待审核</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-500 text-sm rounded-full">已通过</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-500 text-sm rounded-full">已拒绝</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">未知</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      'poetry': '诗歌',
      'prose': '散文',
      'novel': '小说',
      'photo': '摄影配文'
    };
    
    const colors = {
      'poetry': 'bg-blue-100 text-blue-500',
      'prose': 'bg-green-100 text-green-500',
      'novel': 'bg-purple-100 text-purple-500',
      'photo': 'bg-yellow-100 text-yellow-500'
    };
    
    const displayType = typeMap[type as keyof typeof typeMap] || type;
    const colorClass = colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-500';
    
    return <span className={`px-3 py-1 text-sm rounded-full ${colorClass}`}>{displayType}</span>;
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

  if (!work) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">📄</div>
          <p className="text-gray-600 mb-4">作品不存在</p>
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
                href="/admin/works"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← 返回作品列表
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">作品详情</h1>
            </div>
            {work.Status === 'pending' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openReviewModal('approve')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  通过审核
                </button>
                <button
                  onClick={() => openReviewModal('reject')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  拒绝审核
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 作品基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{work.Title}</h2>
              <div className="flex items-center gap-4">
                {getTypeBadge(work.Type)}
                {getStatusBadge(work.Status)}
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>提交时间: {new Date(work.CreatedAt).toLocaleString()}</div>
              <div>更新时间: {new Date(work.UpdatedAt).toLocaleString()}</div>
            </div>
          </div>

          {/* 作者信息 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">作者信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">姓名:</span>
                <span className="ml-2 font-medium">{work.Author?.Name || '未知作者'}</span>
              </div>
              <div>
                <span className="text-gray-500">邮箱:</span>
                <span className="ml-2">{work.Author?.Email || '未知'}</span>
              </div>
              <div>
                <span className="text-gray-500">角色:</span>
                <span className="ml-2">{work.Author?.Role || '未知'}</span>
              </div>
              <div>
                <span className="text-gray-500">状态:</span>
                <span className="ml-2">{work.Author?.Status || '未知'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 作品内容 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">作品内容</h3>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {work.Content}
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">统计数据</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{work.Views}</div>
              <div className="text-sm text-gray-500">浏览量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{work.Likes}</div>
              <div className="text-sm text-gray-500">点赞数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{work.ID}</div>
              <div className="text-sm text-gray-500">作品ID</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{work.AuthorID}</div>
              <div className="text-sm text-gray-500">作者ID</div>
            </div>
          </div>
        </div>

        {/* 审核信息 */}
        {(work.Status === 'approved' || work.Status === 'rejected') && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">审核信息</h3>
              <button
                onClick={openEditReviewModal}
                className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
              >
                编辑评审意见
              </button>
            </div>
            <div className="space-y-3">
              {work.ReviewedAt && (
                <div>
                  <span className="text-gray-500">审核时间:</span>
                  <span className="ml-2">{new Date(work.ReviewedAt).toLocaleString()}</span>
                </div>
              )}
              {work.Reviewer && (
                <div>
                  <span className="text-gray-500">评审人:</span>
                  <span className="ml-2 font-medium">{work.Reviewer.Name}</span>
                </div>
              )}
              {work.ReviewNote && (
                <div>
                  <span className="text-gray-500">审核备注:</span>
                  <div className="mt-1 p-3 bg-gray-50 rounded text-gray-700">
                    {work.ReviewNote}
                  </div>
                </div>
              )}
              {work.RejectReason && (
                <div>
                  <span className="text-gray-500">拒绝原因:</span>
                  <div className="mt-1 p-3 bg-red-50 rounded text-red-700">
                    {work.RejectReason}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 审核模态框 */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {reviewAction === 'approve' ? '通过审核' : '拒绝审核'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {reviewAction === 'approve' ? '审核备注' : '拒绝原因'}
              </label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                rows={4}
                placeholder={reviewAction === 'approve' ? '请输入审核备注（可选）' : '请输入拒绝原因'}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                disabled={reviewLoading}
              >
                取消
              </button>
              <button
                onClick={handleReview}
                disabled={reviewLoading}
                className={`px-4 py-2 text-white rounded ${
                  reviewAction === 'approve' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                } disabled:opacity-50`}
              >
                {reviewLoading ? '处理中...' : (reviewAction === 'approve' ? '通过' : '拒绝')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑评审意见模态框 */}
      {showEditReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">编辑评审意见</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  审核备注
                </label>
                <textarea
                  value={editReviewNote}
                  onChange={(e) => setEditReviewNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  rows={3}
                  placeholder="请输入审核备注"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  拒绝原因
                </label>
                <textarea
                  value={editRejectReason}
                  onChange={(e) => setEditRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  rows={3}
                  placeholder="请输入拒绝原因"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditReviewModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                disabled={editLoading}
              >
                取消
              </button>
              <button
                onClick={handleEditReview}
                disabled={editLoading}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                {editLoading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}