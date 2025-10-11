'use client';

import { useEffect, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ActivitiesPage() {
  const [activeFilter, setActiveFilter] = useState('全部活动');
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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

  const thumbs = [
    { id: 111, caption: '麦田诗歌朗诵现场' },
    { id: 125, caption: '写作工坊交流' },
    { id: 137, caption: '田间采风活动' },
    { id: 148, caption: '中秋诗会现场' },
    { id: 152, caption: '作者分享会' },
    { id: 167, caption: '诗歌创作现场' },
    { id: 177, caption: '作品朗诵会' },
    { id: 180, caption: '文学交流会' },
    { id: 184, caption: '自然观察活动' },
    { id: 192, caption: '书籍分享会' },
  ];
  const [mainImg, setMainImg] = useState(thumbs[0]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* 漂浮装饰元素 */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-[10%] right-[8%] text-7xl text-gold float-random" style={{animationDelay:'.5s'}}>田</div>
          <div className="absolute top-[40%] left-[5%] text-6xl text-foreground float-random" style={{animationDelay:'1s'}}>野</div>
          <div className="absolute bottom-[20%] right-[15%] text-6xl text-gold float-random" style={{animationDelay:'2s'}}>读</div>
          <div className="absolute bottom-[50%] left-[25%] text-5xl text-foreground float-random" style={{animationDelay:'3s'}}>诗</div>
        </div>

        {/* 头部横幅 */}
        <header className="relative z-10 py-16 md:py-24 px-4 overflow-hidden bg-cream wheat-pattern">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-6 text-gold text-shadow">田间活动</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-foreground">在自然的课堂里，让文字与麦穗一起生长</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['全部活动','诗歌朗诵','写作工坊','田野采风','收获分享'].map((b)=> (
                <button key={b} onClick={()=>setActiveFilter(b)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter===b? 'bg-gold text-white':'bg-white text-foreground hover:bg-yellow-100'} border ${activeFilter===b? 'border-gold':'border-yellow-200'}`}>{b}</button>
              ))}
            </div>
          </div>
        </header>

        {/* 即将举行 */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 reveal-init">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground relative inline-block">即将举行
              <span className="absolute -bottom-2 left-0 w-1/2 h-[3px] bg-gold" />
            </h2>
            <span className="hidden md:inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium">3场活动即将开始</span>
          </div>

          {/* 重点活动 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-10 hover-lift">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-2 relative h-64 lg:h-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://picsum.photos/id/132/800/600" alt="麦田诗歌节" className="w-full h-full object-cover" />
                <div className="absolute -top-4 left-6 bg-gold text-white text-sm font-bold px-3 py-1 rounded-full">10月28日</div>
                <div className="absolute top-4 right-4 bg-white/90 text-gold text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">诗歌朗诵</div>
                <div className="absolute top-4 left-4 bg-gold text-white text-xs font-bold px-2 py-1 rounded">★ 重点活动</div>
              </div>
              <div className="lg:col-span-3 p-8">
                <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-3">第六届麦田诗歌节</h3>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-foreground/70 text-sm">
                  <div>📅 2023.10.28 14:00-17:30</div>
                  <div>📍 青禾农场主会场</div>
                  <div>👤 限60人</div>
                </div>
                <p className="text-foreground/80 mb-6 leading-relaxed">第六届麦田诗歌节将在金秋时节如约而至，我们将在金色的麦浪中朗诵原创诗歌，邀请知名诗人现场点评指导……</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                  <span>⏱ 活动时长：约3.5小时</span>
                  <span>🍃 适合人群：诗歌爱好者</span>
                </div>
                <div className="mt-6">
                  <a href="#" className="inline-block bg-gold hover:bg-mint text-white font-bold px-6 py-2 rounded-full transition-transform hover:scale-105">立即报名 →</a>
                </div>
              </div>
            </div>
          </div>

          {/* 其他即将举行 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{id:110,date:'11月5日',tag:'写作工坊',title:'秋日写作工坊：收获的文字',place:'麦田书屋'},{id:129,date:'11月12日',tag:'田野采风',title:'初冬田野采风：寻找季节的痕迹',place:'清溪湿地'}].map((e)=> (
              <div key={e.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover-lift relative">
                <div className="h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://picsum.photos/id/${e.id}/600/400`} alt={e.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  <div className="absolute -top-4 left-6 bg-gold text-white text-sm font-bold px-3 py-1 rounded-full">{e.date}</div>
                  <div className="absolute top-4 right-4 bg-white/90 text-gold text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">{e.tag}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif text-foreground mb-2">{e.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 text-sm text-foreground/70">
                    <div>⏰ 10:00-12:00</div>
                    <div>📍 {e.place}</div>
                  </div>
                  <p className="text-foreground/80 mb-4 text-sm line-clamp-2">以“收获”为主题的写作工作坊，在专业作家的指导下，将秋日的感悟转化为文字，记录季节的馈赠。</p>
                  <a href="#" className="text-gold hover:text-amber-600 inline-flex items-center font-medium text-sm">查看详情 →</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 往期回顾 */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 reveal-init">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground relative inline-block">往期回顾
              <span className="absolute -bottom-2 left-0 w-1/2 h-[3px] bg-gold" />
            </h2>
            <a href="#" className="text-gold hover:text-amber-600 font-medium">查看全部活动 →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[134,142,163].map((pid, idx)=> (
              <div key={pid} className="bg-white rounded-2xl overflow-hidden shadow-sm hover-lift group">
                <div className="h-56 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://picsum.photos/id/${pid}/600/400`} alt="往期活动" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <span className="text-sm">{idx===0?'2023.04.05':idx===1?'2023.07.15':'2023.09.29'}</span>
                      <p className="font-medium">{idx===0?'共32人参与':idx===1?'共45人参与':'共58人参与'}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif text-foreground mb-2">{idx===0?'春耕诗歌会：泥土里的诗行':idx===1?'夏日读书分享会：树荫下的文字':'中秋诗会：月光下的吟诵'}</h3>
                  <p className="text-foreground/80 mb-4 text-sm line-clamp-3">{idx===0?'在播种的季节，我们来到田间地头…':idx===1?'炎炎夏日，我们在老槐树下分享…':'中秋月圆之夜，我们围坐在一起…'}</p>
                  <a href="#" className="text-gold hover:text-amber-600 inline-flex items-center font-medium text-sm">活动回顾 →</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 精彩瞬间 画廊 */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 reveal-init">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground inline-block relative">精彩瞬间
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-gold" />
            </h2>
            <p className="mt-4 text-foreground/70 max-w-2xl mx-auto">每一次相聚都是珍贵的回忆，每一个瞬间都值得被记录</p>
          </div>
          <div className="mb-6 rounded-2xl overflow-hidden shadow-sm bg-white p-2">
            <div className="aspect-video relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://picsum.photos/id/${mainImg.id}/1200/675`} alt={mainImg.caption} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">{mainImg.caption}</div>
            </div>
          </div>
          <div className="relative">
            <button onClick={()=> thumbsRef.current?.scrollBy({left:-300, behavior:'smooth'})} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gold w-10 h-10 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm transition-all">‹</button>
            <div className="overflow-x-auto pb-2 scrollbar-hide" ref={thumbsRef}>
              <div className="flex gap-3 pl-12 pr-12 min-w-max">
                {thumbs.map(t => (
                  <button key={t.id} onClick={()=> setMainImg(t)} className={`cursor-pointer w-24 h-24 rounded-lg overflow-hidden border-2 ${mainImg.id===t.id? 'border-gold':'border-transparent'} hover:border-gold hover-lift`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://picsum.photos/id/${t.id}/200/200`} alt={t.caption} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <button onClick={()=> thumbsRef.current?.scrollBy({left:300, behavior:'smooth'})} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gold w-10 h-10 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm transition-all">›</button>
          </div>
          <div className="text-center mt-8">
            <a href="#" className="inline-block border-2 border-gold text-gold hover:bg-gold hover:text-white font-medium px-6 py-2 rounded-full transition-colors">查看全部照片 →</a>
          </div>
        </section>

        {/* 报名须知 */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 reveal-init bg-yellow-100/40 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8 text-center">活动报名须知</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-serif text-foreground mb-4">报名方式</h3>
              <ul className="space-y-3 text-foreground/80">
                <li>· 点击活动详情页“立即报名”，填写个人信息</li>
                <li>· 报名成功后将收到邮件确认及活动详情</li>
                <li>· 部分户外活动需缴少量物料费，详情见说明</li>
                <li>· 名额有限，先到先得，额满即止</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-serif text-foreground mb-4">注意事项</h3>
              <ul className="space-y-3 text-foreground/80">
                <li>· 请提前15分钟签到，迟到可能影响体验</li>
                <li>· 田野活动着舒适衣物鞋子，做好防晒/防雨</li>
                <li>· 写作类活动建议携带本子或电脑</li>
                <li>· 如无法参加，请提前24小时告知</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 活动预告订阅 */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 reveal-init">
          <div className="bg-gold text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">不错过任何一场精彩活动</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">订阅我们的活动预告，第一时间获取最新活动信息，优先获得报名资格</p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input type="email" placeholder="输入你的邮箱地址" className="flex-1 px-4 py-3 rounded-full focus:outline-none text-foreground" />
              <button type="submit" className="bg-foreground hover:bg-foreground/80 text-white font-bold px-6 py-3 rounded-full transition-colors whitespace-nowrap">订阅活动预告</button>
            </form>
            <p className="text-white/70 text-sm mt-4">我们尊重你的隐私，不会向第三方分享你的信息</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}



