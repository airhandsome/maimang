const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1';

export type LoginResponse = { access_token: string; refresh_token?: string };

export async function apiLogin(account: string, password: string): Promise<LoginResponse> {
  // 暂时只支持邮箱登录，因为后端模型只有 email 字段
  // 如果输入的是手机号，提示用户使用邮箱登录
  if (!account.includes('@')) {
    throw new Error('请使用邮箱地址登录');
  }
    
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: account, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || '登录失败');
  return data as LoginResponse;
}

export async function apiRegister(name: string, email: string, password: string): Promise<{ id: number; email: string; name: string }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || '注册失败');
  return data as { id: number; email: string; name: string };
}


export async function apiMe(accessToken: string): Promise<{ uid: number; role: string }> {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || '获取用户信息失败');
  return data as { uid: number; role: string };
}

// 用户资料相关类型
export type UserProfile = {
  id: number;
  name: string;
  email: string;
  gender?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  tags?: string[];
  weibo?: string;
  wechat?: string;
  created_at: string;
  updated_at: string;
};

export type UpdateProfileRequest = {
  name?: string;
  gender?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  tags?: string[];
  weibo?: string;
  wechat?: string;
};

// 获取用户资料
export async function apiGetProfile(accessToken: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || '获取用户资料失败');
  
  // 后端返回的是 { success: true, data: {...} } 格式
  if (data.success && data.data) {
    return data.data as UserProfile;
  }
  throw new Error('获取用户资料失败');
}

// 更新用户资料
export async function apiUpdateProfile(accessToken: string, profileData: UpdateProfileRequest): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}` 
    },
    body: JSON.stringify(profileData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || '更新用户资料失败');
  
  // 后端返回的是 { success: true, data: {...} } 格式
  if (data.success && data.data) {
    return data.data as UserProfile;
  }
  throw new Error('更新用户资料失败');
}

// 上传头像
export async function apiUploadAvatar(accessToken: string, file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const res = await fetch(`${API_BASE}/upload/avatar`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${accessToken}` 
    },
    body: formData
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || '头像上传失败');
  
  // 后端返回格式: { success: true, data: { url: "..." } }
  if (data.success && data.data && data.data.url) {
    return { url: data.data.url };
  }
  
  throw new Error('头像上传响应格式错误');
}


