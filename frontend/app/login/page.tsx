"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiLogin } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif text-leaf inline-block relative">
          社员登录
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gold" />
        </h1>
        <p className="mt-4 text-leaf/80 max-w-2xl mx-auto">加入我们的文学社区，分享你的创作与感悟</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm hover-lift hover:rotate-1">
          <h3 className="text-2xl font-serif text-leaf mb-6">已有账号？登录</h3>
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-leaf mb-2">电子邮箱</label>
              <input className="w-full bg-cream border border-gold/30 text-leaf p-3 rounded-lg form-focus" placeholder="请输入你的邮箱" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-leaf mb-2">密码</label>
              <input className="w-full bg-cream border border-gold/30 text-leaf p-3 rounded-lg form-focus" placeholder="请输入你的密码" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center text-leaf/80">
                <input type="checkbox" className="mr-2" /> 记住我
              </label>
              <a href="#" className="text-gold hover:underline">忘记密码？</a>
            </div>
            <button disabled={loading} className="w-full bg-gold hover:bg-mint text-white font-bold py-3 rounded-lg transition-transform hover:scale-[1.02]">
              {loading ? "登录中..." : "登录账号"}
            </button>
          </form>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm hover-lift hover:rotate-1">
          <h3 className="text-2xl font-serif text-leaf mb-6">新用户？注册</h3>
          <p className="text-leaf/80 mb-4">还没有账户？现在前往注册</p>
          <a href="/register" className="inline-block bg-gold hover:bg-mint text-white font-bold px-6 py-3 rounded-lg transition-transform hover:scale-[1.02]">去注册</a>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}


