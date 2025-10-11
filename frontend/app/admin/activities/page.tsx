'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Activity {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxParticipants: number;
  currentParticipants: number;
  description: string;
  image: string;
}

export default function ActivitiesManagement() {
  const [activities] = useState<Activity[]>([
    {
      id: 1,
      title: "秋日田野采风",
      date: "2023-10-22",
      time: "09:00-16:00",
      location: "青禾农场",
      instructor: "李老师（摄影指导）",
      status: "upcoming",
      maxParticipants: 30,
      currentParticipants: 24,
      description: "组织社员前往青禾农场进行秋日田野采风活动，体验丰收的喜悦，拍摄田野风光，感受大自然的魅力。",
      image: "https://picsum.photos/id/175/600/400"
    },
    {
      id: 2,
      title: "诗歌创作工作坊",
      date: "2023-10-28",
      time: "14:00-17:30",
      location: "麦田书屋",
      instructor: "王老师（本地诗人）",
      status: "upcoming",
      maxParticipants: 25,
      currentParticipants: 18,
      description: "特邀本地诗人王老师指导社员进行诗歌创作，分享创作心得，提升文学素养。",
      image: "https://picsum.photos/id/176/600/400"
    },
    {
      id: 3,
      title: "文学沙龙分享会",
      date: "2023-10-15",
      time: "19:00-21:00",
      location: "麦田书屋",
      instructor: "陈老师（文学评论家）",
      status: "completed",
      maxParticipants: 20,
      currentParticipants: 16,
      description: "社员们分享近期阅读的文学作品，进行深度讨论和交流。",
      image: "https://picsum.photos/id/177/600/400"
    },
    {
      id: 4,
      title: "写作技巧讲座",
      date: "2023-10-08",
      time: "15:00-17:00",
      location: "线上会议",
      instructor: "张老师（知名作家）",
      status: "completed",
      maxParticipants: 50,
      currentParticipants: 42,
      description: "知名作家张老师在线分享写作技巧，解答社员在创作中遇到的问题。",
      image: "https://picsum.photos/id/178/600/400"
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredActivities = activities.filter(activity => {
    return filterStatus === 'all' || activity.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-2 py-1 bg-blue-100 text-blue-500 text-xs rounded-full">即将开始</span>;
      case 'ongoing':
        return <span className="px-2 py-1 bg-green-100 text-green-500 text-xs rounded-full">进行中</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">已结束</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-500 text-xs rounded-full">已取消</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">未知</span>;
    }
  };

  const getParticipationRate = (current: number, max: number) => {
    const rate = (current / max) * 100;
    if (rate >= 90) return 'text-red-500';
    if (rate >= 70) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">活动管理</h2>
          <p className="text-gray-500">管理文学社活动，查看报名情况和活动状态</p>
        </div>
        <Link 
          href="/admin/activities/new"
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <i className="fa fa-plus mr-2"></i>
          创建活动
        </Link>
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
              <option value="upcoming">即将开始</option>
              <option value="ongoing">进行中</option>
              <option value="completed">已结束</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
        </div>
      </div>

      {/* 活动列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative">
              <img 
                src={activity.image} 
                alt={activity.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                {getStatusBadge(activity.status)}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2">{activity.title}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <i className="fa fa-calendar w-4 mr-2"></i>
                  {activity.date} {activity.time}
                </div>
                <div className="flex items-center">
                  <i className="fa fa-map-marker w-4 mr-2"></i>
                  {activity.location}
                </div>
                <div className="flex items-center">
                  <i className="fa fa-user w-4 mr-2"></i>
                  {activity.instructor}
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{activity.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-500">报名情况：</span>
                  <span className={`font-medium ${getParticipationRate(activity.currentParticipants, activity.maxParticipants)}`}>
                    {activity.currentParticipants}/{activity.maxParticipants}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/admin/activities/${activity.id}`}
                    className="text-yellow-600 hover:text-yellow-900 text-sm"
                  >
                    查看详情
                  </Link>
                  <button className="text-blue-600 hover:text-blue-900 text-sm">
                    编辑
                  </button>
                  {activity.status === 'upcoming' && (
                    <button className="text-red-600 hover:text-red-900 text-sm">
                      取消
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总活动数</p>
              <p className="text-2xl font-bold">{activities.length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-calendar"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">即将开始</p>
              <p className="text-2xl font-bold text-blue-500">{activities.filter(a => a.status === 'upcoming').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-clock-o"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">进行中</p>
              <p className="text-2xl font-bold text-green-500">{activities.filter(a => a.status === 'ongoing').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <i className="fa fa-play"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已结束</p>
              <p className="text-2xl font-bold text-gray-500">{activities.filter(a => a.status === 'completed').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <i className="fa fa-check"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}