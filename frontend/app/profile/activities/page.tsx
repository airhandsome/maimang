"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function MyActivitiesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [activityToCancel, setActivityToCancel] = useState<any>(null);

  const tabs = [
    { id: "all", label: "全部活动" },
    { id: "upcoming", label: "即将参加" },
    { id: "history", label: "历史活动" },
    { id: "canceled", label: "已取消" },
    { id: "favorites", label: "收藏活动" }
  ];

  const upcomingActivities = [
    {
      id: 1,
      title: "秋日田野采风",
      date: "2023-10-22",
      time: "09:00-16:00",
      location: "青禾农场（近郊麦田基地）",
      instructor: "陈晓棠（省作协会员，田园文学作家）",
      description: "走进秋日的田野，观察农作物的成熟，体验收割的乐趣，在自然中寻找创作灵感。活动包含田间采风、小组创作、作品分享三个环节。",
      image: "https://picsum.photos/id/183/600/400",
      daysLeft: 3,
      participants: 24,
      status: "upcoming"
    },
    {
      id: 2,
      title: "诗歌创作工作坊",
      date: "2023-10-28",
      time: "14:00-17:30",
      location: "麦田书屋（青春路88号）",
      instructor: "林晚秋（青年诗人，出版诗集《麦浪有声》）",
      description: "专注于自然主题诗歌创作的工作坊，从意象捕捉、语言锤炼到情感表达，导师将带领大家完成一首完整的田野主题诗歌，并进行小组点评。",
      image: "https://picsum.photos/id/24/600/400",
      daysLeft: 9,
      participants: 18,
      status: "upcoming"
    }
  ];

  const historyActivities = [
    {
      id: 3,
      title: "诗歌创作分享会",
      date: "2023-10-15",
      time: "14:30-17:00",
      location: "麦田书屋（青春路88号）",
      instructor: "王老师（本地诗人）",
      description: "与社员们分享近期的诗歌创作，互相点评，共同进步。活动中大家围绕\"秋日\"主题进行了创作交流，特邀本地诗人王老师进行了现场指导。",
      image: "https://picsum.photos/id/175/600/400",
      status: "completed",
      achievement: "你的作品《秋日麦浪》获得\"最佳意象奖\"",
      points: 10
    },
    {
      id: 4,
      title: "田野摄影与配文",
      date: "2023-09-30",
      time: "09:00-12:00",
      location: "城郊湿地公园",
      instructor: "张摄影师",
      description: "结合摄影技巧与文字表达的创作活动，学习如何用镜头捕捉自然之美，并用精炼的文字为照片配文，形成完整的视觉+文字作品。",
      image: "https://picsum.photos/id/119/600/400",
      status: "missed",
      reason: "已报名但未出席，未获得活动积分"
    }
  ];

  const handleCancelActivity = (activity: any) => {
    setActivityToCancel(activity);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (activityToCancel) {
      // 这里应该调用 API 取消活动
      alert('已取消活动报名');
    }
    setShowCancelModal(false);
    setActivityToCancel(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">即将开始</span>;
      case "completed":
        return <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">已参与</span>;
      case "missed":
        return <span className="inline-block bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded-full">未参与</span>;
      default:
        return null;
    }
  };

  const renderActivities = () => {
    if (activeTab === "upcoming" || activeTab === "all") {
      return upcomingActivities.map((activity) => (
        <div key={activity.id} className="bg-white rounded-2xl shadow-md overflow-hidden card-lift">
          <div className="md:flex">
            <div className="md:w-1/3 h-48 md:h-auto relative">
              <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                {getStatusBadge(activity.status)}
              </div>
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-medium">{activity.title}</h3>
                <button 
                  onClick={() => handleCancelActivity(activity)}
                  className="text-text/50 hover:text-red-500 transition-colors"
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start">
                  <i className="fa fa-calendar text-gold mt-1 mr-3 w-4 text-center"></i>
                  <div>
                    <p className="text-sm text-text/60">活动时间</p>
                    <p>{activity.date}（{activity.date.includes('10-22') ? '周日' : '周六'}）{activity.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fa fa-map-marker text-gold mt-1 mr-3 w-4 text-center"></i>
                  <div>
                    <p className="text-sm text-text/60">活动地点</p>
                    <p>{activity.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fa fa-user text-gold mt-1 mr-3 w-4 text-center"></i>
                  <div>
                    <p className="text-sm text-text/60">带队导师</p>
                    <p>{activity.instructor}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-text/80 text-sm mb-5 line-clamp-2">
                {activity.description}
              </p>
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <span className="inline-block bg-gold/10 text-gold text-xs px-3 py-1 rounded-full mr-3">
                    <i className="fa fa-clock-o mr-1"></i> 还有{activity.daysLeft}天
                  </span>
                  <span className="text-sm text-text/60">
                    <i className="fa fa-users mr-1"></i> 已报名：{activity.participants}人
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-wheat hover:bg-gold/20 text-text rounded-lg transition-colors text-sm">
                    <i className="fa fa-download mr-1"></i> 下载行程
                  </button>
                  <a href="#" className="px-4 py-2 bg-gold hover:bg-goldDark text-white rounded-lg transition-colors text-sm">
                    查看详情
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ));
    }

    if (activeTab === "history" || activeTab === "all") {
      return historyActivities.map((activity) => (
        <div key={activity.id} className="bg-white rounded-2xl shadow-md overflow-hidden card-lift">
          <div className="md:flex">
            <div className="md:w-1/3 h-48 md:h-auto relative">
              <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                {getStatusBadge(activity.status)}
              </div>
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-medium">{activity.title}</h3>
                <button className="text-text/50 hover:text-gold transition-colors">
                  <i className="fa fa-star-o"></i>
                </button>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start">
                  <i className="fa fa-calendar text-gold mt-1 mr-3 w-4 text-center"></i>
                  <div>
                    <p className="text-sm text-text/60">活动时间</p>
                    <p>{activity.date}（{activity.date.includes('10-15') ? '周日' : '周六'}）{activity.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fa fa-map-marker text-gold mt-1 mr-3 w-4 text-center"></i>
                  <div>
                    <p className="text-sm text-text/60">活动地点</p>
                    <p>{activity.location}</p>
                  </div>
                </div>
                
                {activity.status === "completed" && (
                  <div className="flex items-start">
                    <i className="fa fa-trophy text-gold mt-1 mr-3 w-4 text-center"></i>
                    <div>
                      <p className="text-sm text-text/60">活动成果</p>
                      <p>{activity.achievement}</p>
                    </div>
                  </div>
                )}
                
                {activity.status === "missed" && (
                  <div className="flex items-start">
                    <i className="fa fa-exclamation-circle text-amber-500 mt-1 mr-3 w-4 text-center"></i>
                    <div>
                      <p className="text-sm text-text/60">状态说明</p>
                      <p>{activity.reason}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-text/80 text-sm mb-5 line-clamp-2">
                {activity.description}
              </p>
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  {activity.status === "completed" ? (
                    <>
                      <span className="inline-block bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full mr-3">
                        <i className="fa fa-check mr-1"></i> 已完成
                      </span>
                      <span className="text-sm text-text/60">
                        <i className="fa fa-user-plus mr-1"></i> 获得{activity.points}积分
                      </span>
                    </>
                  ) : (
                    <span className="inline-block bg-amber-100 text-amber-600 text-xs px-3 py-1 rounded-full">
                      <i className="fa fa-clock-o mr-1"></i> 已结束
                    </span>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {activity.status === "completed" && (
                    <a href="#" className="px-4 py-2 bg-wheat hover:bg-gold/20 text-text rounded-lg transition-colors text-sm">
                      <i className="fa fa-book mr-1"></i> 我的作品
                    </a>
                  )}
                  <a href="#" className="px-4 py-2 bg-gold hover:bg-goldDark text-white rounded-lg transition-colors text-sm">
                    活动回顾
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ));
    }

    return <div className="text-center py-12 text-text/60">暂无相关活动</div>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 主内容区 */}
      <main className="flex-grow relative z-10 container mx-auto px-4 py-12 bg-cream wheat-pattern">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <Link href="/profile" className="text-text/70 hover:text-text transition-colors mb-2 inline-block">
                <i className="fa fa-angle-left"></i> 返回个人中心
              </Link>
              <h1 className="text-2xl md:text-3xl font-display text-text">我的活动</h1>
            </div>
            <Link href="/activities" className="inline-flex items-center bg-gold hover:bg-goldDark text-white font-bold px-6 py-3 rounded-full transition-all transform hover:scale-105 mt-4 md:mt-0">
              <i className="fa fa-plus mr-2"></i> 浏览更多活动
            </Link>
          </div>
          
          {/* 活动分类标签 */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`activity-tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* 即将参加的活动 */}
          {(activeTab === "upcoming" || activeTab === "all") && (
            <div className="mb-12">
              <h2 className="text-xl font-display text-text mb-6 flex items-center">
                <i className="fa fa-calendar-check-o text-gold mr-2"></i> 即将参加
              </h2>
              
              <div className="space-y-6">
                {renderActivities()}
              </div>
            </div>
          )}
          
          {/* 历史活动 */}
          {(activeTab === "history" || activeTab === "all") && (
            <div>
              <h2 className="text-xl font-display text-text mb-6 flex items-center">
                <i className="fa fa-history text-gold mr-2"></i> 历史活动
              </h2>
              
              <div className="space-y-6">
                {renderActivities()}
              </div>
            </div>
          )}
          
          {/* 分页控件 */}
          <div className="mt-10 flex justify-center">
            <div className="flex items-center gap-2">
              <button className="pagination-item" disabled>
                <i className="fa fa-angle-left"></i>
              </button>
              <button className="pagination-item active">1</button>
              <button className="pagination-item">2</button>
              <button className="pagination-item">3</button>
              <span className="text-text/50">...</span>
              <button className="pagination-item">4</button>
              <button className="pagination-item">
                <i className="fa fa-angle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* 取消活动确认弹窗 */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <i className="fa fa-exclamation-triangle text-amber-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-medium text-text">确认取消报名</h3>
              <p className="text-text/70 mt-2">取消后将无法参与本次活动，且可能影响后续活动报名优先级</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="cancel-reason" className="block text-text font-medium mb-2">取消原因（选填）</label>
              <select id="cancel-reason" className="w-full px-4 py-3 rounded-lg border border-wheat focus:border-gold focus:outline-none">
                <option value="">请选择原因（选填）</option>
                <option value="time">时间冲突</option>
                <option value="health">身体不适</option>
                <option value="location">地点不便</option>
                <option value="other">其他原因</option>
              </select>
            </div>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-3 border border-wheat text-text rounded-lg hover:bg-wheat transition-colors"
              >
                不取消
              </button>
              <button 
                onClick={confirmCancel}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                确认取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}