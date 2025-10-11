"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGetProfile, apiUpdateProfile, apiUploadAvatar, UserProfile } from "@/lib/auth";

export default function EditProfilePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    email: "",
    bio: "",
    tags: [] as string[],
    weibo: "",
    wechat: ""
  });

  const [customTag, setCustomTag] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const availableTags = [
    "诗歌", "自然", "田野", "季节", "散文", "小说", "现代诗", 
    "古体诗", "摄影配文", "旅行文学", "儿童文学"
  ];

  // 加载用户数据
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError("");
        
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }
        
        const profile = await apiGetProfile(token);
        
        setFormData({
          name: profile.name || "",
          gender: profile.gender || "",
          phone: profile.phone || "",
          email: profile.email || "",
          bio: profile.bio || "",
          tags: profile.tags || [],
          weibo: profile.weibo || "",
          wechat: profile.wechat || ""
        });
        
        // 设置头像，如果API返回的头像存在且不是默认值，则使用API返回的，否则使用默认头像
        if (profile.avatar && profile.avatar !== "" && !profile.avatar.includes("picsum.photos")) {
          // 如果是相对路径，需要添加API基础URL
          if (profile.avatar.startsWith("/")) {
            setAvatar(`http://localhost:8080${profile.avatar}`);
          } else {
            setAvatar(profile.avatar);
          }
        } else {
          setAvatar("https://picsum.photos/id/64/200/200");
        }
        
      } catch (err: any) {
        setError(err.message || '加载用户资料失败');
        console.error('Load profile error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, [router]);

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
        : prev.tags.length >= 5 
          ? prev.tags // 如果已达到上限，不添加新标签
          : [...prev.tags, tag]
    }));
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && customTag.length <= 6 && !formData.tags.includes(customTag) && formData.tags.length < 5) {
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
      
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        setError('请选择图片文件');
        return;
      }
      
      // 验证文件大小 (限制为2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('图片大小不能超过2MB');
        return;
      }
      
      // 保存文件用于后续上传
      setAvatarFile(file);
      setError("");
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError("");
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      let avatarUrl = avatar;
      
      // 如果有新头像文件，先上传
      if (avatarFile) {
        try {
          setUploadingAvatar(true);
          const result = await apiUploadAvatar(token, avatarFile);
          avatarUrl = result.url;
          console.log('Avatar uploaded successfully:', avatarUrl);
        } catch (err: any) {
          setError(err.message || '头像上传失败');
          console.error('Avatar upload error:', err);
          return;
        } finally {
          setUploadingAvatar(false);
        }
      }
      
      // 准备要更新的数据
      const updateData = {
        name: formData.name,
        gender: formData.gender,
        phone: formData.phone,
        bio: formData.bio,
        avatar: avatarUrl,
        tags: formData.tags,
        weibo: formData.weibo,
        wechat: formData.wechat
      };
      
      console.log('Updating profile with data:', updateData);
      await apiUpdateProfile(token, updateData);
      
      // 更新成功，跳转到个人中心
      router.push('/profile');
      
    } catch (err: any) {
      setError(err.message || '保存失败，请重试');
      console.error('Update profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    // 这里应该调用 API 删除账号
    alert('账号注销申请已提交，将在3个工作日内处理');
    setShowDeleteModal(false);
    router.push('/login');
  };

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow relative z-10 container mx-auto px-4 py-12 bg-cream wheat-pattern">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
              <p className="text-text/70">加载用户资料中...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
          
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <i className="fa fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            </div>
          )}
          
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
                      <i className="fa fa-upload mr-1"></i> 选择头像
                    </label>
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      accept="image/*" 
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <p className="text-sm text-text/60 mt-2">支持JPG、PNG格式，建议尺寸200x200px，文件大小不超过2MB</p>
                    {avatarFile && (
                      <p className="text-sm text-green-600 mt-1">
                        <i className="fa fa-check mr-1"></i> 已选择新头像，点击保存更改时会上传
                      </p>
                    )}
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
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="请输入手机号" 
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-wheat input-focus"
                      />
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
                <label className="block text-text font-medium mb-4">
                  创作标签 <span className="text-sm text-text/60">(选择你擅长或感兴趣的领域)</span>
                  <span className="text-sm text-text/60 ml-2">({formData.tags.length}/5)</span>
                </label>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {availableTags.map((tag) => (
                    <span 
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`tag-item ${formData.tags.includes(tag) ? 'active' : ''} ${!formData.tags.includes(tag) && formData.tags.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* 已选择的标签 */}
                {formData.tags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-text/70 mb-2">已选择的标签：</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="inline-flex items-center gap-1 bg-gold/10 text-gold px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="ml-1 hover:text-red-500 transition-colors"
                          >
                            <i className="fa fa-times text-xs"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="custom-tag" className="block text-text font-medium mb-2">
                    添加自定义标签
                    {formData.tags.length >= 5 && (
                      <span className="text-sm text-red-500 ml-2">(已达到上限)</span>
                    )}
                  </label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      id="custom-tag" 
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder={formData.tags.length >= 5 ? "已达到标签上限" : "输入标签后按回车添加"} 
                      disabled={formData.tags.length >= 5}
                      className={`flex-grow px-4 py-3 rounded-lg border border-wheat input-focus ${formData.tags.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      disabled={formData.tags.length >= 5}
                      className={`px-4 py-3 rounded-lg transition-colors ${formData.tags.length >= 5 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-wheat hover:bg-gold/20 text-text'}`}
                    >
                      添加
                    </button>
                  </div>
                  {formData.tags.length >= 5 && (
                    <p className="text-sm text-red-500 mt-2">最多只能选择5个标签</p>
                  )}
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
                  disabled={saving}
                  className="px-6 py-3 border border-wheat text-text rounded-lg hover:bg-wheat transition-colors disabled:opacity-50"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-6 py-3 bg-gold hover:bg-goldDark text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      保存中...
                    </>
                  ) : (
                    '保存修改'
                  )}
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