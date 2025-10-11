"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "林清禾",
    avatar: "https://picsum.photos/id/64/200/200",
    level: "麦穗级",
    points: 65,
    nextLevelPoints: 100,
    joinDate: "2021-03-15",
    bio: "热爱诗歌与自然的创作者",
    stats: {
      publishedWorks: 12,
      activities: 8,
      likes: 246
    }
  });

  const [recentWorks] = useState([
    {
      id: 1,
      title: "《秋日麦浪》",
      type: "诗歌",
      date: "2023-10-05",
      views: 128,
      likes: 36,
      comments: 5,
      content: "风吹过田野的轮廓\n麦穗低垂，如时光的重量\n每一粒果实里，都藏着\n整个夏天的阳光"
    },
    {
      id: 2,
      title: "《与稻草人对话》",
      type: "散文",
      date: "2023-09-20",
      views: 95,
      likes: 24,
      comments: 3,
      content: "田野中央的稻草人，戴着褪色的草帽，沉默地站了整个夏天。我坐在它脚下，听风穿过麦芒的声音，像一首古老的歌谣..."
    },
    {
      id: 3,
      title: "《晨露》",
      type: "诗歌",
      date: "2023-09-08",
      views: 156,
      likes: 42,
      comments: 8,
      content: "草叶尖的珍珠\n是月亮遗落的信笺\n阳光读过后\n便化作一缕轻烟"
    }
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      title: "秋日田野采风",
      date: "2023-10-22",
      time: "09:00-16:00",
      location: "青禾农场",
      status: "upcoming",
      image: "https://picsum.photos/id/183/400/300"
    },
    {
      id: 2,
      title: "诗歌创作分享会",
      date: "2023-10-15",
      time: "14:30-17:00",
      location: "麦田书屋",
      status: "completed",
      image: "https://picsum.photos/id/175/400/300"
    }
  ]);

  const [notifications] = useState([
    {
      id: 1,
      type: "activity",
      title: "本周末\"秋日田野采风\"活动即将开始",
      content: "你已报名参加，活动时间：10月22日 09:00-16:00",
      time: "2小时前"
    },
    {
      id: 2,
      type: "comment",
      title: "你的作品《麦田里的风》收到了3条新评论",
      content: "快去看看大家的反馈吧",
      time: "1天前"
    }
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 主内容区 */}
      <main className="flex-grow relative z-10 container mx-auto px-4 py-12 bg-cream wheat-pattern">
        <div className="max-w-6xl mx-auto">
          {/* 用户信息头部 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-10">
            <div className="h-32 md:h-48 bg-gradient-to-r from-gold/20 to-gold/5 relative">
              <div className="absolute -bottom-16 left-6 md:left-10">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            
            <div className="pt-20 pb-6 px-6 md:px-10 md:pt-24 md:pb-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <h1 className="text-2xl md:text-3xl font-display text-text mr-3">{user.name}</h1>
                    <span className="bg-gold/10 text-gold text-xs px-2 py-1 rounded-full">{user.level}社员</span>
                  </div>
                  <p className="text-text/70 mb-4 md:mb-0">{user.bio} | 加入于 {user.joinDate}</p>
                </div>
                <Link href="/profile/edit" className="inline-flex items-center text-gold hover:text-goldDark transition-colors mt-4 md:mt-0">
                  <i className="fa fa-pencil mr-1"></i> 编辑个人资料
                </Link>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：数据统计 */}
            <div className="lg:col-span-1 space-y-8">
              {/* 社员等级 */}
              <div className="bg-white rounded-2xl shadow-md p-6 card-lift">
                <h3 className="text-lg font-display text-text mb-4 flex items-center">
                  <i className="fa fa-trophy text-gold mr-2"></i> 社员等级
                </h3>
                
                <div className="text-center mb-6">
                  <div className="inline-block p-3 bg-gold/10 rounded-full mb-3">
                    <i className="fa fa-star text-2xl text-gold"></i>
                  </div>
                  <h4 className="text-xl font-medium">{user.level}</h4>
                  <p className="text-sm text-text/60 mt-1">距离下一等级还需 {user.nextLevelPoints - user.points} 积分</p>
                </div>
                
                <div className="mb-2 flex justify-between text-sm">
                  <span>当前积分：{user.points}/{user.nextLevelPoints}</span>
                  <span>下一级：稻穗级</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-value" style={{width: `${(user.points / user.nextLevelPoints) * 100}%`}}></div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-text/70 mb-3">如何获取积分？</p>
                  <ul className="text-xs text-text/60 space-y-1">
                    <li className="flex items-start">
                      <i className="fa fa-circle text-gold text-[6px] mt-1.5 mr-2"></i>
                      <span>发布作品：+5 积分/篇</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa fa-circle text-gold text-[6px] mt-1.5 mr-2"></i>
                      <span>参与活动：+10 积分/次</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa fa-circle text-gold text-[6px] mt-1.5 mr-2"></i>
                      <span>作品被推荐：+20 积分/次</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* 数据概览 */}
              <div className="bg-white rounded-2xl shadow-md p-6 card-lift">
                <h3 className="text-lg font-display text-text mb-6 flex items-center">
                  <i className="fa fa-bar-chart text-gold mr-2"></i> 创作数据
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text/70">已发布作品</span>
                      <span className="text-sm font-medium">{user.stats.publishedWorks} 篇</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-value" style={{width: '70%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text/70">参与活动</span>
                      <span className="text-sm font-medium">{user.stats.activities} 次</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-value" style={{width: '50%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text/70">获得点赞</span>
                      <span className="text-sm font-medium">{user.stats.likes} 个</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-value" style={{width: '80%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 个人标签 */}
              <div className="bg-white rounded-2xl shadow-md p-6 card-lift">
                <h3 className="text-lg font-display text-text mb-4 flex items-center">
                  <i className="fa fa-tags text-gold mr-2"></i> 创作标签
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gold/10 text-gold text-sm px-3 py-1 rounded-full">诗歌</span>
                  <span className="bg-wheat text-text/80 text-sm px-3 py-1 rounded-full">自然</span>
                  <span className="bg-wheat text-text/80 text-sm px-3 py-1 rounded-full">田野</span>
                  <span className="bg-wheat text-text/80 text-sm px-3 py-1 rounded-full">季节</span>
                  <span className="bg-wheat text-text/80 text-sm px-3 py-1 rounded-full">散文</span>
                  <span className="bg-wheat text-text/80 text-sm px-3 py-1 rounded-full">摄影配文</span>
                </div>
              </div>
            </div>
            
            {/* 右侧：内容区 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 待办提醒 */}
              <div className="bg-gold/5 rounded-2xl p-6">
                <h3 className="text-lg font-display text-text mb-4 flex items-center">
                  <i className="fa fa-bell text-gold mr-2"></i> 待办提醒
                </h3>
                
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="bg-white rounded-xl p-4 shadow-sm flex items-start">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mr-4 flex-shrink-0">
                        <i className={`fa ${notification.type === 'activity' ? 'fa-calendar' : 'fa-pencil'} text-gold`}></i>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-text/70 mt-1">{notification.content}</p>
                        <div className="mt-3 flex gap-3">
                          <a href="#" className="text-sm text-gold hover:text-goldDark transition-colors">查看详情</a>
                          {notification.type === 'activity' && (
                            <a href="#" className="text-sm text-text/60 hover:text-text transition-colors">取消报名</a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 最新作品 */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden card-lift">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-display text-text flex items-center">
                    <i className="fa fa-book text-gold mr-2"></i> 我的最新作品
                  </h3>
                  <Link href="/profile/works" className="text-sm text-gold hover:text-goldDark transition-colors">查看全部</Link>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {recentWorks.map((work, index) => (
                      <div key={work.id} className={`border-l-4 ${index === 0 ? 'border-gold' : 'border-wheat'} pl-4 py-1`}>
                        <h4 className="font-medium text-lg">{work.title}</h4>
                        <p className="text-sm text-text/60 mt-1">发布于 {work.date} · {work.type}</p>
                        <p className="text-text/80 mt-3 line-clamp-2 whitespace-pre-line">
                          {work.content}
                        </p>
                        <div className="mt-3 flex items-center text-sm text-text/60">
                          <span className="mr-4"><i className="fa fa-eye mr-1"></i> {work.views}</span>
                          <span className="mr-4"><i className="fa fa-heart mr-1"></i> {work.likes}</span>
                          <span><i className="fa fa-comment mr-1"></i> {work.comments}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 近期活动 */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden card-lift">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-display text-text flex items-center">
                    <i className="fa fa-map-marker text-gold mr-2"></i> 我的近期活动
                  </h3>
                  <Link href="/profile/activities" className="text-sm text-gold hover:text-goldDark transition-colors">查看全部</Link>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-40 h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-text/60 mt-1">
                            <i className="fa fa-calendar mr-1"></i> {activity.date} {activity.time}
                            <span className="mx-2">|</span>
                            <i className="fa fa-map-marker mr-1"></i> {activity.location}
                          </p>
                          <p className="text-sm text-text/80 mt-2 line-clamp-2">
                            {activity.status === 'upcoming' 
                              ? '走进秋日的田野，观察农作物的成熟，体验收割的乐趣，在自然中寻找创作灵感。'
                              : '与社员们分享近期的诗歌创作，互相点评，共同进步，特邀本地诗人王老师莅临指导。'
                            }
                          </p>
                          <div className="mt-3 flex items-center">
                            <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                              activity.status === 'upcoming' 
                                ? 'bg-gold/10 text-gold' 
                                : 'bg-green-100 text-green-600'
                            }`}>
                              {activity.status === 'upcoming' ? '已报名' : '已参与'}
                            </span>
                            <a href="#" className="ml-3 text-sm text-gold hover:text-goldDark transition-colors">
                              {activity.status === 'upcoming' ? '详情' : '回顾'}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}