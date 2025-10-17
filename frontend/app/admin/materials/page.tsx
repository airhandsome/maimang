'use client';

import { useEffect, useMemo, useState } from 'react';
import { http } from '@/lib/http';

type MaterialType = 'image' | 'document' | 'video' | 'audio';

type Material = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  Name: string;
  Type: MaterialType;
  Size: number;
  URL: string;
  Description: string;
  Tags: string; // 后端为字符串，可能是逗号分隔或JSON
  UploaderID: number;
  Uploader?: { ID: number; Name: string };
};

export default function MaterialsManagement() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editing, setEditing] = useState<Material | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editTags, setEditTags] = useState<string>('');

  const getAssetUrl = (url: string) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1';
    const origin = apiBase.replace(/\/api\/v1$/, '');
    // url 形如 /uploads/...
    return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
  };

  const parsedMaterials = useMemo(() => {
    return materials.map(m => ({
      ...m,
      tagsArray: (() => {
        try {
          if (!m.Tags) return [] as string[];
          if (m.Tags.trim().startsWith('[')) return JSON.parse(m.Tags) as string[];
          return m.Tags.split(',').map(s => s.trim()).filter(Boolean);
        } catch {
          return [] as string[];
        }
      })(),
    }));
  }, [materials]);

  const filteredMaterials = parsedMaterials.filter(material => {
    const typeMatch = filterType === 'all' || material.Type === filterType;
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = searchTerm === '' || 
      material.Name.toLowerCase().includes(searchLower) ||
      (material.Description || '').toLowerCase().includes(searchLower) ||
      material.tagsArray.some((tag: string) => tag.toLowerCase().includes(searchLower));
    return typeMatch && searchMatch;
  });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = { page: 1, per_page: 50 };
      if (filterType !== 'all') params.type = filterType;
      if (searchTerm) params.search = searchTerm;
      const res = await http.getMaterials(params);
      setMaterials(res.data || []);
    } catch (e: any) {
      setError(e.message || '获取素材列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget; // 缓存引用，避免异步后事件被回收
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      // 逐个文件上传（可根据需求并发）
      for (const file of files) {
        const form = new FormData();
        form.append('file', file);
        if (file.type.startsWith('image/')) form.append('type', 'image');
        form.append('name', file.name);
        await http.uploadMaterial(form);
      }
      await fetchMaterials();
    } catch (err: any) {
      setError(err.message || '上传失败');
    } finally {
      setUploading(false);
      if (inputEl) inputEl.value = '';
    }
  };

  const handleDropUpload = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setUploading(true);
    try {
      for (const file of arr) {
        const form = new FormData();
        form.append('file', file);
        if (file.type.startsWith('image/')) form.append('type', 'image');
        form.append('name', file.name);
        await http.uploadMaterial(form);
      }
      await fetchMaterials();
    } catch (err: any) {
      setError(err.message || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const isSelected = (id: number) => selectedIds.has(id);

  const clearSelection = () => setSelectedIds(new Set());

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定删除选中的 ${selectedIds.size} 个素材吗？`)) return;
    try {
      // 顺序删除（可优化为并发）
      for (const id of Array.from(selectedIds)) {
        await http.deleteMaterial(id);
      }
      clearSelection();
      await fetchMaterials();
    } catch (err: any) {
      setError(err.message || '批量删除失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个素材吗？')) return;
    try {
      await http.deleteMaterial(id);
      await fetchMaterials();
    } catch (err: any) {
      setError(err.message || '删除失败');
    }
  };

  const openEdit = (m: Material) => {
    setEditing(m);
    setEditName(m.Name || '');
    setEditDescription(m.Description || '');
    const tags = (() => {
      try {
        if (!m.Tags) return '';
        if (m.Tags.trim().startsWith('[')) return (JSON.parse(m.Tags) as string[]).join(',');
        return m.Tags;
      } catch {
        return '';
      }
    })();
    setEditTags(tags);
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await http.updateMaterial(editing.ID, {
        name: editName,
        description: editDescription,
        tags: editTags,
      });
      setEditing(null);
      await fetchMaterials();
    } catch (err: any) {
      setError(err.message || '更新失败');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <i className="fa fa-image text-blue-500"></i>;
      case 'document':
        return <i className="fa fa-file-pdf-o text-red-500"></i>;
      case 'video':
        return <i className="fa fa-video-camera text-purple-500"></i>;
      case 'audio':
        return <i className="fa fa-music text-green-500"></i>;
      default:
        return <i className="fa fa-file text-gray-500"></i>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'image':
        return <span className="px-2 py-1 bg-blue-100 text-blue-500 text-xs rounded-full">图片</span>;
      case 'document':
        return <span className="px-2 py-1 bg-red-100 text-red-500 text-xs rounded-full">文档</span>;
      case 'video':
        return <span className="px-2 py-1 bg-purple-100 text-purple-500 text-xs rounded-full">视频</span>;
      case 'audio':
        return <span className="px-2 py-1 bg-green-100 text-green-500 text-xs rounded-full">音频</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">其他</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold">素材库</h2>
          <p className="text-gray-500">管理平台素材资源，包括图片、文档、视频等</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer">
          <i className="fa fa-upload mr-2"></i>
          {uploading ? '上传中...' : '上传素材'}
            <input type="file" multiple className="hidden" onChange={handleUpload} />
          </label>
          <button
            onClick={handleBatchDelete}
            disabled={selectedIds.size === 0}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedIds.size === 0 ? 'bg-gray-200 text-gray-400' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            <i className="fa fa-trash mr-2"></i>
            批量删除{selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
          </button>
        </div>
      </div>

      {/* 搜索和筛选器 */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索素材名称、描述或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
              <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">类型筛选：</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="all">全部</option>
              <option value="image">图片</option>
              <option value="document">文档</option>
              <option value="video">视频</option>
              <option value="audio">音频</option>
            </select>
          </div>
        </div>
      </div>

      {/* 拖拽上传区域 */}
      <div
        className={`mb-6 border-2 border-dashed rounded-xl p-6 text-center ${isDragging ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-white'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            handleDropUpload(e.dataTransfer.files);
          }
        }}
      >
        <div className="text-gray-500">
          <i className="fa fa-cloud-upload text-2xl mb-2"></i>
          <div>将文件拖拽到此处，或点击“上传素材”选择文件（支持多选）</div>
        </div>
      </div>

      {/* 素材列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredMaterials.map((material) => (
          <div
            key={material.ID}
            className={`relative bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer ${isSelected(material.ID) ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => toggleSelect(material.ID)}
          >
            {/* 左上角选择框 */}
            <div className="absolute top-3 left-3 z-10 bg-white/80 rounded px-1 py-0.5">
              <input
                type="checkbox"
                className="accent-yellow-500"
                checked={isSelected(material.ID)}
                onChange={(e) => { e.stopPropagation(); toggleSelect(material.ID); }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {material.Type === 'image' && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={getAssetUrl(material.URL)} 
                  alt={material.Name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {material.Type !== 'image' && (
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-6xl text-gray-400">
                  {getTypeIcon(material.Type)}
                </div>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate flex-1">{material.Name}</h3>
                {getTypeBadge(material.Type)}
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.Description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {material.tagsArray.map((tag: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{(material.Size / 1024).toFixed(1)} KB</span>
                <span>{new Date(material.CreatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">上传者: {material.Uploader?.Name || material.UploaderID}</span>
                <div className="flex items-center gap-2">
                  <a href={getAssetUrl(material.URL)} target="_blank" rel="noreferrer" className="text-yellow-600 hover:text-yellow-900 text-sm" onClick={(e) => e.stopPropagation()}>
                    下载
                  </a>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(material); }} className="text-blue-600 hover:text-blue-900 text-sm">
                    编辑
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(material.ID); }} className="text-red-600 hover:text-red-900 text-sm">
                    删除
                  </button>
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
              <p className="text-sm text-gray-500">总素材数</p>
              <p className="text-2xl font-bold">{materials.length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-folder-open"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">图片素材</p>
              <p className="text-2xl font-bold text-blue-500">{materials.filter(m => m.Type === 'image').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <i className="fa fa-image"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">文档素材</p>
              <p className="text-2xl font-bold text-red-500">{materials.filter(m => m.Type === 'document').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <i className="fa fa-file-pdf-o"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">媒体素材</p>
              <p className="text-2xl font-bold text-purple-500">{materials.filter(m => m.Type === 'video' || m.Type === 'audio').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
              <i className="fa fa-video-camera"></i>
            </div>
          </div>
        </div>
      </div>

      {/* 编辑弹窗 */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">编辑素材</h3>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-700">
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">名称</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">描述</label>
                <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" rows={3} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">标签（用逗号分隔）</label>
                <input value={editTags} onChange={e => setEditTags(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded border text-sm">取消</button>
              <button onClick={saveEdit} className="px-4 py-2 rounded bg-yellow-500 text-white text-sm">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}