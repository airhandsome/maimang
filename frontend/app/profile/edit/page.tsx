"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "林清禾",
    gender: "female",
    phone: "138****8877",
    email: "qinghe@example.com",
    bio: "热爱诗歌与自然的创作者，喜欢在田野中寻找灵感，相信文字能捕捉生活中最细微的美好。",
    tags: ["诗歌", "自然", "田野", "季节", "散文"],
    weibo: "@林清禾的诗",
    wechat: ""
  });

  const [customTag, setCustomTag] = useState("");
  const [avatar, setAvatar] = useState("https://picsum.photos/id/64/200/200");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const availableTags = [
    "诗歌", "自然", "田野", "季节", "散文", "小说", "现代诗", 
    "古体诗", "摄影配文", "旅行文学", "儿童文学"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && customTag.length <= 6 && !formData.tags.includes(customTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag.trim()]
      }));
      setCustomTag("");
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里应该调用 API 保存数据
    alert('个人资料修改成功！');
    router.push('/profile');
  };

  const handleDeleteAccount = () => {
    // 这里应该调用 API 删除账号
    alert('账号注销申请已提交，将在3个工作日内处理');
    setShowDeleteModal(false);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 主内容区 */}
      <main className="flex-grow relative z-10 container mx-auto px-4 py-12 bg-cream wheat-pattern">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/profile" className="text-text/70 hover:text-text transition-colors mr-4">
              <i className="fa fa-angle-left"></i> 返回个人中心
            </Link>
            <h1 className="text-2xl md:text-3xl font-display text-text">编辑个人资料</h1>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 card-lift">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 头像上传 */}
              <div>
                <h2 className="text-lg font-medium text-text mb-4">头像设置</h2>
                <div className="flex items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-wheat mr-6">
                    <img src={avatar} alt="当前头像" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <label htmlFor="avatar-upload" className="bg-gold hover:bg-goldDark text-white font-medium px-4 py-2 rounded-lg transition-colors mr-3 cursor-pointer">
                      <i className="fa fa-upload mr-1"></i> 上传新头像
                    </label>
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      accept="image/*" 
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <p className="text-sm text-text/60 mt-2">支持JPG、PNG格式，建议尺寸200x200px</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-6"></div>
              
              {/* 基本信息 */}
              <div>
                <h2 className="text-lg font-medium text-text mb-6">基本信息</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nickname" className="block text-text font-medium mb-2">昵称 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="nickname" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="请输入你的昵称" 
                      className="w-full px-4 py-3 rounded-lg border border-wheat input-focus"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-text font-medium mb-2">性别</label>
                    <select 
                      id="gender" 
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-wheat input-focus"
                    >
                      <option value="">请选择</option>
                      <option value="male">男</option>
                      <option value="female">女</option>
                      <option value="secret">保密</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-text font-medium mb-2">手机号</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50">
                        <i className="fa fa-phone"></i>
                      </span>
                      <input 
                        type="tel" 
                        id="phone" 
                        value={formData.phone}
                        disabled 
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-text/60"
                      />
                      <a href="#" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold text-sm hover:underline">修改</a>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-text font-medium mb-2">邮箱</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50">
                        <i className="fa fa-envelope-o"></i>
                      </span>
                      <input 
                        type="email" 
                        id="email" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="请输入你的邮箱" 
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-wheat input-focus"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-6"></div>
              
              {/* 个人简介 */}
              <div>
                <label htmlFor="bio" className="block text-text font-medium mb-2">个人简介</label>
                <textarea 
                  id="bio" 
                  rows={4} 
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="请简单介绍一下自己..." 
                  className="w-full px-4 py-3 rounded-lg border border-wheat input-focus"
                />
                <p className="text-right text-sm text-text/60 mt-2">
                  <span className={formData.bio.length > 300 ? 'text-red-500' : ''}>{formData.bio.length}</span>/300 字
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-6"></div>
              
              {/* 创作标签 */}
              <div>
                <label className="block text-text font-medium mb-4">创作标签 <span className="text-sm text-text/60">(选择你擅长或感兴趣的领域)</span></label>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {availableTags.map((tag) => (
                    <span 
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`tag-item ${formData.tags.includes(tag) ? 'active' : ''}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div>
                  <label htmlFor="custom-tag" className="block text-text font-medium mb-2">添加自定义标签</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      id="custom-tag" 
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="输入标签后按回车添加" 
                      className="flex-grow px-4 py-3 rounded-lg border border-wheat input-focus"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTag();
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={handleAddCustomTag}
                      className="bg-wheat hover:bg-gold/20 text-text px-4 py-3 rounded-lg transition-colors"
                    >
                      添加
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-6"></div>
              
              {/* 社交媒体 */}
              <div>
                <h2 className="text-lg font-medium text-text mb-4">社交媒体</h2>
                <p className="text-sm text-text/60 mb-4">绑定你的社交媒体账号，方便作品分享</p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="weibo" className="block text-text font-medium mb-2">新浪微博</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50">
                        <i className="fa fa-weibo"></i>
                      </span>
                      <input 
                        type="text" 
                        id="weibo" 
                        value={formData.weibo}
                        onChange={(e) => handleInputChange('weibo', e.target.value)}
                        placeholder="请输入你的微博账号" 
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-wheat input-focus"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="wechat" className="block text-text font-medium mb-2">微信公众号</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50">
                        <i className="fa fa-weixin"></i>
                      </span>
                      <input 
                        type="text" 
                        id="wechat" 
                        value={formData.wechat}
                        onChange={(e) => handleInputChange('wechat', e.target.value)}
                        placeholder="请输入你的微信公众号" 
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-wheat input-focus"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 提交按钮 */}
              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => router.push('/profile')}
                  className="px-6 py-3 border border-wheat text-text rounded-lg hover:bg-wheat transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-gold hover:bg-goldDark text-white rounded-lg transition-colors"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
          
          {/* 账号安全 */}
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mt-8 card-lift">
            <h2 className="text-lg font-medium text-text mb-6">账号安全</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                <div>
                  <h3 className="font-medium">修改密码</h3>
                  <p className="text-sm text-text/60 mt-1">建议定期更换密码，保障账号安全</p>
                </div>
                <a href="#" className="text-gold hover:text-goldDark transition-colors">
                  立即修改 <i className="fa fa-angle-right ml-1"></i>
                </a>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">账号注销</h3>
                  <p className="text-sm text-text/60 mt-1">注销后将删除所有个人数据，且无法恢复</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowDeleteModal(true)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  账号注销 <i className="fa fa-angle-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* 账号注销确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <i className="fa fa-exclamation-triangle text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-medium text-text">确认账号注销</h3>
              <p className="text-text/70 mt-2">注销后所有数据将永久删除，无法恢复</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="delete-reason" className="block text-text font-medium mb-2">注销原因</label>
              <select id="delete-reason" className="w-full px-4 py-3 rounded-lg border border-wheat input-focus">
                <option value="">请选择注销原因</option>
                <option value="time">没有时间参与</option>
                <option value="content">内容不符合预期</option>
                <option value="experience">使用体验不好</option>
                <option value="other">其他原因</option>
              </select>
            </div>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 border border-wheat text-text rounded-lg hover:bg-wheat transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                确认注销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}