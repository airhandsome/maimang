import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-cream">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-display text-gold mb-8 text-center">
              麦芒文学社隐私政策
            </h1>
            
            <div className="prose prose-lg max-w-none text-text">
              <p className="text-center text-text/70 mb-8">
                最后更新时间：2024年1月1日
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">1. 引言</h2>
                <p className="mb-4">
                  麦芒文学社（以下简称"我们"）深知个人信息对您的重要性，我们将严格遵守相关法律法规，
                  采取相应的安全保护措施，致力于保护您的个人信息安全可控。
                </p>
                <p className="mb-4">
                  本隐私政策将详细说明我们如何收集、使用、存储、分享和保护您的个人信息。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">2. 信息收集</h2>
                
                <h3 className="text-xl font-semibold text-text mb-3">2.1 我们收集的信息类型</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>账户信息：</strong>用户名、邮箱地址、密码（加密存储）</li>
                  <li><strong>个人资料：</strong>头像、个人简介、昵称</li>
                  <li><strong>创作内容：</strong>您发布的文学作品、评论、活动参与记录</li>
                  <li><strong>使用数据：</strong>访问记录、操作日志、设备信息</li>
                  <li><strong>联系信息：</strong>您主动提供的联系方式</li>
                </ul>

                <h3 className="text-xl font-semibold text-text mb-3">2.2 信息收集方式</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>您主动提供的信息（注册、发布内容时）</li>
                  <li>您使用服务时自动收集的信息</li>
                  <li>第三方平台授权登录时获得的信息</li>
                  <li>通过合法途径获得的公开信息</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">3. 信息使用</h2>
                <p className="mb-4">我们收集的信息将用于以下目的：</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>提供、维护和改进我们的服务</li>
                  <li>处理您的账户注册和身份验证</li>
                  <li>展示您的创作内容和用户资料</li>
                  <li>提供个性化推荐和内容</li>
                  <li>与您沟通服务相关事宜</li>
                  <li>分析服务使用情况，优化用户体验</li>
                  <li>防范安全威胁和欺诈行为</li>
                  <li>遵守法律法规要求</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">4. 信息存储</h2>
                <p className="mb-4">
                  我们采用行业标准的安全措施保护您的个人信息：
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>数据加密传输和存储</li>
                  <li>访问控制和权限管理</li>
                  <li>定期安全审计和漏洞扫描</li>
                  <li>数据备份和灾难恢复</li>
                  <li>员工隐私保护培训</li>
                </ul>
                <p className="mb-4">
                  我们仅在必要期间内保留您的个人信息，超出保留期限的信息将被安全删除。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">5. 信息分享</h2>
                <p className="mb-4">我们不会出售、出租或以其他方式披露您的个人信息，除非：</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>获得您的明确同意</li>
                  <li>法律法规要求或政府机关要求</li>
                  <li>为保护我们的合法权益</li>
                  <li>与可信的第三方服务提供商合作（在严格保密协议下）</li>
                  <li>在紧急情况下保护用户或公众安全</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">6. 您的权利</h2>
                <p className="mb-4">您对个人信息享有以下权利：</p>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>访问权：</strong>了解我们收集了哪些关于您的信息</li>
                  <li><strong>更正权：</strong>要求更正不准确的个人信息</li>
                  <li><strong>删除权：</strong>要求删除您的个人信息</li>
                  <li><strong>限制处理权：</strong>限制我们处理您的个人信息</li>
                  <li><strong>数据可携带权：</strong>获取您的个人数据副本</li>
                  <li><strong>反对权：</strong>反对我们处理您的个人信息</li>
                </ul>
                <p className="mb-4">
                  如需行使上述权利，请通过邮件联系我们：<a href="mailto:privacy@maimang.com" className="text-gold hover:underline">privacy@maimang.com</a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">7. Cookie 和类似技术</h2>
                <p className="mb-4">
                  我们使用 Cookie 和类似技术来改善您的使用体验：
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>记住您的登录状态</li>
                  <li>保存您的偏好设置</li>
                  <li>分析网站使用情况</li>
                  <li>提供个性化内容</li>
                </ul>
                <p className="mb-4">
                  您可以通过浏览器设置管理 Cookie，但禁用某些 Cookie 可能影响服务功能。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">8. 未成年人保护</h2>
                <p className="mb-4">
                  我们非常重视未成年人的个人信息保护。如果您是未成年人，
                  请在监护人指导下使用我们的服务。
                </p>
                <p className="mb-4">
                  如果我们发现收集了未成年人的个人信息，将立即删除相关信息。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">9. 国际传输</h2>
                <p className="mb-4">
                  如果您的个人信息需要跨境传输，我们将确保：
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>获得您的明确同意</li>
                  <li>采用适当的保护措施</li>
                  <li>遵守相关法律法规</li>
                  <li>与接收方签署数据保护协议</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">10. 隐私政策更新</h2>
                <p className="mb-4">
                  我们可能会不时更新本隐私政策。重大变更将通过以下方式通知您：
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>在平台显著位置发布通知</li>
                  <li>发送邮件通知</li>
                  <li>在您下次登录时提示</li>
                </ul>
                <p className="mb-4">
                  继续使用我们的服务即表示您接受更新后的隐私政策。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-display text-text mb-4">11. 联系我们</h2>
                <p className="mb-4">
                  如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>邮箱：<a href="mailto:privacy@maimang.com" className="text-gold hover:underline">privacy@maimang.com</a></li>
                  <li>电话：400-123-4567</li>
                  <li>地址：北京市朝阳区文学大厦</li>
                </ul>
              </section>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-center text-text/70">
                  我们承诺保护您的隐私，感谢您对麦芒文学社的信任！
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