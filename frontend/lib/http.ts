type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  data?: any;
  headers?: Record<string, string>;
}

// API响应类型定义
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// 作品相关类型
interface Work {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  Title: string;
  Type: 'poetry' | 'prose' | 'novel' | 'photo';
  Content: string;
  Status: 'pending' | 'approved' | 'rejected';
  AuthorID: number;
  Author?: {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    Name: string;
    Email: string;
    Role: string;
    AvatarURL: string;
    Bio: string;
    Gender: string;
    Phone: string;
    Tags: string;
    Weibo: string;
    Wechat: string;
    Status: string;
    LastLoginAt?: string;
  };
  Views: number;
  Likes: number;
  ReviewedAt?: string;
  ReviewedBy?: number;
  Reviewer?: {
    ID: number;
    Name: string;
  };
  ReviewNote: string;
  RejectReason: string;
}

interface WorkStats {
  total_works: number;
  approved_works: number;
  pending_works: number;
  rejected_works: number;
  total_views: number;
  total_likes: number;
}

// 评论相关类型
interface Comment {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  Content: string;
  Status: 'pending' | 'approved' | 'rejected' | 'hidden';
  AuthorID: number;
  Author?: {
    ID: number;
    Name: string;
    Email: string;
    Role: string;
    Status: string;
  };
  WorkID: number;
  Work?: {
    ID: number;
    Title: string;
    Type: string;
    Status: string;
  };
  Likes: number;
  Replies: number;
  ReviewedAt?: string;
  ReviewedBy?: number;
  Reviewer?: {
    ID: number;
    Name: string;
  };
}

interface CommentStats {
  total_comments: number;
  approved_comments: number;
  pending_comments: number;
  rejected_comments: number;
  hidden_comments: number;
  total_likes: number;
}

// 活动相关类型
interface Activity {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  Title: string;
  Description: string;
  ImageURL: string;
  Date: string;
  Time: string;
  Location: string;
  Instructor: string;
  Status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  MaxParticipants: number;
  CurrentParticipants: number;
  Participants?: ActivityParticipant[];
}

interface ActivityParticipant {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  ActivityID: number;
  UserID: number;
  User?: {
    ID: number;
    Name: string;
    Email: string;
    AvatarURL: string;
  };
  Status: 'registered' | 'attended' | 'absent';
  Notes: string;
}

interface ActivityStats {
  total_activities: number;
  upcoming_activities: number;
  ongoing_activities: number;
  completed_activities: number;
  cancelled_activities: number;
  total_participants: number;
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

  constructor(baseURL: string = 'http://localhost:8080/api/v1') {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', data, headers = {} } = options;

    // 获取token
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token过期或无效，清除本地存储并跳转到登录页
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }
          throw new Error('认证失败，请重新登录');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
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

  // 作品相关API方法
  async getWorks(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    type?: string;
    sort_by?: string;
    sort_dir?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Work>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.get<PaginatedResponse<Work>>(`/works${queryString ? `?${queryString}` : ''}`);
  }

  async getWork(id: number): Promise<ApiResponse<Work>> {
    return this.get<ApiResponse<Work>>(`/works/${id}`);
  }

  async createWork(data: {
    title: string;
    type: 'poetry' | 'prose' | 'novel' | 'photo';
    content: string;
  }): Promise<ApiResponse<Work>> {
    return this.post<ApiResponse<Work>>('/works', data);
  }

  async updateWork(id: number, data: {
    title?: string;
    type?: 'poetry' | 'prose' | 'novel' | 'photo';
    content?: string;
  }): Promise<ApiResponse<Work>> {
    return this.put<ApiResponse<Work>>(`/works/${id}`, data);
  }

  async deleteWork(id: number): Promise<ApiResponse> {
    return this.delete<ApiResponse>(`/works/${id}`);
  }

  async likeWork(id: number): Promise<ApiResponse> {
    return this.post<ApiResponse>(`/works/${id}/like`, {});
  }

  async unlikeWork(id: number): Promise<ApiResponse> {
    return this.delete<ApiResponse>(`/works/${id}/like`);
  }

  // 管理员作品相关API
  async getPendingWorks(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    type?: string;
  }): Promise<PaginatedResponse<Work>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.get<PaginatedResponse<Work>>(`/admin/works${queryString ? `?${queryString}` : ''}`);
  }

  async approveWork(id: number, note?: string): Promise<ApiResponse> {
    return this.put<ApiResponse>(`/admin/works/${id}/approve`, {
      action: 'approve',
      note: note || ''
    });
  }

  async rejectWork(id: number, reason?: string): Promise<ApiResponse> {
    return this.put<ApiResponse>(`/admin/works/${id}/reject`, {
      action: 'reject',
      note: reason || ''
    });
  }

  async getWorkStats(): Promise<ApiResponse<WorkStats>> {
    return this.get<ApiResponse<WorkStats>>('/admin/statistics/works');
  }

  // 评论相关API方法
  async getComments(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Comment>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.get<PaginatedResponse<Comment>>(`/admin/comments${queryString ? `?${queryString}` : ''}`);
  }

  async getComment(id: number): Promise<ApiResponse<Comment>> {
    return this.get<ApiResponse<Comment>>(`/comments/${id}`);
  }

  async createComment(workId: number, data: {
    content: string;
  }): Promise<ApiResponse<Comment>> {
    return this.post<ApiResponse<Comment>>(`/works/${workId}/comments`, data);
  }

  async updateComment(id: number, data: {
    content: string;
  }): Promise<ApiResponse<Comment>> {
    return this.put<ApiResponse<Comment>>(`/comments/${id}`, data);
  }

  async deleteComment(id: number): Promise<ApiResponse> {
    return this.delete<ApiResponse>(`/comments/${id}`);
  }

  async likeComment(id: number): Promise<ApiResponse> {
    return this.post<ApiResponse>(`/comments/${id}/like`, {});
  }

  // 管理员评论相关API
  async approveComment(id: number, note?: string): Promise<ApiResponse> {
    return this.put<ApiResponse>(`/admin/comments/${id}/approve`, {
      action: 'approve',
      note: note || ''
    });
  }

  async rejectComment(id: number, reason?: string): Promise<ApiResponse> {
    return this.put<ApiResponse>(`/admin/comments/${id}/reject`, {
      action: 'reject',
      note: reason || ''
    });
  }

  async hideComment(id: number, reason?: string): Promise<ApiResponse> {
    return this.put<ApiResponse>(`/admin/comments/${id}/hide`, {
      action: 'hide',
      note: reason || ''
    });
  }

  async getCommentStats(): Promise<ApiResponse<CommentStats>> {
    return this.get<ApiResponse<CommentStats>>('/admin/statistics/comments');
  }

  // 活动管理方法
  async getActivities(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    sort_by?: string;
    sort_dir?: string;
  }): Promise<PaginatedResponse<Activity>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return this.get<PaginatedResponse<Activity>>(`/activities${query ? `?${query}` : ''}`);
  }

  // 管理员专用：获取活动列表（排除已删除的活动）
  async getAdminActivities(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    sort_by?: string;
    sort_dir?: string;
  }): Promise<PaginatedResponse<Activity>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return this.get<PaginatedResponse<Activity>>(`/admin/activities${query ? `?${query}` : ''}`);
  }

  async getActivity(id: number): Promise<ApiResponse<Activity>> {
    return this.get<ApiResponse<Activity>>(`/activities/${id}`);
  }

  async createActivity(data: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    instructor: string;
    max_participants: number;
    image_url?: string;
  }): Promise<ApiResponse<Activity>> {
    return this.post<ApiResponse<Activity>>('/admin/activities', data);
  }

  async updateActivity(id: number, data: Partial<{
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    instructor: string;
    max_participants: number;
    image_url: string;
    status: string;
  }>): Promise<ApiResponse<Activity>> {
    return this.put<ApiResponse<Activity>>(`/admin/activities/${id}`, data);
  }

  async deleteActivity(id: number): Promise<ApiResponse> {
    return this.delete<ApiResponse>(`/admin/activities/${id}`);
  }

  async getActivityParticipants(id: number): Promise<ApiResponse<ActivityParticipant[]>> {
    return this.get<ApiResponse<ActivityParticipant[]>>(`/admin/activities/${id}/participants`);
  }

  async updateActivityStatus(id: number, status: string): Promise<ApiResponse> {
    return this.put<ApiResponse>(`/admin/activities/${id}/status`, { status });
  }

  async registerActivity(id: number): Promise<ApiResponse> {
    return this.post<ApiResponse>(`/activities/${id}/register`);
  }

  async unregisterActivity(id: number): Promise<ApiResponse> {
    return this.delete<ApiResponse>(`/activities/${id}/register`);
  }

  async getActivityStats(): Promise<ApiResponse<ActivityStats>> {
    return this.get<ApiResponse<ActivityStats>>('/admin/statistics/activities');
  }
}

export const http = new Http();
export default http;

// 导出类型
export type { Work, WorkStats, Comment, CommentStats, Activity, ActivityParticipant, ActivityStats, ApiResponse, PaginatedResponse };
