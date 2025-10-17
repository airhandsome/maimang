'use client';

import { useEffect, useState, useRef } from 'react';
import { http } from '@/lib/http';
import { apiUploadAvatar } from '@/lib/auth';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  siteDomain: string;
  siteLogo: string;
  adminEmail: string;
  contactPhone: string;
  contactWechat: string;
  contactWeibo: string;
  contactQq: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  autoApproveWorks: boolean;
  requireEmailVerification: boolean;
  enableComments: boolean;
  enableUserRegistration: boolean;
  maintenanceMode: boolean;
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "麦芒文学社",
    siteDescription: "一个专注于文学创作和交流的社区平台",
    siteDomain: "www.maimang.com",
    siteLogo: "",
    adminEmail: "admin@maimang.com",
    contactPhone: "400-123-4567",
    contactWechat: "maimang_wx",
    contactWeibo: "@麦芒文学社",
    contactQq: "123456789",
    maxFileSize: 10,
    allowedFileTypes: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "txt"],
    autoApproveWorks: false,
    requireEmailVerification: true,
    enableComments: true,
    enableUserRegistration: true,
    maintenanceMode: false
  });

  const [activeTab, setActiveTab] = useState<string>('general');
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // 轮播图相关状态
  const [carousels, setCarousels] = useState<any[]>([]);
  const [carouselLoading, setCarouselLoading] = useState<boolean>(false);
  const [showAddCarousel, setShowAddCarousel] = useState<boolean>(false);
  const [newCarousel, setNewCarousel] = useState<{ title: string; link_url: string; image_url: string; description: string; order: number }>(
    { title: '', link_url: '', image_url: '', description: '', order: 1 }
  );
  const addCarouselFileRef = useRef<HTMLInputElement | null>(null);
  const [editCarousel, setEditCarousel] = useState<any | null>(null);
  const editCarouselFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await http.getSystemSettings();
        if (res.success && res.data) {
          const data = res.data as Record<string, any>;
          setSettings(prev => ({
            ...prev,
            siteName: data.siteName ?? prev.siteName,
            siteDescription: data.siteDescription ?? prev.siteDescription,
            siteDomain: data.siteDomain ?? prev.siteDomain,
            siteLogo: data.siteLogo ?? prev.siteLogo,
            adminEmail: data.adminEmail ?? prev.adminEmail,
            contactPhone: data.contactPhone ?? prev.contactPhone,
            contactWechat: data.contactWechat ?? prev.contactWechat,
            contactWeibo: data.contactWeibo ?? prev.contactWeibo,
            contactQq: data.contactQq ?? prev.contactQq,
            maxFileSize: Number(data.maxFileSize ?? prev.maxFileSize),
            allowedFileTypes: Array.isArray(data.allowedFileTypes) ? data.allowedFileTypes : (typeof data.allowedFileTypes === 'string' ? data.allowedFileTypes.split(',').map((s: string)=>s.trim()).filter(Boolean) : prev.allowedFileTypes),
            autoApproveWorks: Boolean(data.autoApproveWorks ?? prev.autoApproveWorks),
            requireEmailVerification: Boolean(data.requireEmailVerification ?? prev.requireEmailVerification),
            enableComments: Boolean(data.enableComments ?? prev.enableComments),
            enableUserRegistration: Boolean(data.enableUserRegistration ?? prev.enableUserRegistration),
            maintenanceMode: Boolean(data.maintenanceMode ?? prev.maintenanceMode),
          }));
        }
      } catch (e: any) {
        setError(e?.message || '加载设置失败');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 加载轮播图列表
  const fetchCarousels = async () => {
    try {
      setCarouselLoading(true);
      const res = await http.get('/admin/carousels');
      // 兼容 {success,data} 或直接数组
      const list = (res as any)?.data ?? res ?? [];
      setCarousels(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('加载轮播图失败', e);
    } finally {
      setCarouselLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'carousel') {
      fetchCarousels();
    }
  }, [activeTab]);

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const payload: Record<string, any> = { ...settings, allowedFileTypes: settings.allowedFileTypes };
      const res = await http.updateSystemSettings(payload);
      if (!res.success) throw new Error(res.error || '保存失败');
    } catch (e: any) {
      setError(e?.message || '保存失败');
      return;
    } finally {
      setSaving(false);
    }
    alert('设置已保存！');
  };

  const handleUploadLogoClick = () => {
    fileInputRef.current?.click();
  };

  const backendOrigin = (() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1';
    return apiBase.replace(/\/api\/v1$/, '');
  })();

  const handleUploadLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const files = inputEl.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '';
      const res = await apiUploadAvatar(token, file);
      const absoluteUrl = res.url.startsWith('http') ? res.url : `${backendOrigin}${res.url}`;
      setSettings(prev => ({ ...prev, siteLogo: absoluteUrl }));
    } catch (err) {
      setError('LOGO 上传失败');
    } finally {
      inputEl.value = '';
    }
  };

  // 上传轮播图图片到上传目录（素材上传接口）
  const handleAddCarouselUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const files = inputEl.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const form = new FormData();
      form.append('type', 'image');
      form.append('file', file);
      const resp = await http.uploadMaterial(form);
      const url = (resp as any)?.data?.url || (resp as any)?.url;
      if (!url) throw new Error('上传返回缺少url');
      const absoluteUrl = url.startsWith('http') ? url : `${backendOrigin}${url}`;
      setNewCarousel(prev => ({ ...prev, image_url: absoluteUrl }));
    } catch (err: any) {
      setError(err?.message || '轮播图图片上传失败');
    } finally {
      inputEl.value = '';
    }
  };

  const handleCreateCarousel = async () => {
    if (!newCarousel.title || !newCarousel.image_url) {
      setError('请填写标题并上传图片');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const payload = {
        title: newCarousel.title,
        image_url: newCarousel.image_url,
        link_url: newCarousel.link_url || '',
        description: newCarousel.description || '',
        order: Number(newCarousel.order) || 1,
      };
      const res = await http.post('/admin/carousels', payload);
      if (!(res as any)?.success) {
        throw new Error((res as any)?.error || '创建失败');
      }
      setShowAddCarousel(false);
      setNewCarousel({ title: '', link_url: '', image_url: '', description: '', order: 1 });
      await fetchCarousels();
    } catch (e: any) {
      setError(e?.message || '创建轮播图失败');
    } finally {
      setSaving(false);
    }
  };

  const handleEditOpen = (item: any) => {
    setEditCarousel({
      id: item.ID || item.id,
      title: item.Title || item.title || '',
      link_url: item.LinkURL || item.link_url || '',
      image_url: item.ImageURL || item.image_url || '',
      description: item.Description || item.description || '',
      order: item.Order || item.order || 1,
      status: item.Status || item.status || 'active',
    });
  };

  const handleEditUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const files = inputEl.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const form = new FormData();
      form.append('type', 'image');
      form.append('file', file);
      const resp = await http.uploadMaterial(form);
      const url = (resp as any)?.data?.url || (resp as any)?.url;
      if (!url) throw new Error('上传返回缺少url');
      const absoluteUrl = url.startsWith('http') ? url : `${backendOrigin}${url}`;
      setEditCarousel((prev: any) => prev ? { ...prev, image_url: absoluteUrl } : prev);
    } catch (err: any) {
      setError(err?.message || '轮播图图片上传失败');
    } finally {
      inputEl.value = '';
    }
  };

  const handleUpdateCarousel = async () => {
    if (!editCarousel) return;
    try {
      setSaving(true);
      setError(null);
      const payload: any = {
        title: editCarousel.title,
        image_url: editCarousel.image_url,
        link_url: editCarousel.link_url || '',
        description: editCarousel.description || '',
        order: Number(editCarousel.order) || 1,
      };
      if (editCarousel.status) payload.status = editCarousel.status;
      const res = await http.put(`/admin/carousels/${editCarousel.id}`, payload);
      if (!(res as any)?.success) {
        throw new Error((res as any)?.error || '更新失败');
      }
      setEditCarousel(null);
      await fetchCarousels();
    } catch (e: any) {
      setError(e?.message || '更新轮播图失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCarousel = async (id: number) => {
    if (!confirm('确定要删除该轮播图吗？')) return;
    try {
      setSaving(true);
      setError(null);
      const res = await http.delete(`/admin/carousels/${id}`);
      if (!(res as any)?.success) {
        throw new Error((res as any)?.error || '删除失败');
      }
      await fetchCarousels();
    } catch (e: any) {
      setError(e?.message || '删除轮播图失败');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveCarousel = async (item: any, delta: number) => {
    const id = item.ID || item.id;
    const currentOrder = item.Order || item.order || 1;
    const newOrder = Math.max(1, Number(currentOrder) + delta);
    try {
      const res = await http.put(`/admin/carousels/${id}/order`, { order: newOrder });
      if (!(res as any)?.success) throw new Error((res as any)?.error || '排序更新失败');
      await fetchCarousels();
    } catch (e: any) {
      setError(e?.message || '更新排序失败');
    }
  };

  const tabs = [
    { id: 'general', label: '基本设置', icon: 'fa-cog' },
    { id: 'carousel', label: '轮播图管理', icon: 'fa-images' },
    { id: 'announcement', label: '公告管理', icon: 'fa-bullhorn' },
    { id: 'admin', label: '管理员管理', icon: 'fa-user-shield' },
    { id: 'content', label: '内容管理', icon: 'fa-file-text' },
    { id: 'user', label: '用户设置', icon: 'fa-users' },
    { id: 'security', label: '安全设置', icon: 'fa-shield' },
    { id: 'email', label: '邮件设置', icon: 'fa-envelope' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">系统设置</h2>
        <p className="text-gray-500">配置系统参数和平台设置</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 text-red-700 bg-red-50">{error}</div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 设置导航 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i className={`fa ${tab.icon} w-4`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 设置内容 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {loading && (
              <div className="mb-4 text-gray-500">加载中...</div>
            )}
            {/* 基本设置 */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">网站基本信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">网站名称</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">网站域名</label>
                    <input
                      type="text"
                      value={settings.siteDomain}
                      onChange={(e) => handleSettingChange('siteDomain', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      placeholder="www.example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">网站描述</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">网站LOGO</label>
                  <div className="flex items-center gap-4">
                    {settings.siteLogo && (
                      <img src={settings.siteLogo} alt="网站LOGO" className="w-16 h-16 object-cover rounded-lg border" />
                    )}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={settings.siteLogo}
                        onChange={(e) => handleSettingChange('siteLogo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        placeholder="LOGO图片URL"
                      />
                      <p className="text-xs text-gray-500 mt-1">支持JPG、PNG格式，建议尺寸200x200px</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadLogoChange} />
                    <button onClick={handleUploadLogoClick} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                      上传图片
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold mb-4">联系方式配置</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">管理员邮箱</label>
                      <input
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
                      <input
                        type="text"
                        value={settings.contactPhone}
                        onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        placeholder="400-123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">微信账号</label>
                      <input
                        type="text"
                        value={settings.contactWechat}
                        onChange={(e) => handleSettingChange('contactWechat', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        placeholder="微信号"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">微博账号</label>
                      <input
                        type="text"
                        value={settings.contactWeibo}
                        onChange={(e) => handleSettingChange('contactWeibo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        placeholder="@微博账号"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">QQ群号</label>
                      <input
                        type="text"
                        value={settings.contactQq}
                        onChange={(e) => handleSettingChange('contactQq', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        placeholder="QQ群号"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold mb-4">系统状态</h4>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="maintenanceMode" className="text-sm text-gray-700">
                      维护模式（开启后用户无法访问网站）
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 轮播图管理 */}
            {activeTab === 'carousel' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">首页轮播图管理</h3>
                  <button onClick={() => setShowAddCarousel(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                    <i className="fa fa-plus mr-2"></i>
                    添加轮播图
                  </button>
                </div>
                
                {/* 列表 */}
                {carouselLoading ? (
                  <div className="text-gray-500">加载中...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {carousels.length === 0 && (
                      <div className="text-gray-500">暂无轮播图</div>
                    )}
                    {carousels.map((item: any) => (
                      <div key={item.ID || item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="relative">
                          <img src={item.ImageURL || item.image_url} alt={item.Title || item.title} className="w-full h-48 object-cover" />
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              (item.Status || item.status) === 'active' 
                                ? 'bg-green-100 text-green-500' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {(item.Status || item.status) === 'active' ? '启用' : '禁用'}
                            </span>
                          </div>
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                              排序: {item.Order || item.order}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{item.Title || item.title}</h4>
                          <p className="text-sm text-gray-500 mb-3">链接: {item.LinkURL || item.link_url}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-900 text-sm" onClick={() => handleEditOpen(item)}>编辑</button>
                              <a className="text-yellow-600 hover:text-yellow-900 text-sm" href={item.LinkURL || item.link_url || '#'} target="_blank" rel="noreferrer">预览</a>
                              <button className="text-red-600 hover:text-red-900 text-sm" onClick={() => handleDeleteCarousel(item.ID || item.id)}>删除</button>
                            </div>
                            <div className="flex items-center gap-1">
                              <button className="text-gray-600 hover:text-gray-900 text-sm" onClick={() => handleMoveCarousel(item, -1)}><i className="fa fa-arrow-up"></i></button>
                              <button className="text-gray-600 hover:text-gray-900 text-sm" onClick={() => handleMoveCarousel(item, 1)}><i className="fa fa-arrow-down"></i></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 新增弹层 */}
                {showAddCarousel && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">添加轮播图</h4>
                        <button onClick={() => setShowAddCarousel(false)} className="text-gray-500 hover:text-gray-800"><i className="fa fa-times"></i></button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">标题</label>
                          <input value={newCarousel.title} onChange={(e)=>setNewCarousel(v=>({...v,title:e.target.value}))} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">链接URL</label>
                          <input value={newCarousel.link_url} onChange={(e)=>setNewCarousel(v=>({...v,link_url:e.target.value}))} className="w-full px-3 py-2 border rounded-lg" placeholder="/activities/1 或 https://..." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">描述（可选）</label>
                          <textarea value={newCarousel.description} onChange={(e)=>setNewCarousel(v=>({...v,description:e.target.value}))} rows={2} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-end">
                          <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">图片URL</label>
                            <input value={newCarousel.image_url} onChange={(e)=>setNewCarousel(v=>({...v,image_url:e.target.value}))} className="w-full px-3 py-2 border rounded-lg" placeholder="/uploads/... 或完整URL" />
                            {!!newCarousel.image_url && (
                              <img src={newCarousel.image_url} alt="预览" className="mt-2 h-24 w-full object-cover rounded" />
                            )}
                          </div>
                          <div className="col-span-1">
                            <input ref={addCarouselFileRef} type="file" accept="image/*" className="hidden" onChange={handleAddCarouselUpload} />
                            <button onClick={()=>addCarouselFileRef.current?.click()} className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg">上传图片</button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">排序（数字越小越靠前）</label>
                          <input type="number" value={newCarousel.order} onChange={(e)=>setNewCarousel(v=>({...v,order: Number(e.target.value)||1}))} className="w-40 px-3 py-2 border rounded-lg" />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end gap-3">
                        <button onClick={()=>setShowAddCarousel(false)} className="px-4 py-2 rounded-lg border">取消</button>
                        <button onClick={handleCreateCarousel} disabled={saving} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">{saving? '提交中...' : '提交'}</button>
                      </div>
                    </div>
                  </div>
                )}

                {editCarousel && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">编辑轮播图</h4>
                        <button onClick={() => setEditCarousel(null)} className="text-gray-500 hover:text-gray-800"><i className="fa fa-times"></i></button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">标题</label>
                          <input value={editCarousel.title} onChange={(e)=>setEditCarousel((v:any)=>({...v,title:e.target.value}))} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">链接URL</label>
                          <input value={editCarousel.link_url} onChange={(e)=>setEditCarousel((v:any)=>({...v,link_url:e.target.value}))} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">描述（可选）</label>
                          <textarea value={editCarousel.description} onChange={(e)=>setEditCarousel((v:any)=>({...v,description:e.target.value}))} rows={2} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-end">
                          <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">图片URL</label>
                            <input value={editCarousel.image_url} onChange={(e)=>setEditCarousel((v:any)=>({...v,image_url:e.target.value}))} className="w-full px-3 py-2 border rounded-lg" />
                            {!!editCarousel.image_url && (
                              <img src={editCarousel.image_url} alt="预览" className="mt-2 h-24 w-full object-cover rounded" />
                            )}
                          </div>
                          <div className="col-span-1">
                            <input ref={editCarouselFileRef} type="file" accept="image/*" className="hidden" onChange={handleEditUpload} />
                            <button onClick={()=>editCarouselFileRef.current?.click()} className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg">上传图片</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">排序</label>
                            <input type="number" value={editCarousel.order} onChange={(e)=>setEditCarousel((v:any)=>({...v,order:Number(e.target.value)||1}))} className="w-full px-3 py-2 border rounded-lg" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">状态</label>
                            <select value={editCarousel.status} onChange={(e)=>setEditCarousel((v:any)=>({...v,status:e.target.value}))} className="w-full px-3 py-2 border rounded-lg">
                              <option value="active">启用</option>
                              <option value="inactive">禁用</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end gap-3">
                        <button onClick={()=>setEditCarousel(null)} className="px-4 py-2 rounded-lg border">取消</button>
                        <button onClick={handleUpdateCarousel} disabled={saving} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">{saving? '保存中...' : '保存'}</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 公告管理 */}
            {activeTab === 'announcement' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">公告管理</h3>
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                    <i className="fa fa-plus mr-2"></i>
                    发布公告
                  </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布时间</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          {
                            id: 1,
                            title: "秋日创作大赛开始报名",
                            publishDate: "2023-10-20",
                            status: "published"
                          },
                          {
                            id: 2,
                            title: "系统维护通知",
                            publishDate: "2023-10-18",
                            status: "published"
                          },
                          {
                            id: 3,
                            title: "新功能上线预告",
                            publishDate: "2023-10-15",
                            status: "draft"
                          }
                        ].map((announcement) => (
                          <tr key={announcement.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              #{announcement.id}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {announcement.publishDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                announcement.status === 'published' 
                                  ? 'bg-green-100 text-green-500' 
                                  : 'bg-orange-100 text-orange-500'
                              }`}>
                                {announcement.status === 'published' ? '已发布' : '草稿'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  编辑
                                </button>
                                <button className="text-yellow-600 hover:text-yellow-900">
                                  预览
                                </button>
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
                  
                  {/* 分页控件 */}
                  <div className="px-6 py-3 border-t bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        显示第 1-3 条，共 3 条记录
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          上一页
                        </button>
                        <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg">
                          1
                        </button>
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          下一页
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 管理员管理 */}
            {activeTab === 'admin' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">管理员管理</h3>
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                    <i className="fa fa-plus mr-2"></i>
                    添加管理员
                  </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">管理员信息</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最后登录</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          {
                            id: 1,
                            name: "王管理员",
                            email: "admin@maimang.com",
                            role: "super_admin",
                            lastLogin: "2023-10-20 14:30",
                            status: "active",
                            avatar: "https://picsum.photos/id/64/100/100"
                          },
                          {
                            id: 2,
                            name: "李编辑",
                            email: "editor@maimang.com",
                            role: "editor",
                            lastLogin: "2023-10-19 09:15",
                            status: "active",
                            avatar: "https://picsum.photos/id/65/100/100"
                          },
                          {
                            id: 3,
                            name: "张审核",
                            email: "reviewer@maimang.com",
                            role: "reviewer",
                            lastLogin: "2023-10-18 16:45",
                            status: "inactive",
                            avatar: "https://picsum.photos/id/66/100/100"
                          }
                        ].map((admin) => (
                          <tr key={admin.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <img 
                                  src={admin.avatar} 
                                  alt={admin.name}
                                  className="w-10 h-10 rounded-full object-cover mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                                  <div className="text-sm text-gray-500">{admin.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                admin.role === 'super_admin' 
                                  ? 'bg-red-100 text-red-500' 
                                  : admin.role === 'editor'
                                  ? 'bg-blue-100 text-blue-500'
                                  : 'bg-green-100 text-green-500'
                              }`}>
                                {admin.role === 'super_admin' ? '超级管理员' : 
                                 admin.role === 'editor' ? '编辑' : '审核员'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {admin.lastLogin}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                admin.status === 'active' 
                                  ? 'bg-green-100 text-green-500' 
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {admin.status === 'active' ? '活跃' : '禁用'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  编辑
                                </button>
                                {admin.role !== 'super_admin' && (
                                  <button className="text-red-600 hover:text-red-900">
                                    删除
                                  </button>
                                )}
                                {admin.role === 'super_admin' && (
                                  <span className="text-gray-400 text-xs">受保护</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 角色与权限管理 */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h4 className="text-lg font-semibold mb-4">角色与权限管理</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-red-600 mb-3">超级管理员</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 系统设置管理</li>
                        <li>• 用户管理</li>
                        <li>• 内容管理</li>
                        <li>• 管理员管理</li>
                        <li>• 所有权限</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-blue-600 mb-3">编辑</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 内容发布</li>
                        <li>• 内容编辑</li>
                        <li>• 评论管理</li>
                        <li>• 活动管理</li>
                        <li>• 素材管理</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-green-600 mb-3">审核员</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 作品审核</li>
                        <li>• 评论审核</li>
                        <li>• 用户举报处理</li>
                        <li>• 数据查看</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 内容管理 */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">内容管理</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">最大文件大小 (MB)</label>
                    <input
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">允许的文件类型</label>
                    <input
                      type="text"
                      value={settings.allowedFileTypes.join(', ')}
                      onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value.split(', '))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      placeholder="jpg, png, pdf, doc"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoApproveWorks"
                      checked={settings.autoApproveWorks}
                      onChange={(e) => handleSettingChange('autoApproveWorks', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="autoApproveWorks" className="text-sm text-gray-700">
                      自动审核通过作品（无需人工审核）
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableComments"
                      checked={settings.enableComments}
                      onChange={(e) => handleSettingChange('enableComments', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="enableComments" className="text-sm text-gray-700">
                      启用评论功能
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 用户设置 */}
            {activeTab === 'user' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">用户设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableUserRegistration"
                      checked={settings.enableUserRegistration}
                      onChange={(e) => handleSettingChange('enableUserRegistration', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="enableUserRegistration" className="text-sm text-gray-700">
                      允许用户注册
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireEmailVerification"
                      checked={settings.requireEmailVerification}
                      onChange={(e) => handleSettingChange('requireEmailVerification', e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="requireEmailVerification" className="text-sm text-gray-700">
                      要求邮箱验证
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 安全设置 */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">安全设置</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <i className="fa fa-exclamation-triangle text-yellow-600 mt-1 mr-3"></i>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">安全提醒</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        请定期更新系统密码，确保管理员账户安全。建议启用两步验证。
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      placeholder="输入当前密码"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      placeholder="输入新密码"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      placeholder="再次输入新密码"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 邮件设置 */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">邮件设置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP服务器</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">端口</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      placeholder="your-email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      placeholder="邮箱密码或应用密码"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useSSL"
                    className="mr-3"
                  />
                  <label htmlFor="useSSL" className="text-sm text-gray-700">
                    使用SSL加密
                  </label>
                </div>
              </div>
            )}

            {/* 保存按钮 */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-end gap-4">
                <button disabled={loading || saving} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                  重置
                </button>
                <button 
                  onClick={handleSave}
                  disabled={loading || saving}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {saving ? '保存中...' : '保存设置'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}