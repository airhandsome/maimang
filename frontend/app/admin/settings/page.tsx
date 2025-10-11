'use client';

import { useState } from 'react';

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

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // 这里应该调用API保存设置
    console.log('保存设置:', settings);
    alert('设置已保存！');
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
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
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
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                    <i className="fa fa-plus mr-2"></i>
                    添加轮播图
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* 轮播图项目 */}
                  {[
                    {
                      id: 1,
                      title: "秋日创作大赛",
                      image: "https://picsum.photos/id/175/800/400",
                      link: "/activities/1",
                      order: 1,
                      status: "active"
                    },
                    {
                      id: 2,
                      title: "文学沙龙活动",
                      image: "https://picsum.photos/id/176/800/400",
                      link: "/activities/2",
                      order: 2,
                      status: "active"
                    },
                    {
                      id: 3,
                      title: "新书推荐",
                      image: "https://picsum.photos/id/177/800/400",
                      link: "/articles/1",
                      order: 3,
                      status: "inactive"
                    }
                  ].map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="relative">
                        <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status === 'active' 
                              ? 'bg-green-100 text-green-500' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {item.status === 'active' ? '启用' : '禁用'}
                          </span>
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                            排序: {item.order}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-500 mb-3">链接: {item.link}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-900 text-sm">
                              编辑
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900 text-sm">
                              预览
                            </button>
                            <button className="text-red-600 hover:text-red-900 text-sm">
                              删除
                            </button>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="text-gray-600 hover:text-gray-900 text-sm">
                              <i className="fa fa-arrow-up"></i>
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 text-sm">
                              <i className="fa fa-arrow-down"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  重置
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}