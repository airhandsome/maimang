'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Work {
  id: number;
  title: string;
  author: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  submitDate: string;
  views: number;
  likes: number;
  content: string;
}

export default function WorksManagement() {
  const [works] = useState<Work[]>([
    {
      id: 1,
      title: "《秋日麦浪》",
      author: "张小明",
      type: "诗歌",
      status: "approved",
      submitDate: "2023-10-05",
      views: 128,
      likes: 36,
      content: "风吹过田野的轮廓\n麦穗低垂，如时光的重量\n每一粒果实里，都藏着\n整个夏天的阳光"
    },
    {
      id: 2,
      title: "《城市边缘》",
      author: "李小红",
      type: "诗歌",
      status: "rejected",
      submitDate: "2023-10-01",
      views: 45,
      likes: 8,
      content: "高楼吞噬了最后的绿地\n钢筋水泥的森林里\n人们行色匆匆\n忘记了泥土的芬芳"
    },
    {
      id: 3,
      title: "《田野记忆》",
      author: "王小华",
      type: "散文",
      status: "pending",
      submitDate: "2023-10-15",
      views: 0,
      likes: 0,
      content: "小时候，我常常在田野里奔跑，追逐着蝴蝶，听着鸟儿的歌唱..."
    },
    {
      id: 4,
      title: "《麦田守望者》",
      author: "赵小强",
      type: "小说",
      status: "pending",
      submitDate: "2023-10-12",
      views: 0,
      likes: 0,
      content: "第一章：初到麦田\n\n李明第一次来到这个小镇，被眼前的麦田深深震撼..."
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredWorks = works.filter(work => {
    const statusMatch = filterStatus === 'all' || work.status === filterStatus;
    const typeMatch = filterType === 'all' || work.type === filterType;
    return statusMatch && typeMatch;
  });

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
    const colors = {
      '诗歌': 'bg-blue-100 text-blue-500',
      '散文': 'bg-green-100 text-green-500',
      '小说': 'bg-purple-100 text-purple-500',
      '摄影配文': 'bg-yellow-100 text-yellow-500'
    };
    return <span className={`px-2 py-1 text-xs rounded-full ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-500'}`}>{type}</span>;
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
              <option value="诗歌">诗歌</option>
              <option value="散文">散文</option>
              <option value="小说">小说</option>
              <option value="摄影配文">摄影配文</option>
            </select>
          </div>
        </div>
      </div>

      {/* 作品列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
              {filteredWorks.map((work) => (
                <tr key={work.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{work.title}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">{work.content}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{work.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(work.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(work.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {work.submitDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>浏览: {work.views}</div>
                    <div>点赞: {work.likes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/works/${work.id}`}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        查看详情
                      </Link>
                      {work.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900">
                            通过
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            拒绝
                          </button>
                        </>
                      )}
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
              <p className="text-sm text-gray-500">总作品数</p>
              <p className="text-2xl font-bold">{works.length}</p>
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
              <p className="text-2xl font-bold text-orange-500">{works.filter(w => w.status === 'pending').length}</p>
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
              <p className="text-2xl font-bold text-green-500">{works.filter(w => w.status === 'approved').length}</p>
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
              <p className="text-2xl font-bold text-red-500">{works.filter(w => w.status === 'rejected').length}</p>
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