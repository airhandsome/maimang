import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Wheat, Target, Users, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-green-50 wheat-pattern py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">关于我们</h1>
            <p className="text-lg text-gray-600">了解麦芒文学社的故事</p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gradient-harvest">
                <Wheat className="h-12 w-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 m-0 font-serif">麦芒文学社</h2>
                <p className="text-gray-600 m-0">用文字收获青春</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-8">
              麦芒文学社成立于2020年，是一个充满活力的青年文学创作平台。我们的名字源于"麦芒"——那小小的、尖锐的、充满生命力的存在。正如麦芒虽小却锋芒毕露，我们相信每一位青年作家，无论起点如何，都有着独特的光芒和无限的可能。
            </p>

            <div className="grid gap-6 md:grid-cols-3 my-12">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Target className="h-12 w-12 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-serif">我们的使命</h3>
                  <p className="text-sm text-gray-600">
                    为青年作家提供展示才华的平台，用文字记录时代，用故事温暖人心
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Sparkles className="h-12 w-12 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-serif">我们的愿景</h3>
                  <p className="text-sm text-gray-600">
                    成为最具影响力的青年文学社区，孵化优秀作品，培养文学新星
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Users className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-serif">我们的价值观</h3>
                  <p className="text-sm text-gray-600">
                    真诚创作，用心分享，相互成就，共同成长
                  </p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">我们的特色</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">·</span>
                <span className="text-gray-700">
                  <strong>多元化内容：</strong>涵盖散文、诗歌、小说、随笔等多种文学体裁
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">·</span>
                <span className="text-gray-700">
                  <strong>专业编辑团队：</strong>为每一篇作品提供专业的编辑建议和指导
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">·</span>
                <span className="text-gray-700">
                  <strong>活跃的社区氛围：</strong>定期举办文学沙龙、创作工坊等线上线下活动
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">·</span>
                <span className="text-gray-700">
                  <strong>公平的展示机会：</strong>每一位作者都有机会被推荐到首页精选
                </span>
              </li>
            </ul>

            <div className="bg-gradient-to-r from-amber-50 to-green-50 rounded-lg p-8 my-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">加入我们</h3>
              <p className="text-gray-700 leading-relaxed">
                无论你是文学爱好者、业余写手，还是专业作家，麦芒文学社都欢迎你的加入。
                在这里，你可以找到志同道合的朋友，获得专业的写作指导，展示你的才华，
                实现你的文学梦想。让我们一起，用文字收获青春，用故事创造价值！
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
