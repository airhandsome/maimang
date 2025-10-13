'use client';

import { useState, useEffect } from 'react';
import { http, type Comment, type CommentStats } from '@/lib/http';

export default function CommentsManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<CommentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 获取评论数据
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: currentPage,
        per_page: 20,
      };

      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await http.getComments(params);
      setComments(response.data);
      setTotalPages(response.meta.total_pages);
      setTotal(response.meta.total);
    } catch (err) {
      setError('获取评论数据失败');
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const response = await http.getCommentStats();
      setStats(response.data || null);
    } catch (err) {
      console.error('Failed to fetch comment stats:', err);
    }
  };

  // 多选控制
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const allCurrentIds = comments.map(c => c.ID);
  const isAllSelected = allCurrentIds.length > 0 && allCurrentIds.every(id => selectedIds.includes(id));
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter(id => !allCurrentIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allCurrentIds])));
    }
  };

  const runBatch = async (action: 'approve' | 'reject' | 'hide' | 'unhide' | 'pend' | 'delete') => {
    if (selectedIds.length === 0) return;
    const confirmTextMap: Record<string, string> = {
      approve: '确定批量通过选中的评论吗？',
      reject: '确定批量拒绝选中的评论吗？',
      hide: '确定批量隐藏选中的评论吗？',
      unhide: '确定批量取消隐藏选中的评论吗？',
      pend: '确定将选中的评论退回待审核吗？',
      delete: '确定批量删除选中的评论吗？此操作不可撤销。'
    };
    if (!confirm(confirmTextMap[action])) return;

    try {
      setLoading(true);
      const calls = selectedIds.map((id) => {
        switch (action) {
          case 'approve':
            return http.approveComment(id);
          case 'reject':
            return http.rejectComment(id);
          case 'hide':
            return http.hideComment(id);
          case 'unhide':
            return http.unhideComment(id);
          case 'pend':
            return http.pendComment(id);
          case 'delete':
            return http.deleteComment(id);
        }
      });
      await Promise.allSettled(calls);
      await fetchComments();
      await fetchStats();
      setSelectedIds([]);
    } catch (err) {
      console.error('Batch action failed', err);
      setError('批量操作失败');
    } finally {
      setLoading(false);
    }
  };

  // 审核评论
  const handleReviewComment = async (id: number, action: 'approve' | 'reject' | 'hide') => {
    try {
      if (action === 'approve') {
        await http.approveComment(id);
      } else if (action === 'reject') {
        await http.rejectComment(id);
      } else if (action === 'hide') {
        await http.hideComment(id);
      }
      
      // 重新获取数据
      await fetchComments();
      await fetchStats();
    } catch (err: any) {
      setError(`审核失败: ${err instanceof Error ? err.message : '未知错误'}`);
    }
  };

  // 删除评论
  const handleDeleteComment = async (id: number) => {
    if (!confirm('确定要删除这条评论吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      await http.deleteComment(id);
      // 重新获取数据
      await fetchComments();
      await fetchStats();
    } catch (err: any) {
      setError(`删除失败: ${err instanceof Error ? err.message : '未知错误'}`);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchComments();
    fetchStats();
  }, [currentPage, filterStatus, searchTerm]);

  const filteredComments = comments;

  const getStatusBadge = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">评论管理</h2>
        <p className="text-gray-500">管理用户评论，审核内容质量，维护社区环境</p>
      </div>

      {/* 搜索和筛选器 */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索评论内容、作者或作品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
              <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">状态筛选：</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="all">全部</option>
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
              <option value="hidden">已隐藏</option>
            </select>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 批量操作栏 */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="text-sm text-gray-600">已选：{selectedIds.length}</div>
        <div className="flex flex-wrap gap-2">
          <button disabled={selectedIds.length === 0} onClick={() => runBatch('approve')} className="px-3 py-1 text-sm rounded border border-green-200 text-green-600 disabled:opacity-50">批量通过</button>
          <button disabled={selectedIds.length === 0} onClick={() => runBatch('reject')} className="px-3 py-1 text-sm rounded border border-red-200 text-red-600 disabled:opacity-50">批量拒绝</button>
          <button disabled={selectedIds.length === 0} onClick={() => runBatch('hide')} className="px-3 py-1 text-sm rounded border border-gray-200 text-gray-700 disabled:opacity-50">批量隐藏</button>
          <button disabled={selectedIds.length === 0} onClick={() => runBatch('unhide')} className="px-3 py-1 text-sm rounded border border-blue-200 text-blue-600 disabled:opacity-50">批量取消隐藏</button>
          <button disabled={selectedIds.length === 0} onClick={() => runBatch('pend')} className="px-3 py-1 text-sm rounded border border-yellow-200 text-yellow-600 disabled:opacity-50">批量待审核</button>
          <button disabled={selectedIds.length === 0} onClick={() => runBatch('delete')} className="px-3 py-1 text-sm rounded border border-red-300 text-red-700 disabled:opacity-50">批量删除</button>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">评论内容</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属作品</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">互动数据</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      暂无评论数据
                    </td>
                  </tr>
                ) : (
                  filteredComments.map((comment) => (
                    <tr key={comment.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" checked={selectedIds.includes(comment.ID)} onChange={() => toggleSelect(comment.ID)} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 line-clamp-3">{comment.Content}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{comment.Author?.Name || '未知作者'}</div>
                          <div className="text-sm text-gray-500">{comment.Author?.Email || '未知邮箱'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{comment.Work?.Title || '未知作品'}</div>
                        <div className="text-sm text-gray-500">ID: {comment.WorkID}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(comment.Status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(comment.CreatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>点赞: {comment.Likes}</div>
                        <div>回复: {comment.Replies}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <a href={`/admin/comments/${comment.ID}`} className="text-yellow-600 hover:text-yellow-900">
                            查看详情
                          </a>
                          {comment.Status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleReviewComment(comment.ID, 'approve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                通过
                              </button>
                              <button 
                                onClick={() => handleReviewComment(comment.ID, 'reject')}
                                className="text-red-600 hover:text-red-900"
                              >
                                拒绝
                              </button>
                            </>
                          )}
                          {comment.Status === 'approved' && (
                            <button 
                              onClick={() => handleReviewComment(comment.ID, 'hide')}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              隐藏
                            </button>
                          )}
                          {comment.Status === 'hidden' && (
                            <button 
                              onClick={async () => { await http.unhideComment(comment.ID); await fetchComments(); await fetchStats(); }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              取消隐藏
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteComment(comment.ID)}
                            className="text-red-600 hover:text-red-900"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总评论数</p>
              <p className="text-2xl font-bold">{stats?.total_comments || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-comments"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待审核</p>
              <p className="text-2xl font-bold text-orange-500">{stats?.pending_comments || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <i className="fa fa-clock-o"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已通过</p>
              <p className="text-2xl font-bold text-green-500">{stats?.approved_comments || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <i className="fa fa-check"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已拒绝/隐藏</p>
              <p className="text-2xl font-bold text-red-500">{(stats?.rejected_comments || 0) + (stats?.hidden_comments || 0)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <i className="fa fa-times"></i>
            </div>
          </div>
        </div>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}