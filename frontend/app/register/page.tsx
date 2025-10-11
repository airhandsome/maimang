"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRegister } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRegister(name, email, password);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "注册失败");
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
          新用户注册
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gold" />
        </h1>
        <p className="mt-4 text-leaf/80 max-w-2xl mx-auto">创建你的麦芒账号，开始在文学的田野里创作与交流</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm hover-lift hover:rotate-1">
          <h3 className="text-2xl font-serif text-leaf mb-6">填写信息</h3>
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-leaf mb-2">你的笔名</label>
              <input className="w-full bg-cream border border-gold/30 text-leaf p-3 rounded-lg form-focus" placeholder="你在文学社的笔名" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-leaf mb-2">电子邮箱</label>
              <input className="w-full bg-cream border border-gold/30 text-leaf p-3 rounded-lg form-focus" placeholder="用于登录和通知" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-leaf mb-2">设置密码（至少 6 位）</label>
              <input className="w-full bg-cream border border-gold/30 text-leaf p-3 rounded-lg form-focus" placeholder="至少 6 位" type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
            </div>
            <label className="flex items-start text-leaf/80">
              <input type="checkbox" className="mt-1 mr-2" />
              <span>我已阅读并同意 <a href="#" className="text-gold hover:underline">社员协议</a> 与 <a href="#" className="text-gold hover:underline">隐私政策</a></span>
            </label>
            <button disabled={loading} className="w-full bg-gold hover:bg-mint text-white font-bold py-3 rounded-lg transition-transform hover:scale-[1.02]">{loading ? "注册中..." : "创建账号"}</button>
          </form>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm hover-lift hover:rotate-1">
          <h3 className="text-2xl font-serif text-leaf mb-6">已有账号？</h3>
          <p className="text-leaf/80 mb-4">直接前往登录以继续你的创作之旅</p>
          <a href="/login" className="inline-block bg-gold hover:bg-mint text-white font-bold px-6 py-3 rounded-lg transition-transform hover:scale-[1.02]">去登录</a>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}


