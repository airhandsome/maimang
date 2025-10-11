'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { http } from '@/lib/http';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { marked } from 'marked';

export default function SubmitWorkPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'prose' as 'poetry' | 'prose' | 'novel' | 'photo',
    content: '',
    tags: [] as string[]
  });
  
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich');

  // 处理表单提交
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('请输入作品标题');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('请输入作品内容');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await http.createWork({
        title: formData.title.trim(),
        type: formData.type,
        content: formData.content.trim()
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/profile/works');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || '投稿失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 添加标签
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 处理标签输入回车
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // 富文本编辑器命令
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  // 渲染Markdown内容
  const renderMarkdown = (content: string) => {
    if (!content) return '<p class="text-gray-400">暂无内容</p>';
    return marked(content);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4 text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">投稿成功！</h2>
            <p className="text-gray-600 mb-4">
              您的作品已提交审核，我们会在24小时内完成审核。
            </p>
            <p className="text-sm text-gray-500">
              正在跳转到我的作品页面...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧：创作区域 */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* 标题输入区 */}
              <div className="p-6 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="请输入作品标题..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full text-2xl font-serif font-bold border-none focus:outline-none placeholder-gray-300"
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-sm text-gray-500 mr-2">分类</label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      >
                        <option value="prose">散文</option>
                        <option value="poetry">诗歌</option>
                        <option value="novel">小说</option>
                        <option value="photo">摄影配文</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500 mr-2">标签</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span key={index} className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              <i className="fa fa-times-circle"></i>
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="添加标签"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          className="border border-dashed border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 w-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 编辑器工具栏 */}
              <div className="bg-white border-b border-gray-200 p-2 flex flex-wrap gap-1">
                {/* 编辑器模式切换 */}
                <div className="flex border border-gray-200 rounded mr-2">
                  <button
                    type="button"
                    onClick={() => setEditorMode('rich')}
                    className={`px-3 py-1 text-sm transition-colors ${
                      editorMode === 'rich' 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    富文本
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('markdown')}
                    className={`px-3 py-1 text-sm transition-colors ${
                      editorMode === 'markdown' 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Markdown
                  </button>
                </div>
                
                {editorMode === 'rich' && (
                  <>
                    <button
                      type="button"
                      onClick={() => execCommand('formatBlock', 'p')}
                      className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                      title="段落格式"
                    >
                      <i className="fa fa-paragraph"></i>
                    </button>
                <button
                  type="button"
                  onClick={() => execCommand('bold')}
                  className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                  title="加粗"
                >
                  <i className="fa fa-bold"></i>
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('italic')}
                  className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                  title="斜体"
                >
                  <i className="fa fa-italic"></i>
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('underline')}
                  className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                  title="下划线"
                >
                  <i className="fa fa-underline"></i>
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('strikeThrough')}
                  className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                  title="删除线"
                >
                  <i className="fa fa-strikethrough"></i>
                </button>
                <div className="h-6 border-r border-gray-200 mx-1"></div>
                <button
                  type="button"
                  onClick={() => execCommand('justifyLeft')}
                  className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                  title="左对齐"
                >
                  <i className="fa fa-align-left"></i>
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('justifyCenter')}
                  className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                  title="居中对齐"
                >
                  <i className="fa fa-align-center"></i>
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('justifyRight')}
                  className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                  title="右对齐"
                >
                  <i className="fa fa-align-right"></i>
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('justifyFull')}
                  className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                  title="两端对齐"
                >
                  <i className="fa fa-align-justify"></i>
                </button>
                <div className="h-6 border-r border-gray-200 mx-1"></div>
                <button
                  type="button"
                  onClick={() => execCommand('insertUnorderedList')}
                  className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                  title="无序列表"
                >
                  <i className="fa fa-list-ul"></i>
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('insertOrderedList')}
                  className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                  title="有序列表"
                >
                  <i className="fa fa-list-ol"></i>
                </button>
                <button
                  type="button"
                  onClick={() => execCommand('formatBlock', 'blockquote')}
                  className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                  title="引用"
                >
                  <i className="fa fa-quote-right"></i>
                </button>
                    <div className="ml-auto">
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700"
                        title="预览"
                      >
                        <i className="fa fa-eye"></i>
                      </button>
                    </div>
                  </>
                )}
                
                {editorMode === 'markdown' && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>支持 Markdown 语法：**粗体** *斜体* # 标题 [链接](url)</span>
                  </div>
                )}
              </div>
              
              {/* 编辑区域 */}
              <div className="p-6 min-h-[500px] bg-yellow-50/30">
                {showPreview ? (
                  <div className="prose max-w-none font-serif text-lg leading-relaxed">
                    {editorMode === 'markdown' ? (
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.content) }} />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-400">暂无内容</p>' }} />
                    )}
                  </div>
                ) : (
                  <>
                    {editorMode === 'markdown' ? (
                      <textarea
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        placeholder="开始创作您的作品...&#10;&#10;支持 Markdown 语法：&#10;**粗体** *斜体* # 标题&#10;[链接](url) - 列表项&#10;&gt; 引用"
                        className="w-full h-full min-h-[400px] font-mono text-sm leading-relaxed focus:outline-none resize-none bg-transparent"
                      />
                    ) : (
                      <div
                        contentEditable
                        className="prose max-w-none font-serif text-lg leading-relaxed focus:outline-none"
                        onInput={(e) => {
                          const target = e.target as HTMLElement;
                          handleInputChange('content', target.innerHTML);
                        }}
                        dangerouslySetInnerHTML={{ __html: formData.content || '<p>开始创作您的作品...</p>' }}
                      />
                    )}
                  </>
                )}
              </div>
              
              {/* 底部操作栏 */}
              <div className="p-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors"
                  >
                    <i className="fa fa-eye"></i> {showPreview ? '编辑' : '预览'}
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors"
                  >
                    <i className="fa fa-save"></i> 保存草稿
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors"
                  >
                    <i className="fa fa-history"></i> 版本历史
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                  >
                    <i className="fa fa-paper-plane"></i> {loading ? '提交中...' : '提交审核'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧：辅助区域 */}
          <div className="lg:w-1/3 space-y-6">
            {/* 投稿指南 */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <i className="fa fa-lightbulb-o text-yellow-500 mr-2"></i> 投稿指南
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <i className="fa fa-check-circle text-yellow-500 mt-1"></i>
                  <span>内容需为原创，禁止抄袭或搬运他人作品</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa fa-check-circle text-yellow-500 mt-1"></i>
                  <span>散文类作品建议字数800-3000字，诗歌不限</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa fa-check-circle text-yellow-500 mt-1"></i>
                  <span>审核周期为1-3个工作日，结果将通过站内信通知</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa fa-check-circle text-yellow-500 mt-1"></i>
                  <span>优质作品将获得首页推荐及积分奖励</span>
                </li>
              </ul>
              <a href="/contribute-guide" className="text-yellow-600 text-sm hover:underline mt-3 block text-right">查看完整指南 →</a>
            </div>
            
            {/* 我的草稿 */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-lg flex items-center">
                  <i className="fa fa-file-text-o text-yellow-500 mr-2"></i> 我的草稿
                </h3>
                <a href="/profile/drafts" className="text-yellow-600 text-sm hover:underline">查看全部</a>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-yellow-500/50 hover:bg-yellow-50/50 transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm hover:text-yellow-600 cursor-pointer">故乡的老槐树</h4>
                    <span className="text-xs text-gray-500">3天前</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">那年夏天，老槐树下的蝉鸣格外响亮，奶奶的蒲扇摇啊摇，摇出了整个童年的回忆...</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <button className="text-xs text-gray-500 hover:text-yellow-600">编辑</button>
                    <button className="text-xs text-gray-500 hover:text-red-500">删除</button>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg hover:border-yellow-500/50 hover:bg-yellow-50/50 transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm hover:text-yellow-600 cursor-pointer">雨夜随笔</h4>
                    <span className="text-xs text-gray-500">1周前</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">窗外的雨淅淅沥沥，敲打着玻璃，也敲打着那些未说出口的心事...</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <button className="text-xs text-gray-500 hover:text-yellow-600">编辑</button>
                    <button className="text-xs text-gray-500 hover:text-red-500">删除</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 创作灵感 */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <i className="fa fa-star-o text-yellow-500 mr-2"></i> 创作灵感
              </h3>
              <div className="space-y-3">
                <div className="border-l-4 border-yellow-500 pl-3 py-1">
                  <h4 className="text-sm font-medium">十月征稿主题</h4>
                  <p className="text-xs text-gray-600 mt-1">「秋日私语」—— 记录秋天里的微小感动</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3 py-1">
                  <h4 className="text-sm font-medium">写作技巧</h4>
                  <p className="text-xs text-gray-600 mt-1">用五感描写让场景更生动：视觉、听觉、嗅觉、味觉、触觉</p>
                </div>
                <a href="/inspiration" className="text-yellow-600 text-sm hover:underline mt-2 block text-right">更多灵感 →</a>
              </div>
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
            {error}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}