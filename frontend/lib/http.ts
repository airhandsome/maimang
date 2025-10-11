type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  data?: any;
  headers?: Record<string, string>;
}

export const MOCK_ARTICLES = [
  {
    id: '1',
    title: '秋日的麦田',
    content: '金黄的麦浪在秋风中翻滚，如同青春的记忆在心中荡漾。每一株麦穗都饱含着希望，每一粒麦子都承载着梦想...',
    excerpt: '金黄的麦浪在秋风中翻滚，如同青春的记忆在心中荡漾。',
    author: '李明',
    category: '散文',
    categoryId: '1',
    coverImage: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishDate: '2024-09-15',
    views: 1234,
    likes: 89,
    featured: true,
  },
  {
    id: '2',
    title: '青春的色彩',
    content: '青春是一幅多彩的画卷，用热情的红、希望的黄、梦想的蓝描绘着我们的年华...',
    excerpt: '青春是一幅多彩的画卷，用热情的红、希望的黄、梦想的蓝描绘着我们的年华。',
    author: '张婷',
    category: '诗歌',
    categoryId: '2',
    coverImage: 'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishDate: '2024-09-20',
    views: 892,
    likes: 67,
    featured: true,
  },
  {
    id: '3',
    title: '丰收的季节',
    content: '当金黄铺满大地，当麦香弥漫空气，我们知道，这是付出与回报的交响曲...',
    excerpt: '当金黄铺满大地，当麦香弥漫空气，我们知道，这是付出与回报的交响曲。',
    author: '王浩',
    category: '散文',
    categoryId: '1',
    coverImage: 'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishDate: '2024-09-25',
    views: 756,
    likes: 54,
    featured: false,
  },
  {
    id: '4',
    title: '麦芒的力量',
    content: '小小的麦芒，尖锐而坚韧，它告诉我们：即使渺小，也要有锋芒...',
    excerpt: '小小的麦芒，尖锐而坚韧，它告诉我们：即使渺小，也要有锋芒。',
    author: '刘欣',
    category: '随笔',
    categoryId: '3',
    coverImage: 'https://images.pexels.com/photos/2889090/pexels-photo-2889090.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishDate: '2024-10-01',
    views: 645,
    likes: 43,
    featured: false,
  },
];

const MOCK_CATEGORIES = [
  { id: '1', name: '散文', count: 15 },
  { id: '2', name: '诗歌', count: 23 },
  { id: '3', name: '随笔', count: 12 },
  { id: '4', name: '小说', count: 8 },
];

const MOCK_STATS = {
  totalArticles: 58,
  totalViews: 12847,
  totalMembers: 156,
  totalLikes: 1893,
};

class Http {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', data, headers = {} } = options;

    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint.includes('/articles') && method === 'GET') {
      if (endpoint.includes('/featured')) {
        return MOCK_ARTICLES.filter(a => a.featured) as T;
      }
      if (endpoint.match(/\/articles\/\d+$/)) {
        const id = endpoint.split('/').pop();
        return MOCK_ARTICLES.find(a => a.id === id) as T;
      }
      return MOCK_ARTICLES as T;
    }

    if (endpoint.includes('/categories') && method === 'GET') {
      return MOCK_CATEGORIES as T;
    }

    if (endpoint.includes('/stats') && method === 'GET') {
      return MOCK_STATS as T;
    }

    if (method === 'POST') {
      return { success: true, message: '操作成功', data } as T;
    }

    if (method === 'PUT') {
      return { success: true, message: '更新成功', data } as T;
    }

    if (method === 'DELETE') {
      return { success: true, message: '删除成功' } as T;
    }

    return {} as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', data });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', data });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const http = new Http();
export default http;
