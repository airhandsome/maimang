'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { http, type Work, type WorkStats } from '@/lib/http';

export default function WorksManagement() {
  const [works, setWorks] = useState<Work[]>([]);
  const [stats, setStats] = useState<WorkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 获取作品数据
  const fetchWorks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: currentPage,
        per_page: 20,
        sort_by: 'created_at',
        sort_dir: 'desc'
      };

      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (filterType !== 'all') {
        params.type = filterType;
      }

      const response = await http.getWorks(params);
      setWorks(response.data);
      setTotalPages(response.meta.total_pages);
      setTotal(response.meta.total);
    } catch (err) {
      setError('获取作品数据失败');
      console.error('Failed to fetch works:', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const response = await http.getWorkStats();
      setStats(response.data || null);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // 审核作品
  const handleReviewWork = async (id: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await http.approveWork(id);
      } else {
        await http.rejectWork(id);
      }
      
      // 重新获取数据
      await fetchWorks();
      await fetchStats();
    } catch (err) {
      setError(`审核失败: ${err instanceof Error ? err.message : '未知错误'}`);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchWorks();
    fetchStats();
  }, [currentPage, filterStatus, filterType]);

  const filteredWorks = works;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-orange-100 text-orange-500 text-xs rounded-full">待审核</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-500 text-xs rounded-full">已通过</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-500 text-xs rounded-full">已拒绝</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">未知</span>;
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
    
    return <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>{displayType}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">作品管理</h2>
        <p className="text-gray-500">管理用户提交的文学作品，审核内容质量</p>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4">
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
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">类型筛选：</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="all">全部</option>
              <option value="poetry">诗歌</option>
              <option value="prose">散文</option>
              <option value="novel">小说</option>
              <option value="photo">摄影配文</option>
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

      {/* 作品列表 */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作品信息</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数据</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWorks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      暂无作品数据
                    </td>
                  </tr>
                ) : (
                  filteredWorks.map((work) => (
                    <tr key={work.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{work.Title}</div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">{work.Content}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{work.Author?.Name || '未知作者'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(work.Type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(work.Status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(work.CreatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>浏览: {work.Views}</div>
                        <div>点赞: {work.Likes}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/admin/works/${work.ID}`}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            查看详情
                          </Link>
                          {/* 支持所有状态重新修改 */}
                          {work.Status !== 'approved' && (
                            <button 
                              onClick={() => handleReviewWork(work.ID, 'approve')}
                              className="text-green-600 hover:text-green-900"
                            >
                              通过
                            </button>
                          )}
                          {work.Status !== 'rejected' && (
                            <button 
                              onClick={() => handleReviewWork(work.ID, 'reject')}
                              className="text-red-600 hover:text-red-900"
                            >
                              拒绝
                            </button>
                          )}
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
              <p className="text-sm text-gray-500">总作品数</p>
              <p className="text-2xl font-bold">{stats?.total_works || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-book"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待审核</p>
              <p className="text-2xl font-bold text-orange-500">{stats?.pending_works || 0}</p>
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
              <p className="text-2xl font-bold text-green-500">{stats?.approved_works || 0}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <i className="fa fa-check"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已拒绝</p>
              <p className="text-2xl font-bold text-red-500">{stats?.rejected_works || 0}</p>
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