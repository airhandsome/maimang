"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function MyWorksPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workToDelete, setWorkToDelete] = useState<any>(null);

  const works = [
    {
      id: 1,
      title: "《秋日麦浪》",
      type: "诗歌",
      status: "published",
      date: "2023-10-05",
      views: 128,
      likes: 36,
      comments: 5,
      content: "风吹过田野的轮廓\n麦穗低垂，如时光的重量\n每一粒果实里，都藏着\n整个夏天的阳光",
      review: {
        reviewer: "陈晓棠",
        reviewerTitle: "创作指导",
        date: "2023-10-06",
        content: "意象鲜明，语言凝练，将秋日麦田的静态与动态完美结合。最后一句\"整个夏天的阳光\"很有张力，赋予了麦穗更深层的时间维度。建议可以尝试增加一些听觉元素，让画面更立体。",
        avatar: "https://picsum.photos/id/26/100/100"
      }
    },
    {
      id: 2,
      title: "《与稻草人对话》",
      type: "散文",
      status: "published",
      date: "2023-09-20",
      views: 95,
      likes: 24,
      comments: 3,
      content: "田野中央的稻草人，戴着褪色的草帽，沉默地站了整个夏天。我坐在它脚下，听风穿过麦芒的声音，像一首古老的歌谣。它见过清晨的露水，见过正午的烈日，见过黄昏的晚霞，也见过深夜的星光..."
    },
    {
      id: 3,
      title: "《冬雪将至》",
      type: "诗歌",
      status: "pending",
      date: "2023-10-18",
      content: "风的味道变了\n带着些许寒意\n麻雀的歌声也变得\n短促而焦急\n麦田在等待一场雪\n一场温柔的覆盖"
    },
    {
      id: 4,
      title: "《田野里的星空》",
      type: "诗歌",
      status: "draft",
      date: "2023-10-15",
      content: "夜幕低垂，田野安静下来\n只有虫鸣和远处的蛙声\n抬头是密密麻麻的星子\n像撒在黑丝绒上的碎钻\n每一颗都在低语\n关于土地与时光的秘密"
    },
    {
      id: 5,
      title: "《城市边缘》",
      type: "诗歌",
      status: "rejected",
      date: "2023-10-01",
      content: "高楼吞噬了最后的绿地\n钢筋水泥的森林里\n人们行色匆匆\n忘记了泥土的芬芳\n只有风偶尔带来\n远方麦田的消息",
      rejectionReason: "作品主题与文学社\"田野文学\"定位偏差较大，建议增加自然元素或调整创作角度。若有修改意向，可参考《秋日麦浪》的创作思路，将城市与田野形成对比而非割裂。"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">已发布</span>;
      case "pending":
        return <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">审核中</span>;
      case "draft":
        return <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">草稿</span>;
      case "rejected":
        return <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">已驳回</span>;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "发布于";
      case "pending":
        return "提交于";
      case "draft":
        return "保存于";
      case "rejected":
        return "驳回于";
      default:
        return "";
    }
  };

  const getStatusInfo = (work: any) => {
    switch (work.status) {
      case "pending":
        return <span className="text-blue-500 text-sm"><i className="fa fa-info-circle mr-1"></i> 审核周期约3个工作日</span>;
      case "draft":
        return <span className="text-amber-500 text-sm"><i className="fa fa-clock-o mr-1"></i> 上次编辑：2天前</span>;
      case "rejected":
        return <span className="text-red-500 text-sm"><i className="fa fa-exclamation-circle mr-1"></i> 可修改后重新提交</span>;
      default:
        return null;
    }
  };

  const handleDeleteWork = (work: any) => {
    setWorkToDelete(work);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (workToDelete) {
      // 这里应该调用 API 删除作品
      alert('作品已删除');
    }
    setShowDeleteModal(false);
    setWorkToDelete(null);
  };

  const filteredWorks = works.filter(work => {
    if (statusFilter !== "all" && work.status !== statusFilter) return false;
    if (typeFilter !== "all" && work.type !== typeFilter) return false;
    return true;
  });

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
              <h1 className="text-2xl md:text-3xl font-display text-text">我的作品</h1>
            </div>
            <Link href="/submit-work" className="inline-flex items-center bg-gold hover:bg-goldDark text-white font-bold px-6 py-3 rounded-full transition-all transform hover:scale-105 mt-4 md:mt-0">
              <i className="fa fa-plus mr-2"></i> 发布新作品
            </Link>
          </div>
          
          {/* 作品筛选 */}
          <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-8">
            <div className="flex flex-wrap gap-3 md:gap-6">
              <div className="flex items-center">
                <span className="text-text/70 mr-3">状态：</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-wheat rounded-lg focus:border-gold focus:outline-none"
                >
                  <option value="all">全部作品</option>
                  <option value="published">已发布</option>
                  <option value="pending">审核中</option>
                  <option value="draft">草稿</option>
                  <option value="rejected">已驳回</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <span className="text-text/70 mr-3">类型：</span>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-wheat rounded-lg focus:border-gold focus:outline-none"
                >
                  <option value="all">全部类型</option>
                  <option value="诗歌">诗歌</option>
                  <option value="散文">散文</option>
                  <option value="小说">小说</option>
                  <option value="摄影配文">摄影配文</option>
                </select>
              </div>
              
              <div className="flex items-center ml-auto">
                <span className="text-text/70 mr-3">排序：</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-wheat rounded-lg focus:border-gold focus:outline-none"
                >
                  <option value="latest">最新发布</option>
                  <option value="popular">热门程度</option>
                  <option value="earliest">最早发布</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 作品列表 */}
          <div className="space-y-6">
            {filteredWorks.map((work) => (
              <div key={work.id} className="bg-white rounded-2xl shadow-md overflow-hidden card-lift">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center mb-3">
                        <h2 className="text-xl font-medium mr-3">{work.title}</h2>
                        {getStatusBadge(work.status)}
                      </div>
                      
                      <p className="text-text/80 mb-4 line-clamp-2 whitespace-pre-line">
                        {work.content}
                      </p>
                      
                      <div className="flex flex-wrap items-center text-sm text-text/60 gap-y-2">
                        <span className="mr-4">
                          <i className="fa fa-calendar mr-1"></i> {getStatusText(work.status)} {work.date}
                        </span>
                        <span className="mr-4">
                          <i className="fa fa-folder-o mr-1"></i> {work.type}
                        </span>
                        {work.views && (
                          <span className="mr-4">
                            <i className="fa fa-eye mr-1"></i> {work.views} 阅读
                          </span>
                        )}
                        {work.likes && (
                          <span className="mr-4">
                            <i className="fa fa-heart mr-1"></i> {work.likes} 点赞
                          </span>
                        )}
                        {work.comments && (
                          <span className="mr-4">
                            <i className="fa fa-comment mr-1"></i> {work.comments} 评论
                          </span>
                        )}
                        {getStatusInfo(work)}
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                      {work.status === "published" && (
                        <a href="#" className="text-gold hover:text-goldDark text-sm transition-colors">
                          <i className="fa fa-eye mr-1"></i> 查看
                        </a>
                      )}
                      <a href="#" className="text-text hover:text-gold text-sm transition-colors">
                        <i className="fa fa-pencil mr-1"></i> {work.status === "draft" ? "继续编辑" : work.status === "rejected" ? "修改重投" : "编辑"}
                      </a>
                      <button 
                        onClick={() => handleDeleteWork(work)}
                        className="text-text hover:text-red-500 text-sm transition-colors"
                      >
                        <i className="fa fa-trash-o mr-1"></i> 删除
                      </button>
                    </div>
                  </div>
                  
                  {/* 导师点评 */}
                  {work.review && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                          <img src={work.review.avatar} alt={work.review.reviewer} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{work.review.reviewer} <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded ml-2">{work.review.reviewerTitle}</span></h4>
                            <span className="text-xs text-text/60 ml-3">{work.review.date}</span>
                          </div>
                          <p className="text-text/80 mt-2 text-sm">
                            {work.review.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 驳回原因 */}
                  {work.status === "rejected" && work.rejectionReason && (
                    <div className="mt-6 pt-6 border-t border-gray-100 bg-red-50 rounded-xl p-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <i className="fa fa-info text-red-500 text-sm"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-500 text-sm">驳回原因</h4>
                          <p className="text-text/80 mt-1 text-sm">
                            {work.rejectionReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
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
              <button className="pagination-item">5</button>
              <button className="pagination-item">
                <i className="fa fa-angle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* 删除作品确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <i className="fa fa-trash-o text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-medium text-text">确认删除作品</h3>
              <p className="text-text/70 mt-2">删除后作品将无法恢复，是否继续？</p>
            </div>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 border border-wheat text-text rounded-lg hover:bg-wheat transition-colors"
              >
                取消
              </button>
              <button 
                onClick={confirmDelete}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}