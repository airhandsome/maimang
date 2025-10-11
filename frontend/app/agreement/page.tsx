import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AgreementPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-cream">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-display text-gold mb-8 text-center">
              麦芒文学社用户协议
            </h1>
            
            <div className="prose prose-lg max-w-none text-text">
              <p className="text-center text-text/70 mb-8">
                最后更新时间：2024年1月1日
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">1. 协议范围</h2>
                <p className="mb-4">
                  本协议是您与麦芒文学社（以下简称"我们"）之间关于您使用麦芒文学社平台服务所订立的协议。
                </p>
                <p className="mb-4">
                  麦芒文学社是一个专注于文学创作和交流的社区平台，致力于为文学爱好者提供创作、分享、交流的空间。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">2. 服务内容</h2>
                <p className="mb-4">我们为您提供以下服务：</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>文学作品发布和展示</li>
                  <li>文学创作工具和资源</li>
                  <li>文学活动和比赛</li>
                  <li>文学交流和讨论</li>
                  <li>个人作品管理</li>
                  <li>社区互动功能</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">3. 用户权利与义务</h2>
                
                <h3 className="text-xl font-semibold text-text mb-3">3.1 用户权利</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>在平台发布原创文学作品</li>
                  <li>参与社区讨论和交流</li>
                  <li>参加平台组织的文学活动</li>
                  <li>获得平台提供的创作资源</li>
                  <li>保护个人隐私和作品版权</li>
                </ul>

                <h3 className="text-xl font-semibold text-text mb-3">3.2 用户义务</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>遵守国家法律法规和平台规则</li>
                  <li>发布原创内容，不得抄袭他人作品</li>
                  <li>尊重其他用户，文明交流</li>
                  <li>不得发布违法违规内容</li>
                  <li>保护账号安全，不得转让账号</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">4. 内容规范</h2>
                <p className="mb-4">用户在平台发布的内容应当：</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>符合社会主义核心价值观</li>
                  <li>积极向上，传播正能量</li>
                  <li>尊重他人，避免人身攻击</li>
                  <li>原创性，不得侵犯他人版权</li>
                  <li>真实性，不得传播虚假信息</li>
                </ul>
                
                <p className="mb-4">禁止发布以下内容：</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>违反国家法律法规的内容</li>
                  <li>色情、暴力、恐怖主义内容</li>
                  <li>种族歧视、宗教仇恨内容</li>
                  <li>垃圾信息、广告推广</li>
                  <li>侵犯他人隐私的内容</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">5. 知识产权</h2>
                <p className="mb-4">
                  用户保留其发布内容的完整知识产权。通过发布内容，用户授予我们非独占的、免费的、全球性的许可，
                  使我们能够展示、分发和推广用户的内容。
                </p>
                <p className="mb-4">
                  我们尊重用户的知识产权，如发现侵权行为，请及时联系我们处理。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">6. 隐私保护</h2>
                <p className="mb-4">
                  我们重视用户隐私保护，详细内容请参阅我们的《隐私政策》。
                  我们承诺不会在未经用户同意的情况下泄露用户个人信息。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">7. 服务变更与终止</h2>
                <p className="mb-4">
                  我们保留随时修改或终止服务的权利。如因服务变更影响用户权益，
                  我们将提前通知用户。
                </p>
                <p className="mb-4">
                  用户有权随时注销账号。账号注销后，相关数据将按照隐私政策处理。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">8. 免责声明</h2>
                <p className="mb-4">
                  用户使用平台服务所产生的风险由用户自行承担。我们不对以下情况承担责任：
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>因网络故障导致的服务中断</li>
                  <li>用户发布内容引起的法律纠纷</li>
                  <li>第三方网站链接的内容</li>
                  <li>不可抗力因素导致的服务中断</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">9. 争议解决</h2>
                <p className="mb-4">
                  因本协议引起的争议，双方应友好协商解决。协商不成的，
                  可向有管辖权的人民法院提起诉讼。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">10. 协议修改</h2>
                <p className="mb-4">
                  我们有权根据法律法规变化和业务发展需要修改本协议。
                  修改后的协议将在平台公布，继续使用服务视为接受修改后的协议。
                </p>
              </section>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-center text-text/70">
                  如有疑问，请联系我们：<a href="mailto:contact@maimang.com" className="text-gold hover:underline">contact@maimang.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}