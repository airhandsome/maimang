const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1';

export type LoginResponse = { access_token: string; refresh_token?: string };

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
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


