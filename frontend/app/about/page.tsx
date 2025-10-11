"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 漂浮装饰元素 */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[15%] right-[10%] text-7xl font-display text-gold float-random" style={{animationDelay: '0.5s'}}>文</div>
        <div className="absolute top-[30%] left-[8%] text-6xl font-display text-text float-random" style={{animationDelay: '1s'}}>学</div>
        <div className="absolute bottom-[30%] right-[12%] text-6xl font-display text-gold float-random" style={{animationDelay: '2s'}}>梦</div>
        <div className="absolute bottom-[40%] left-[20%] text-5xl font-display text-text float-random" style={{animationDelay: '3s'}}>想</div>
      </div>

      <Header />

      {/* 头部区域 */}
      <header className="relative z-10 py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-cream/90"></div>
          <img src="https://picsum.photos/id/175/1920/1080" alt="关于我们背景" className="w-full h-full object-cover object-center opacity-30" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display leading-tight mb-6 text-gold text-shadow">
            关于我们
          </h1>
          <p className="text-xl md:text-2xl font-sans max-w-2xl mx-auto mb-8 text-text">
            青春如穗，文字如芒。我们在文字的田野里，播种、生长、收获。
          </p>
          <div className="inline-block bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
            <p className="text-text/80"><i className="fa fa-calendar text-gold mr-2"></i> 成立于2018年 · 已有5年历程 · 300+社员</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* 社团简介 */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display text-text inline-block relative mb-10">
              社团简介
              <span className="absolute -bottom-3 left-0 w-1/2 h-1 bg-gold"></span>
            </h2>
            
            <div className="bg-white rounded-2xl shadow-md p-8 md:p-10 hover-lift">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  <div className="rounded-xl overflow-hidden h-64 md:h-full">
                    <img src="https://picsum.photos/id/169/600/800" alt="麦芒文学社" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-text/80 mb-6 leading-relaxed">
                    麦芒文学社成立于2018年，是一个以自然为灵感源泉，以文字为表达媒介的青年文学社团。我们相信，最真挚的文字往往来自对生活最本真的观察与体验。
                  </p>
                  <p className="text-text/80 mb-6 leading-relaxed">
                    "麦芒"象征着我们的理念：如同麦穗上的芒刺，虽微小却坚韧，虽朴素却闪耀着阳光的光泽。我们鼓励社员走出书房，走进田野，在自然中寻找创作的灵感。
                  </p>
                  <p className="text-text/80 leading-relaxed">
                    五年来，我们组织了近百场文学活动，出版了6本社员作品集，培养了众多青年作者。我们的作品多以自然、乡村、青春为主题，形成了独特的创作风格。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 我们的理念 */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-text inline-block relative">
              我们的理念
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gold"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* 理念1 */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 hover-lift text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 mx-auto">
                <i className="fa fa-leaf text-gold text-2xl"></i>
              </div>
              <h3 className="text-xl font-display text-text mb-4">源于自然</h3>
              <p className="text-text/80 leading-relaxed">
                我们相信自然是最好的老师和灵感来源，鼓励社员在田野、山林、溪边寻找创作的素材与感动。
              </p>
            </div>
            
            {/* 理念2 */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 hover-lift text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 mx-auto">
                <i className="fa fa-pencil text-gold text-2xl"></i>
              </div>
              <h3 className="text-xl font-display text-text mb-4">忠于内心</h3>
              <p className="text-text/80 leading-relaxed">
                文字是内心的镜子，我们鼓励真诚的表达，反对空洞的技巧，让每一个字都承载真实的情感。
              </p>
            </div>
            
            {/* 理念3 */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 hover-lift text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 mx-auto">
                <i className="fa fa-users text-gold text-2xl"></i>
              </div>
              <h3 className="text-xl font-display text-text mb-4">成于社群</h3>
              <p className="text-text/80 leading-relaxed">
                文学创作不是孤独的旅程，通过交流、分享与互助，我们一起成长，共同进步。
              </p>
            </div>
          </div>
        </section>

        {/* 发展历程 */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display text-text inline-block relative mb-10">
              发展历程
              <span className="absolute -bottom-3 left-0 w-1/2 h-1 bg-gold"></span>
            </h2>
            
            <div className="relative pl-10 md:pl-16">
              {/* 2018年 */}
              <div className="mb-12 relative timeline-dot timeline-line">
                <h3 className="text-xl font-display text-gold mb-3">2018年 · 诞生</h3>
                <div className="bg-white rounded-xl shadow-md p-6 hover-lift">
                  <p className="text-text/80">
                    由8名热爱文学与自然的青年学生发起成立，在校园内举办了首场"春日读诗会"，吸引了30余名文学爱好者参与。
                  </p>
                </div>
              </div>
              
              {/* 2019年 */}
              <div className="mb-12 relative timeline-dot timeline-line">
                <h3 className="text-xl font-display text-gold mb-3">2019年 · 成长</h3>
                <div className="bg-white rounded-xl shadow-md p-6 hover-lift">
                  <p className="text-text/80">
                    社员增至80人，首次走出校园举办"田野采风"活动，出版第一本社员作品集《麦尖上的诗》，获得当地文学界关注。
                  </p>
                </div>
              </div>
              
              {/* 2021年 */}
              <div className="mb-12 relative timeline-dot timeline-line">
                <h3 className="text-xl font-display text-gold mb-3">2021年 · 突破</h3>
                <div className="bg-white rounded-xl shadow-md p-6 hover-lift">
                  <p className="text-text/80">
                    举办首届"麦田诗歌节"，吸引周边城市文学爱好者参与，社员作品开始在省级文学刊物发表，社团影响力扩大。
                  </p>
                </div>
              </div>
              
              {/* 2023年 */}
              <div className="relative timeline-dot">
                <h3 className="text-xl font-display text-gold mb-3">2023年 · 跨越</h3>
                <div className="bg-white rounded-xl shadow-md p-6 hover-lift">
                  <p className="text-text/80">
                    社员人数突破300人，与多家文化机构建立合作关系，推出"AI诗歌助手"线上工具，探索传统文学与现代科技的结合。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 核心团队 */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-text inline-block relative">
              核心团队
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gold"></span>
            </h2>
            <p className="mt-4 text-text/70 max-w-2xl mx-auto">
              一群热爱文学的年轻人，用热情与专业推动社团发展
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {/* 团队成员1 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover-lift">
              <div className="h-64 overflow-hidden">
                <img src="https://picsum.photos/id/64/400/600" alt="林清禾" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-display text-text mb-1">林清禾</h3>
                <p className="text-gold mb-3">社长</p>
                <p className="text-text/70 text-sm mb-4">
                  青年诗人，出版诗集《风中的麦芒》，擅长自然主题创作，负责社团整体规划。
                </p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-text/60 hover:text-gold transition-colors">
                    <i className="fa fa-weibo"></i>
                  </a>
                  <a href="#" className="text-text/60 hover:text-gold transition-colors">
                    <i className="fa fa-envelope-o"></i>
                  </a>
                </div>
              </div>
            </div>
            
            {/* 团队成员2 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover-lift">
              <div className="h-64 overflow-hidden">
                <img src="https://picsum.photos/id/91/400/600" alt="王子墨" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-display text-text mb-1">王子墨</h3>
                <p className="text-gold mb-3">活动总监</p>
                <p className="text-text/70 text-sm mb-4">
                  策划师，曾组织近50场文学活动，擅长将文学与自然体验相结合，创造独特参与感。
                </p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-text/60 hover:text-gold transition-colors">
                    <i className="fa fa-weibo"></i>
                  </a>
                  <a href="#" className="text-text/60 hover:text-gold transition-colors">
                    <i className="fa fa-envelope-o"></i>
                  </a>
                </div>
              </div>
            </div>
            
            {/* 团队成员3 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover-lift">
              <div className="h-64 overflow-hidden">
                <img src="https://picsum.photos/id/26/400/600" alt="陈晓棠" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-display text-text mb-1">陈晓棠</h3>
                <p className="text-gold mb-3">创作指导</p>
                <p className="text-text/70 text-sm mb-4">
                  作家，小说《青麦》获省级文学奖，负责社员创作指导与作品点评，经验丰富。
                </p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-text/60 hover:text-gold transition-colors">
                    <i className="fa fa-weibo"></i>
                  </a>
                  <a href="#" className="text-text/60 hover:text-gold transition-colors">
                    <i className="fa fa-envelope-o"></i>
                  </a>
                </div>
              </div>
            </div>
            
            {/* 团队成员4 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover-lift">
              <div className="h-64 overflow-hidden">
                <img src="https://picsum.photos/id/22/400/600" alt="李明远" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-display text-text mb-1">李明远</h3>
                <p className="text-gold mb-3">新媒体运营</p>
                <p className="text-text/70 text-sm mb-4">
                  媒体人，负责社团线上平台运营与推广，擅长用新媒体传播文学之美。
                </p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-text/60 hover:text-gold transition-colors">
                    <i className="fa fa-weibo"></i>
                  </a>
                  <a href="#" className="text-text/60 hover:text-gold transition-colors">
                    <i className="fa fa-envelope-o"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 加入我们 */}
        <section className="mb-20 bg-gold/5 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display text-text inline-block relative">
                加入我们
                <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gold"></span>
              </h2>
              <p className="mt-4 text-text/70 max-w-2xl mx-auto">
                无论你是经验丰富的写作者，还是刚刚开始接触文学的新手，只要你热爱文字与自然，我们都欢迎你的加入
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-display text-text mb-6">成为麦芒的一员，你将获得：</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <i className="fa fa-check-circle text-gold mt-1 mr-3 text-lg"></i>
                    <div>
                      <h4 className="font-medium">专业的创作指导</h4>
                      <p className="text-sm text-text/70">定期的写作工坊与作品点评，提升创作水平</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fa fa-check-circle text-gold mt-1 mr-3 text-lg"></i>
                    <div>
                      <h4 className="font-medium">丰富的田野活动</h4>
                      <p className="text-sm text-text/70">走出室内，在自然中寻找灵感的采风活动</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fa fa-check-circle text-gold mt-1 mr-3 text-lg"></i>
                    <div>
                      <h4 className="font-medium">作品发表机会</h4>
                      <p className="text-sm text-text/70">在社团刊物及合作媒体上发表作品的机会</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fa fa-check-circle text-gold mt-1 mr-3 text-lg"></i>
                    <div>
                      <h4 className="font-medium">志同道合的朋友</h4>
                      <p className="text-sm text-text/70">认识一群热爱文学与自然的朋友，共同成长</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <a href="/contact" className="inline-block bg-gold hover:bg-goldDark text-white font-bold px-6 py-3 rounded-full transition-all transform hover:scale-105">
                    立即申请加入 <i className="fa fa-arrow-right ml-1"></i>
                  </a>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img src="https://picsum.photos/id/183/800/600" alt="加入我们" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}