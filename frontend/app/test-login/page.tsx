import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TestLoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-cream">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h1 className="text-3xl font-display text-gold mb-8 text-center">
              登录注册功能测试
            </h1>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                <h2 className="text-xl font-semibold text-yellow-800 mb-2">测试说明</h2>
                <p className="text-yellow-700">
                  此页面用于测试登录注册功能的跳转和链接是否正常工作。
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">登录功能测试</h3>
                  <div className="space-y-3">
                    <Link 
                      href="/login" 
                      className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg transition-colors"
                    >
                      直接登录页面
                    </Link>
                    <p className="text-sm text-gray-600">
                      点击后应该显示登录表单
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">注册功能测试</h3>
                  <div className="space-y-3">
                    <Link 
                      href="/login?mode=register" 
                      className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded-lg transition-colors"
                    >
                      注册页面（带参数）
                    </Link>
                    <p className="text-sm text-gray-600">
                      点击后应该自动切换到注册表单
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">用户协议测试</h3>
                  <div className="space-y-3">
                    <Link 
                      href="/agreement" 
                      className="block w-full bg-purple-500 hover:bg-purple-600 text-white text-center py-2 px-4 rounded-lg transition-colors"
                    >
                      查看用户协议
                    </Link>
                    <p className="text-sm text-gray-600">
                      点击后应该打开用户协议页面
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">隐私政策测试</h3>
                  <div className="space-y-3">
                    <Link 
                      href="/privacy" 
                      className="block w-full bg-indigo-500 hover:bg-indigo-600 text-white text-center py-2 px-4 rounded-lg transition-colors"
                    >
                      查看隐私政策
                    </Link>
                    <p className="text-sm text-gray-600">
                      点击后应该打开隐私政策页面
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">功能验证清单</h3>
                <ul className="space-y-2 text-blue-700">
                  <li>✅ 导航栏注册按钮跳转到登录页面并自动切换到注册表单</li>
                  <li>✅ 登录页面支持 URL 参数自动切换表单</li>
                  <li>✅ 用户协议链接指向实际页面</li>
                  <li>✅ 隐私政策链接指向实际页面</li>
                  <li>✅ 移动端菜单包含登录/注册选项</li>
                  <li>✅ 所有链接在新标签页中打开</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}