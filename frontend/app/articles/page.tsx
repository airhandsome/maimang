'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import http from '@/lib/http';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  categoryId: string;
  coverImage: string;
  publishDate: string;
  views: number;
  likes: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<'latest'|'popular'>('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, categoriesData] = await Promise.all([
          http.get<Article[]>('/articles'),
          http.get<Category[]>('/categories'),
        ]);
        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // scroll reveal for sections
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

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.categoryId === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a,b)=> sortKey==='latest' ? (new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()) : (b.views - a.views));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* 漂浮装饰元素 */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-[15%] left-[5%] text-6xl text-gold float-random">诗</div>
          <div className="absolute top-[35%] right-[10%] text-5xl text-foreground float-random" style={{animationDelay:'1s'}}>文</div>
          <div className="absolute bottom-[30%] left-[20%] text-7xl text-gold float-random" style={{animationDelay:'2s'}}>字</div>
          <div className="absolute bottom-[40%] right-[15%] text-4xl text-gold float-random" style={{animationDelay:'3s'}}>章</div>
          <div className="absolute top-[60%] left-[10%] text-5xl text-foreground float-random" style={{animationDelay:'1.5s'}}>篇</div>
          <div className="absolute top-[25%] right-[20%] text-6xl text-gold float-random" style={{animationDelay:'2.5s'}}>句</div>
        </div>
        <div className="bg-cream wheat-pattern py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h1 className="text-5xl font-serif text-gold text-shadow mb-4">青春的文字 · 收获的季节</h1>
            <p className="text-lg text-foreground/80">每一篇作品都是青春的印记，每一个文字都承载着成长的力量</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 reveal-init">
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索文章标题或内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <button onClick={()=>setSelectedCategory('all')} className={`px-4 py-2 rounded-full text-sm border transition-colors ${selectedCategory==='all' ? 'bg-gold text-white border-gold' : 'bg-white text-foreground hover:bg-yellow-100 border-gold/30'}`}>全部</button>
                {categories.map((c)=> (
                  <button key={c.id} onClick={()=>setSelectedCategory(c.id)} className={`px-4 py-2 rounded-full text-sm border transition-colors ${selectedCategory===c.id ? 'bg-gold text-white border-gold' : 'bg-white text-foreground hover:bg-yellow-100 border-gold/30'}`}>
                    {c.name}（{c.count}）
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-foreground/60">排序:</span>
                <button onClick={()=>setSortKey('latest')} className={`px-3 py-1 rounded-full border ${sortKey==='latest'?'bg-gold text-white border-gold':'bg-white border-gold/30 hover:bg-yellow-100'}`}>最新</button>
                <button onClick={()=>setSortKey('popular')} className={`px-3 py-1 rounded-full border ${sortKey==='popular'?'bg-gold text-white border-gold':'bg-white border-gold/30 hover:bg-yellow-100'}`}>热度</button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse rounded-2xl">
                  <div className="h-48 bg-gray-200" />
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无相关文章</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`}>
                  <Card className="overflow-hidden hover-lift hover:rotate-1 h-full rounded-2xl">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-amber-500 text-white border-0">
                          {article.category}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl font-bold line-clamp-2 mb-2 font-serif">
                        {article.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </CardHeader>

                    <CardFooter className="flex items-center justify-between pt-0">
                      <div className="flex items-center gap-4 text-xs text-foreground/70">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.views}</span>
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {article.likes}</span>
                      </div>
                      <span className="text-xs text-foreground/70">{article.author} · {new Date(article.publishDate).toLocaleDateString()}</span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 本月精选 */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 reveal-init">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground inline-block relative">本月精选
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-gold" />
            </h2>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://picsum.photos/id/117/800/600" alt="本月精选作品" className="w-full h-full object-cover img-fade" onLoad={(e)=>e.currentTarget.classList.add('loaded')} />
                <div className="absolute top-4 left-4"><span className="px-4 py-2 bg-gold text-white text-sm rounded-full">编辑推荐</span></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-3">《季节的笔迹》</h3>
                <p className="text-gold mb-4">作者：青禾 | 2023.10 | 散文</p>
                <p className="text-foreground/80 mb-6 leading-relaxed">春风是第一支笔，轻轻划过解冻的土地，写下萌芽的诗行……</p>
                <a href="#" className="inline-block bg-gold hover:bg-mint text-white font-bold px-6 py-2 rounded-full transition-transform hover:scale-105">阅读完整作品</a>
              </div>
            </div>
          </div>
        </section>

        {/* 作者专栏 */}
        <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8 reveal-init">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground inline-block relative">作者专栏
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-gold" />
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[64,65,91].map((pid, idx)=>(
              <div key={pid} className="bg-white p-6 rounded-xl shadow-sm hover-lift text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-yellow-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://picsum.photos/id/${pid}/200/200`} alt="作者头像" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-1">{idx===0?'风之子':idx===1?'麦小穗':'禾火'}</h3>
                <p className="text-gold text-sm mb-3">{idx===0?'诗歌创作者 | 28篇作品':idx===1?'散文作家 | 19篇作品':'小说创作者 | 12篇作品'}</p>
                <p className="text-foreground/70 mb-4 text-sm">{idx===0?'"我在风中收集词语，让它们像蒲公英一样，随风飘散到该去的地方。"':idx===1?'"从生活的土壤中汲取养分，让文字像麦穗一样，饱满而真实。"':'"用故事点燃想象，让每个角色都拥有自己的温度和光芒。"'}</p>
                <a href="#" className="text-gold hover:text-amber-600 inline-flex items-center text-sm font-medium">查看全部作品 <ArrowRight className="ml-1 h-4 w-4" /></a>
              </div>
            ))}
          </div>
        </section>

        {/* 分页 */}
        <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 flex justify-center items-center gap-2 reveal-init">
          <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gold/30 text-foreground hover:bg-gold hover:text-white transition-colors">‹</a>
          {[1,2,3].map((p)=> (
            <a key={p} href="#" className={`w-10 h-10 flex items-center justify-center rounded-full ${p===1? 'bg-gold text-white':'border border-gold/30 text-foreground hover:bg-gold hover:text-white'}`}>{p}</a>
          ))}
          <span className="text-foreground/50">…</span>
          <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gold/30 text-foreground hover:bg-gold hover:text-white transition-colors">8</a>
          <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gold/30 text-foreground hover:bg-gold hover:text-white transition-colors">›</a>
        </div>

        {/* 投稿 CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 reveal-init">
          <div className="bg-yellow-100/40 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">分享你的文字</h2>
            <p className="text-foreground/80 mb-8 text-lg">如果你也有想要表达的故事和情感，欢迎向我们投稿，让更多人听见你的声音</p>
            <Link href="/submit" className="inline-block bg-gold hover:bg-mint text-white font-bold px-8 py-3 rounded-full transition-transform hover:scale-105">我要投稿</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
