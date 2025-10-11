"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiLogin, apiRegister } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  
  // 登录表单状态
  const [loginAccount, setLoginAccount] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // 注册表单状态
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerAgreement, setRegisterAgreement] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  
  // 表单切换状态
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // 登录表单提交
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    
    if (!loginAccount || !loginAccount.includes('@')) {
      setLoginError('请输入正确的邮箱地址');
      setLoginLoading(false);
      return;
    }
    
    if (!loginPassword) {
      setLoginError('请输入密码');
      setLoginLoading(false);
      return;
    }
    
    try {
      const data = await apiLogin(loginAccount, loginPassword);
      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
      router.push("/");
    } catch (err: any) {
      setLoginError(err.message || "登录失败");
    } finally {
      setLoginLoading(false);
    }
  };

  // 注册表单提交
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    
    if (!registerEmail || !registerEmail.includes('@')) {
      setRegisterError('请输入正确的邮箱地址');
      setRegisterLoading(false);
      return;
    }
    
    if (!registerPassword || registerPassword.length < 6 || registerPassword.length > 16) {
      setRegisterError('请设置6-16位的密码');
      setRegisterLoading(false);
      return;
    }
    
    if (!registerName) {
      setRegisterError('请设置你的昵称');
      setRegisterLoading(false);
      return;
    }
    
    if (!registerAgreement) {
      setRegisterError('请阅读并同意用户协议和隐私政策');
      setRegisterLoading(false);
      return;
    }
    
    try {
      await apiRegister(registerName, registerEmail, registerPassword);
      alert('注册成功，请登录');
      setShowRegisterForm(false);
      // 清空注册表单
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterName('');
      setRegisterAgreement(false);
    } catch (error: any) {
      setRegisterError(error.message || '注册失败');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 主内容区 */}
      <main className="flex-grow relative z-10 container mx-auto px-4 py-12 md:py-20 bg-cream wheat-pattern">
        {/* 漂浮装饰元素 */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-[20%] right-[15%] text-7xl font-display text-gold animate-float" style={{animationDelay: '0.5s'}}>登</div>
          <div className="absolute top-[40%] left-[10%] text-6xl font-display text-text animate-float" style={{animationDelay: '1s'}}>录</div>
          <div className="absolute bottom-[30%] right-[8%] text-6xl font-display text-gold animate-float" style={{animationDelay: '2s'}}>注</div>
          <div className="absolute bottom-[50%] left-[25%] text-5xl font-display text-text animate-float" style={{animationDelay: '3s'}}>册</div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display text-gold mb-4">
              加入麦芒的文字田野
            </h1>
            <p className="text-lg text-text/80 max-w-2xl mx-auto">
              登录你的账号，开始记录灵感，参与活动，与志同道合的文友相遇
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 登录表单 */}
            <div className={`bg-white rounded-2xl shadow-md p-8 card-lift ${showRegisterForm ? 'hidden' : ''}`}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-display text-text">账号登录</h2>
                <p className="text-text/60 mt-1">欢迎回来，继续你的文学之旅</p>
              </div>
              
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {loginError && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{loginError}</div>}
                
                <div>
                  <label htmlFor="login-account" className="block text-text font-medium mb-2">邮箱地址</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50">
                      <i className="fa fa-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      id="login-account" 
                      placeholder="请输入邮箱地址" 
                      value={loginAccount}
                      onChange={(e) => setLoginAccount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-wheat input-focus"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="login-password" className="block text-text font-medium mb-2">密码</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50">
                      <i className="fa fa-lock"></i>
                    </span>
                    <input 
                      type={showLoginPassword ? "text" : "password"} 
                      id="login-password" 
                      placeholder="请输入密码" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-wheat input-focus"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/50"
                    >
                      <i className={`fa ${showLoginPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <label className="flex items-center text-sm text-text/70">
                    <input type="checkbox" className="mr-2" />
                    <span>记住我</span>
                  </label>
                  <a href="#" className="text-sm text-gold hover:text-goldDark transition-colors">忘记密码？</a>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loginLoading}
                  className="w-full bg-gold hover:bg-goldDark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loginLoading ? "登录中..." : "登录账号"}
                </button>
                
                <div className="text-center text-text/60 text-sm">
                  还没有账号？ <button type="button" onClick={() => setShowRegisterForm(true)} className="text-gold hover:underline">立即注册</button>
                </div>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-center text-text/60 text-sm mb-4">或使用以下方式登录</p>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-[#07C160]/10 flex items-center justify-center text-[#07C160] hover:bg-[#07C160]/20 transition-colors">
                    <i className="fa fa-weixin"></i>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors">
                    <i className="fa fa-qq"></i>
                  </a>
                </div>
              </div>
            </div>
            
            {/* 注册表单 */}
            <div className={`bg-white rounded-2xl shadow-md p-8 card-lift ${!showRegisterForm ? 'hidden' : ''}`}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-display text-text">账号注册</h2>
                <p className="text-text/60 mt-1">加入我们，开启你的文学创作之旅</p>
              </div>
              
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                {registerError && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{registerError}</div>}
                
                <div>
                  <label htmlFor="register-email" className="block text-text font-medium mb-2">邮箱地址</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50">
                      <i className="fa fa-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      id="register-email" 
                      placeholder="请输入邮箱地址" 
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-wheat input-focus"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="register-password" className="block text-text font-medium mb-2">设置密码</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50">
                      <i className="fa fa-lock"></i>
                    </span>
                    <input 
                      type={showRegisterPassword ? "text" : "password"} 
                      id="register-password" 
                      placeholder="请设置密码（6-16位）" 
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-wheat input-focus"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/50"
                    >
                      <i className={`fa ${showRegisterPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="register-name" className="block text-text font-medium mb-2">昵称</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50">
                      <i className="fa fa-user-circle"></i>
                    </span>
                    <input 
                      type="text" 
                      id="register-name" 
                      placeholder="请设置你的昵称" 
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-wheat input-focus"
                    />
                  </div>
                </div>
                
                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    id="register-agreement" 
                    checked={registerAgreement}
                    onChange={(e) => setRegisterAgreement(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="register-agreement" className="text-sm text-text/70">
                    我已阅读并同意<a href="#" className="text-gold hover:underline">用户协议</a>和<a href="#" className="text-gold hover:underline">隐私政策</a>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  disabled={registerLoading}
                  className="w-full bg-gold hover:bg-goldDark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {registerLoading ? "注册中..." : "注册账号"}
                </button>
                
                <div className="text-center text-text/60 text-sm">
                  已有账号？ <button type="button" onClick={() => setShowRegisterForm(false)} className="text-gold hover:underline">立即登录</button>
                </div>
              </form>
            </div>
          </div>
          
          {/* 社员专属入口 */}
          <div className="mt-10 bg-gold/5 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h3 className="text-xl font-display text-text mb-2">正式社员通道</h3>
                <p className="text-text/70 max-w-md">
                  如果你是麦芒文学社正式社员，请通过专属通道登录，获取更多社员权益
                </p>
              </div>
              <a href="#" className="inline-block bg-gold hover:bg-goldDark text-white font-bold px-6 py-3 rounded-full transition-all transform hover:scale-105">
                社员专属登录 <i className="fa fa-id-card-o ml-1"></i>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


