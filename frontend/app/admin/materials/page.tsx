'use client';

import { useState } from 'react';

interface Material {
  id: number;
  name: string;
  type: 'image' | 'document' | 'video' | 'audio';
  size: string;
  uploadDate: string;
  uploader: string;
  description: string;
  url: string;
  tags: string[];
}

export default function MaterialsManagement() {
  const [materials] = useState<Material[]>([
    {
      id: 1,
      name: "秋日麦田风景.jpg",
      type: "image",
      size: "2.3 MB",
      uploadDate: "2023-10-20",
      uploader: "张小明",
      description: "秋日麦田的美丽风景，适合作为诗歌配图",
      url: "https://picsum.photos/id/175/800/600",
      tags: ["风景", "麦田", "秋天", "自然"]
    },
    {
      id: 2,
      name: "文学创作指南.pdf",
      type: "document",
      size: "1.8 MB",
      uploadDate: "2023-10-18",
      uploader: "李老师",
      description: "文学创作的基础指南和技巧分享",
      url: "#",
      tags: ["指南", "创作", "文学", "技巧"]
    },
    {
      id: 3,
      name: "诗歌朗诵视频.mp4",
      type: "video",
      size: "45.2 MB",
      uploadDate: "2023-10-15",
      uploader: "王老师",
      description: "经典诗歌的朗诵视频，用于学习参考",
      url: "#",
      tags: ["朗诵", "诗歌", "视频", "学习"]
    },
    {
      id: 4,
      name: "背景音乐.mp3",
      type: "audio",
      size: "3.7 MB",
      uploadDate: "2023-10-12",
      uploader: "赵小强",
      description: "适合文学活动的背景音乐",
      url: "#",
      tags: ["音乐", "背景", "活动", "音频"]
    },
    {
      id: 5,
      name: "田野采风照片集.jpg",
      type: "image",
      size: "5.1 MB",
      uploadDate: "2023-10-10",
      uploader: "陈小美",
      description: "田野采风活动拍摄的照片合集",
      url: "https://picsum.photos/id/176/800/600",
      tags: ["采风", "田野", "活动", "照片"]
    }
  ]);

  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredMaterials = materials.filter(material => {
    const typeMatch = filterType === 'all' || material.type === filterType;
    const searchMatch = searchTerm === '' || 
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return typeMatch && searchMatch;
  });

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
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
          <i className="fa fa-upload mr-2"></i>
          上传素材
        </button>
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

      {/* 素材列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredMaterials.map((material) => (
          <div key={material.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {material.type === 'image' && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={material.url} 
                  alt={material.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {material.type !== 'image' && (
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-6xl text-gray-400">
                  {getTypeIcon(material.type)}
                </div>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate flex-1">{material.name}</h3>
                {getTypeBadge(material.type)}
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {material.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{material.size}</span>
                <span>{material.uploadDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">上传者: {material.uploader}</span>
                <div className="flex items-center gap-2">
                  <button className="text-yellow-600 hover:text-yellow-900 text-sm">
                    下载
                  </button>
                  <button className="text-blue-600 hover:text-blue-900 text-sm">
                    编辑
                  </button>
                  <button className="text-red-600 hover:text-red-900 text-sm">
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
              <p className="text-2xl font-bold text-blue-500">{materials.filter(m => m.type === 'image').length}</p>
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
              <p className="text-2xl font-bold text-red-500">{materials.filter(m => m.type === 'document').length}</p>
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
              <p className="text-2xl font-bold text-purple-500">{materials.filter(m => m.type === 'video' || m.type === 'audio').length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
              <i className="fa fa-video-camera"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}