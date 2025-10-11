'use client';

import { useState } from 'react';

interface Comment {
  id: number;
  content: string;
  author: string;
  authorEmail: string;
  workTitle: string;
  workId: number;
  submitDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  likes: number;
  replies: number;
}

export default function CommentsManagement() {
  const [comments] = useState<Comment[]>([
    {
      id: 1,
      content: "这首诗写得真好，特别是'每一粒果实里，都藏着整个夏天的阳光'这句，很有意境！",
      author: "张小明",
      authorEmail: "zhangxiaoming@example.com",
      workTitle: "《秋日麦浪》",
      workId: 1,
      submitDate: "2023-10-20",
      status: "approved",
      likes: 5,
      replies: 2
    },
    {
      id: 2,
      content: "作者对城市生活的观察很深刻，但感觉缺少一些温暖的情感。",
      author: "李小红",
      authorEmail: "lixiaohong@example.com",
      workTitle: "《城市边缘》",
      workId: 2,
      submitDate: "2023-10-19",
      status: "approved",
      likes: 3,
      replies: 1
    },
    {
      id: 3,
      content: "这篇散文让我想起了自己的童年，写得非常感人。期待作者更多作品！",
      author: "王小华",
      authorEmail: "wangxiaohua@example.com",
      workTitle: "《田野记忆》",
      workId: 3,
      submitDate: "2023-10-18",
      status: "pending",
      likes: 0,
      replies: 0
    },
    {
      id: 4,
      content: "内容质量一般，建议作者多读一些经典作品提升写作水平。",
      author: "赵小强",
      authorEmail: "zhaoxiaoqiang@example.com",
      workTitle: "《麦田守望者》",
      workId: 4,
      submitDate: "2023-10-17",
      status: "rejected",
      likes: 1,
      replies: 0
    },
    {
      id: 5,
      content: "垃圾内容，毫无价值！",
      author: "匿名用户",
      authorEmail: "anonymous@example.com",
      workTitle: "《秋日麦浪》",
      workId: 1,
      submitDate: "2023-10-16",
      status: "hidden",
      likes: 0,
      replies: 0
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredComments = comments.filter(comment => {
    const statusMatch = filterStatus === 'all' || comment.status === filterStatus;
    const searchMatch = searchTerm === '' || 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.workTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

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

      {/* 评论列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
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
              {filteredComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 line-clamp-3">{comment.content}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{comment.author}</div>
                      <div className="text-sm text-gray-500">{comment.authorEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.workTitle}</div>
                    <div className="text-sm text-gray-500">ID: {comment.workId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(comment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comment.submitDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>点赞: {comment.likes}</div>
                    <div>回复: {comment.replies}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-yellow-600 hover:text-yellow-900">
                        查看详情
                      </button>
                      {comment.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900">
                            通过
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            拒绝
                          </button>
                        </>
                      )}
                      {comment.status === 'approved' && (
                        <button className="text-gray-600 hover:text-gray-900">
                          隐藏
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-900">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总评论数</p>
              <p className="text-2xl font-bold">{comments.length}</p>
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
              <p className="text-2xl font-bold text-orange-500">{comments.filter(c => c.status === 'pending').length}</p>
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
              <p className="text-2xl font-bold text-green-500">{comments.filter(c => c.status === 'approved').length}</p>
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
              <p className="text-2xl font-bold text-red-500">{comments.filter(c => c.status === 'rejected' || c.status === 'hidden').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <i className="fa fa-times"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}