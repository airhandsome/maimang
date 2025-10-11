import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import http, { MOCK_ARTICLES } from '@/lib/http';

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
  content?: string;
}

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const data = MOCK_ARTICLES.find(a => a.id === id) as Article | undefined;
  const article = data || await http.get<Article>(`/articles/${id}`);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        {!article ? (
          <div className="max-w-2xl mx-auto text-center text-foreground/60">加载中…</div>
        ) : (
          <>
            {/* 标题与信息 */}
            <div className="max-w-3xl mx-auto mb-10 text-center">
              <span className="inline-block px-4 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium mb-6">{article.category}</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4 text-foreground">{article.title}</h1>
              <div className="flex flex-wrap items-center justify-center gap-4 text-foreground/70">
                <div>{article.author}</div>
                <div>{new Date(article.publishDate).toLocaleDateString()}</div>
                <div>阅读 {article.views}</div>
                <div>喜欢 {article.likes}</div>
              </div>
            </div>

            {/* 主图 */}
            <div className="max-w-4xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.coverImage} alt={article.title} className="w-full h-auto object-cover img-fade" />
            </div>

            {/* 正文（使用 mock content 渲染为段落）*/}
            <article className="max-w-3xl mx-auto font-serif text-lg leading-relaxed text-foreground/90 mb-12">
              {(article.content && article.content.trim().length > 0
                ? article.content.split(/\r?\n\r?\n|\r?\n/)
                : [article.excerpt]
              ).map((para, idx) => (
                <p key={idx} className="mb-6">{para}</p>
              ))}
            </article>

            {/* 标签示例 */}
            <div className="max-w-3xl mx-auto mb-12 flex flex-wrap gap-2">
              <span className="text-sm font-medium">相关标签:</span>
              {['季节','自然','成长','散文','生命'].map((t)=>(
                <a key={t} href="#" className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm hover:bg-gold/20 transition-colors">{t}</a>
              ))}
            </div>

            {/* 相关推荐 */}
            <div className="max-w-4xl mx-auto mb-16">
              <h3 className="text-2xl font-serif text-foreground mb-6 text-center">你可能也喜欢</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[118,164].map((pid,idx)=>(
                  <div key={pid} className="bg-white rounded-2xl overflow-hidden shadow-sm hover-lift flex">
                    <div className="w-1/3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://picsum.photos/id/${pid}/300/300`} alt="推荐作品" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-2/3 p-4">
                      <span className="text-xs text-gold">{idx===0?'诗歌':'散文'}</span>
                      <h4 className="text-lg font-serif text-foreground mt-1 mb-2 line-clamp-2">{idx===0?'《麦田上的云》':'《晒谷场的黄昏》'}</h4>
                      <p className="text-sm text-foreground/70 line-clamp-2">{idx===0?'云在麦田上投下影子，像未写完的诗行…':'夕阳把晒谷场变成金色的海洋…'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 返回与更多 */}
            <div className="max-w-3xl mx-auto mb-20 flex items-center justify-between">
              <Link href="/articles" className="text-gold hover:text-amber-600">← 返回列表</Link>
              <Link href="/submit" className="text-gold hover:text-amber-600">我要投稿 →</Link>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return MOCK_ARTICLES.map(a => ({ id: a.id }));
}


