'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Users, BookOpen, Heart, Eye, Sparkles, Tag } from 'lucide-react';
import http from '@/lib/http';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  coverImage: string;
  publishDate: string;
  views: number;
  likes: number;
  featured: boolean;
}

interface Stats {
  totalArticles: number;
  totalViews: number;
  totalMembers: number;
  totalLikes: number;
}

interface Category { id: string; name: string; count?: number }

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [carousels, setCarousels] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articles, statsData, cats, carouselsData, announcementsData, siteSettingsData] = await Promise.all([
          http.get<Article[]>('/articles/featured'),
          http.get<Stats>('/stats'),
          http.get<Category[]>('/categories'),
          http.get<any[]>('/carousels'),
          http.get<any[]>('/announcements'),
          http.get<any>('/settings'),
        ]);
        setFeaturedArticles(articles);
        setStats(statsData);
        setCategories(cats);
        setCarousels(carouselsData || []);
        setAnnouncements((announcementsData as any)?.data || announcementsData || []);
        // 公开系统设置
        if ((siteSettingsData as any)?.data) setSiteSettings((siteSettingsData as any).data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // scroll reveal
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('reveal-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal-init').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // 将 /uploads/... 补全为后端完整地址
  const toAssetUrl = (url?: string) => {
    if (!url) return '';
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1';
    const backendOrigin = apiBase.replace(/\/api\/v1$/, '');
    return url.startsWith('/uploads') ? `${backendOrigin}${url}` : url;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* 漂浮装饰元素 */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[8%] left-[3%] text-5xl text-gold float-random">麦</div>
          <div className="absolute top-[25%] right-[8%] text-4xl text-leaf float-random" style={{animationDelay:'1s'}}>芒</div>
          <div className="absolute bottom-[25%] left-[15%] text-6xl text-mint float-random" style={{animationDelay:'2s'}}>青</div>
          <div className="absolute bottom-[35%] right-[12%] text-3xl text-gold float-random" style={{animationDelay:'3s'}}>春</div>
          <div className="absolute top-[55%] left-[8%] text-4xl text-leaf float-random" style={{animationDelay:'1.5s'}}>收</div>
          <div className="absolute top-[15%] right-[18%] text-5xl text-mint float-random" style={{animationDelay:'2.5s'}}>获</div>
        </div>
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-green-50 wheat-pattern">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-amber-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                <span>用文字收获青春</span>
              </div>

              <h1 className="text-5xl sm:text-7xl mb-6 font-serif text-gold text-shadow">
                <span className="block -rotate-1">{siteSettings?.siteName || '青春如穗'}</span>
                <span className="block rotate-1 text-gray-900">{siteSettings?.siteDescription || '文字如芒'}</span>
              </h1>

              <p className="text-lg leading-relaxed text-gray-600 mb-8">
                {siteSettings?.siteDescription || (
                  <>这里是青年作家的精神家园，是文学梦想的起航之地。<br/>像麦芒一样锋芒毕露，用文字记录时代，用故事温暖人心。</>
                )}
              </p>

              <div className="flex items-center justify-center gap-4">
                <Link href="/articles">
                  <Button size="lg" className="gradient-harvest text-white hover:opacity-90 transition-opacity">
                    探索作品
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    了解我们
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    联系我们
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-6 pb-20 text-center">
            <h3 className="text-2xl md:text-3xl font-serif text-gray-800 leading-relaxed">
              青春如穗，文字如芒
            </h3>
            <p className="mt-3 text-lg text-gray-700">
              我们在文字的田野里播种、生长、收获，让每一个字符都带着阳光的温度
            </p>
          </div>
        </section>

        {/* 公告条 */}
        {announcements && (announcements as any[]).length > 0 && (
          <div className="bg-yellow-50 border-y border-yellow-100">
            <div className="mx-auto max-w-7xl px-6 py-3 text-sm text-yellow-800 flex items-center gap-2">
              <span className="font-semibold">最新公告：</span>
              <a href="#" className="hover:underline line-clamp-1">{(announcements as any[])[0].Title || (announcements as any[])[0].title}</a>
            </div>
          </div>
        )}

        {/* 轮播区域：横向滚动展示所有条目 */}
        {carousels && (carousels as any[]).length > 0 && (
          <section className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
              <div className="relative overflow-hidden rounded-xl shadow-sm">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory">
                  {(carousels as any[]).map((c, i) => (
                    <a key={i} href={c.LinkURL || c.link_url || '#'} className="min-w-full snap-start block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={toAssetUrl(c.ImageURL || c.image_url)} alt={c.Title || c.title || ''} className="w-full h-64 object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 我们的故事 */}
        <section id="about" className="py-20 bg-cream wheat-pattern reveal-init">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif text-leaf inline-block relative text-shadow">
                我们的故事
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gold" />
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-serif text-gold mb-4">麦芒的意义</h3>
                <p className="mb-4 leading-relaxed text-lg text-leaf/90">
                  麦芒是麦穗上守护果实的锋芒，既坚韧又温柔。我们相信文字也该如此——带着青春的锐气，又饱含成长的温度。
                </p>
                <p className="mb-8 leading-relaxed text-lg text-leaf/90">
                  自 2018 年的金色秋天起，我们在这片田野里相遇，让每一个文字都像麦粒般饱满，像麦芒般真诚。
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-5 rounded-xl shadow-sm hover-lift">
                    <div className="text-3xl text-gold mb-2">500+</div>
                    <p className="text-leaf font-medium">原创作品</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl shadow-sm hover-lift">
                    <div className="text-3xl text-mint mb-2">120+</div>
                    <p className="text-leaf font-medium">社员</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl shadow-sm hover-lift">
                    <div className="text-3xl text-leaf mb-2">45+</div>
                    <p className="text-leaf font-medium">田野活动</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-[360px] rounded-xl overflow-hidden shadow-md rotate-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://picsum.photos/id/119/600/800" alt="麦芒文学社活动" className="w-full h-full object-cover img-fade" onLoad={(e)=>e.currentTarget.classList.add('loaded')} />
                </div>
                <div className="hidden md:block absolute -bottom-6 -left-6 w-36 h-36 rounded-xl overflow-hidden shadow-md -rotate-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://picsum.photos/id/120/300/300" alt="文学社细节" className="w-full h-full object-cover img-fade" onLoad={(e)=>e.currentTarget.classList.add('loaded')} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 文字的果实 */}
        <section id="works" className="py-20 bg-white reveal-init">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif text-leaf inline-block relative">
                文字的果实
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-mint" />
              </h2>
              <p className="mt-4 text-leaf/80 max-w-2xl mx-auto text-lg">每一篇作品都是我们在青春田野里收获的果实</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[118,164,122].map((id, idx)=> (
                <div key={id} className={`bg-white rounded-xl overflow-hidden shadow-sm hover-lift hover:rotate-1 ${idx===1 ? 'md:translate-y-3' : ''}`}>
                  <div className="h-52 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://picsum.photos/id/${id}/600/400`} alt="作品配图" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 img-fade" onLoad={(e)=>e.currentTarget.classList.add('loaded')} />
                    <div className="absolute inset-0 bg-gradient-to-t from-leaf/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-gold/90 text-white text-sm rounded-full">{idx===0? '诗歌': idx===1? '散文': '小说'}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif text-leaf mb-2">{idx===0? '《麦田上的云》': idx===1? '《晒谷场的黄昏》': '《稻草人日记》'}</h3>
                    <p className="text-sm text-gold mb-3">作者：{idx===0? '风之子': idx===1? '麦小穗': '禾火'} | 2023</p>
                    <p className="text-gray-600 mb-4 line-clamp-3">在金色与微风之间，我们把青春写成诗，把热爱酿成果实。</p>
                    <a href="#" className="text-gold hover:text-leaf inline-flex items-center font-medium">阅读全文 <ArrowRight className="ml-1 h-4 w-4" /></a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 text-center">
              <Link href="/articles" className="inline-block border-2 border-gold text-gold hover:bg-gold hover:text-white px-6 py-3 rounded-full transition-transform hover:rotate-1 font-medium">
                查看更多收获 <ArrowRight className="inline-block ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 田间活动 时间线式布局 */}
        <section id="activities" className="py-20 bg-cream wheat-pattern reveal-init">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif text-leaf inline-block relative text-shadow">
                田间活动
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gold" />
              </h2>
              <p className="mt-4 text-leaf/80 max-w-2xl mx-auto text-lg">在自然中寻找灵感，在交流中共同成长</p>
            </div>
            <div className="relative">
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1.5 bg-mint" />
              {/* 活动 1 */}
              <div className="relative z-10 mb-16">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right order-2 md:order-1">
                    <span className="inline-block px-3 py-1 bg-gold text-white text-sm mb-3 rotate-1 rounded-full">即将开始</span>
                    <h3 className="text-2xl font-serif text-leaf mb-3">麦田诗歌朗诵会</h3>
                    <p className="text-gray-700 mb-4 text-lg">在金黄的麦田边，让诗歌随麦浪一起起伏。我们朗读原创诗歌，让自然成为最好的背景音乐。</p>
                    <div className="flex items-center justify-end gap-6 text-gold">
                      <span>6.18 周六</span>
                      <span>城郊麦田</span>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <div className="w-full h-64 rounded-xl overflow-hidden shadow-sm -rotate-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://picsum.photos/id/106/600/400" alt="麦田诗歌朗诵会" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 img-fade" onLoad={(e)=>e.currentTarget.classList.add('loaded')} />
                    </div>
                  </div>
                </div>
              </div>
              {/* 活动 2 */}
              <div className="relative z-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-full h-64 rounded-xl overflow-hidden shadow-sm rotate-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://picsum.photos/id/132/600/400" alt="晒谷场创作工作坊" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 img-fade" onLoad={(e)=>e.currentTarget.classList.add('loaded')} />
                    </div>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-mint text-white text-sm mb-3 -rotate-1 rounded-full">即将开始</span>
                    <h3 className="text-2xl font-serif text-leaf mb-3">晒谷场创作工作坊</h3>
                    <p className="text-gray-700 mb-4 text-lg">以“收获”为主题，在传统晒谷场进行集体创作。用自然材料拼贴诗句，让文字与大地产生连接。</p>
                    <div className="flex items-center gap-6 text-gold">
                      <span>7.2 周六</span>
                      <span>老谷场文创园</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 播下你的种子 - 表单 */}
        <section id="join" className="py-20 bg-white reveal-init">
          <div className="mx-auto max-w-4xl px-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden diagonal-cut border border-gold/30">
              <div className="p-8 md:p-12 relative">
                <h2 className="text-4xl font-serif text-center mb-8 text-leaf">播下你的种子</h2>
                <p className="text-center mb-8 text-gray-700 max-w-2xl mx-auto">每一个热爱文字的人都是一粒种子，加入我们，在这片文学的田野里扎根、生长</p>
                <form className="grid gap-6">
                  <div>
                    <label className="block text-leaf mb-2 font-medium">你的名字</label>
                    <input className="w-full bg-cream border border-gold/30 focus:border-gold text-leaf p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all" placeholder="像麦穗一样独特的名字" />
                  </div>
                  <div>
                    <label className="block text-leaf mb-2 font-medium">什么让你像麦芒一样锋芒毕露？</label>
                    <textarea rows={3} className="w-full bg-cream border border-gold/30 focus:border-gold text-leaf p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all" placeholder="是某本书、某个瞬间，还是对世界的好奇？" />
                  </div>
                  <div>
                    <label className="block text-leaf mb-2 font-medium">用三个词描述你和文字的关系</label>
                    <input className="w-full bg-cream border border-gold/30 focus:border-gold text-leaf p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all" placeholder="例如：共生/记录/表达" />
                  </div>
                  <button className="w-full bg-mint hover:bg-leaf text-white font-bold py-3 rounded-lg transition-transform hover:scale-[1.02]">种下我的文字种子</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
