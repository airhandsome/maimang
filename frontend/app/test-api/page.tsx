'use client';

import { useState } from 'react';
import { http } from '@/lib/http';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testWorksApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await http.getWorks({ page: 1, per_page: 5 });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testWorkStatsApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await http.getWorkStats();
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testPendingWorksApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await http.getPendingWorks({ page: 1, per_page: 5 });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API 测试页面</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">测试说明</h2>
          <p className="text-gray-600 mb-4">
            请先使用管理员账号登录：<br/>
            邮箱：admin@maimang.com<br/>
            密码：admin123
          </p>
          <p className="text-sm text-gray-500">
            当前token: {typeof window !== 'undefined' ? localStorage.getItem('access_token')?.substring(0, 20) + '...' : 'N/A'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={testWorksApi}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            测试作品列表API
          </button>
          
          <button
            onClick={testWorkStatsApi}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            测试作品统计API
          </button>
          
          <button
            onClick={testPendingWorksApi}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            测试待审核作品API
          </button>
        </div>

        {loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
            请求中...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <strong>错误：</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            <strong>成功：</strong>
            <pre className="mt-2 text-sm overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}