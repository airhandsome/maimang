## 文学社网站（Next.js + antd）项目规划

本文件为实施前的详细规划，确认无误后开始编码与搭建环境。内容涵盖功能范围、信息架构、数据模型、工作流、技术选型、目录结构、质量与交付标准、以及分阶段路线图。

### 项目目标与价值
- **目标**: 打造一个适合高校/社团使用的现代化文学社门户，集内容展示、投稿、活动组织、成员管理与多媒体相册为一体，并提供后台审稿与发布工作流。
- **价值**: 提升社团影响力与运营效率，沉淀作品与活动资料，形成可持续的内容生态。

### 用户角色与权限
- **访客 Visitor**: 浏览公开内容、订阅、搜索。
- **社员 Member**: 投稿、编辑自己的草稿、报名活动、评论互动。
- **编辑 Editor**: 审核投稿、编辑修改、安排上架与分发。
- **管理员 Admin**: 站点设置、用户与角色管理、内容最终发布、活动与媒体的全面管理。

### 功能范围
- **前台门户**
  - 首页: 轮播/精选、最新文章、活动预告、相册精选、公告。
  - 文章: 列表、分类/标签、详情页、作者页、相关推荐、评论（可选）。
  - 投稿: 在线投稿表单、登录后草稿管理、投稿指南。
  - 活动: 活动列表/详情、报名、签到（二维码/口令，后期）。
  - 相册: 图集/单图模式、按活动/专题聚合、图片懒加载与灯箱。
  - 关于: 社团介绍、顾问/指导老师、社员风采、联系与社媒链接。
  - 搜索与订阅: 站内搜索、RSS/Atom、邮件订阅（后期）。
- **后台管理（CMS）**
  - 内容管理: 文章/页面/公告的创建、编辑、预览、版本与发布计划。
  - 审核工作流: 草稿→待审→已审/退回→发布，支持评论/批注。
  - 稿件箱: 来稿管理、关键词/分类、合规检查（敏感词基础版）。
  - 活动管理: 创建活动、报名名单导出、现场签到（后期）、回顾页生成。
  - 媒体库: 图片/附件上传、自动压缩与裁剪、版权/来源标注。
  - 成员与角色: 用户、角色、权限规则、快速分组。
  - 站点设置: 导航/页脚、主题色、SEO、社媒与友链。
  - 审计/统计: 基础访问统计、内容表现概览（后期可接入更强统计）。

### 信息架构与路由（App Router）
- 前台（公开）
  - `/` 首页
  - `/articles` 文章列表；`/articles/[slug]` 文章详情
  - `/tags/[tag]` 标签页；`/categories/[cat]` 分类页
  - `/authors/[id]` 作者页
  - `/submit` 投稿入口（登录后显示个人稿件管理）
  - `/events` 活动列表；`/events/[id]` 活动详情
  - `/gallery` 相册；`/gallery/[albumId]` 图集详情
  - `/about` 关于；`/search` 搜索
  - `/rss.xml`、`/sitemap.xml`（服务端生成）
- 后台（受保护）
  - `/admin` 仪表盘
  - `/admin/content` 内容列表；`/admin/content/new` 新建
  - `/admin/submissions` 投稿/来稿；`/admin/review` 审核队列
  - `/admin/events` 活动管理
  - `/admin/media` 媒体库
  - `/admin/users` 用户与角色
  - `/admin/settings` 站点设置

### 数据模型（初版）
- User: id, name, email, role[visitor/member/editor/admin], avatar, bio, socialLinks, createdAt, updatedAt
- Article: id, title, slug, summary, content(支持富文本/Markdown), coverImage, status[draft/pending/approved/published/scheduled], scheduledAt, authorId, editorId, categories[], tags[], views, likes, createdAt, updatedAt, publishedAt, version
- Submission: id, title, content, attachments[], submitterId, status[draft/submitted/reviewing/returned/accepted/published], notes, createdAt, updatedAt
- Category: id, name, slug, description
- Tag: id, name, slug
- Event: id, title, description, startAt, endAt, location, banner, status[planned/open/closed/archived], signupRequired, maxParticipants, organizerId, createdAt, updatedAt
- EventSignup: id, eventId, userId, status[applied/confirmed/cancelled/attended], createdAt
- Album: id, title, description, coverImage, createdAt, updatedAt, visibility[public/private]
- Media: id, url, storageProvider, alt, width, height, size, mime, uploadedBy, createdAt, linkedTo(entity,id)
- Comment(可选): id, articleId, userId, content, status[pending/approved/rejected], createdAt
- SiteSetting: id, key, value(JSON), updatedAt

说明: 初版以 Postgres + Gorm 建模，保留扩展字段（如 contentMeta、seo 等）以备后续增强。开发阶段使用 Gorm AutoMigrate；生产建议采用 goose/golang-migrate 等进行版本化迁移。

### 内容工作流与编辑体验
- 流程: 投稿/草稿 → 待审 → 修改/通过 → 定时/立即发布 → 归档
- 功能点:
  - 版本与预览: 支持版本号记录与预览草稿链接。
  - 定时发布: `scheduledAt` 到点自动发布（CRON/服务计划任务）。
  - 审核批注: 审核人可添加修订意见（简化为备注/评论）。
  - 敏感词: 基础敏感词检测，人工二次确认。

### 技术选型
- 前端框架: Next.js 14+（App Router, React Server Components）
- UI 库: antd 5+（主题定制、暗色模式可选）
- 语言: TypeScript（前端）、Go 1.22+（后端）
- 样式: Tailwind CSS 或 CSS-in-JS（建议 Tailwind，便于设计体系落地）
- 后端: Go + Fiber（Web 框架）、Gorm（ORM）、JWT（身份认证）、Viper（配置）、Cobra（CLI）、Logrus（日志）
- 数据库: PostgreSQL（开发/生产统一）
- 存储: 本地存储（开发）/ S3 兼容（生产）
- 图片: next/image，必要时接入图像压缩/裁剪服务（如 imagor/sharp）
- 消息/任务（可选）: goroutine + Cron（定时发布），后续可扩展队列
- 日志与监控: Logrus 结构化日志、OpenTelemetry/Sentry（可选）
- 测试: 前端 Vitest/Playwright；后端 Go test + httptest

### 总体架构与目录结构（建议）
- 前后端分层：Next.js 前端通过同源反向代理转发到 Go API（`/api` → `api:8080`）。
- 统一容器化：docker-compose 管理 `web`（前端）、`api`（后端）、`db`（Postgres）、可选 `minio`（对象存储）。

```
frontend/
  src/
    app/
      (public)/
        page.tsx                 # 首页
        articles/
          page.tsx               # 列表
          [slug]/page.tsx        # 详情
        events/
          page.tsx
          [id]/page.tsx
        gallery/
          page.tsx
          [albumId]/page.tsx
        about/page.tsx
        submit/page.tsx
        search/page.tsx
      admin/
        layout.tsx               # 鉴权+导航
        page.tsx                 # 仪表盘
        content/
          page.tsx
          new/page.tsx
          [id]/page.tsx
        submissions/page.tsx
        review/page.tsx
        events/page.tsx
        media/page.tsx
        users/page.tsx
        settings/page.tsx
    components/                  # 通用组件
    lib/                         # 前端 RBAC、validators、api 客户端
    styles/
    types/
  public/

backend/
  cmd/
    server/
      main.go                    # 入口，Cobra 子命令（serve/migrate/seed/admin）
  internal/
    api/                         # Fiber 路由（v1）
      middleware/                # JWT/RBAC/日志/恢复
      handlers/                  # 文章/投稿/活动/媒体/用户/设置
      validators/
    core/                        # 领域服务（内容、工作流、AI、RSS）
    repo/                        # Gorm 仓储
    jobs/                        # 定时任务（定时发布、RSS 刷新）
    auth/                        # JWT、密码学、角色权限
    ai/                          # AI 客户端与服务
    rss/                         # RSS 输出
  pkg/
    config/                      # Viper 配置加载
    logger/                      # Logrus 初始化
    response/                    # 统一响应与错误码
  migrations/                    # 数据库迁移（生产）
  scripts/
    dev.sh                       # 本地开发脚本（可选）

deploy/
  docker-compose.yml
  Dockerfile.web
  Dockerfile.api
  .env.example
```

### UI 与交互规范
- antd 主题: 社团主色（可提供品牌色），暗色模式可选。
- 组件: Header、Footer、Nav、ArticleCard、Tag、Empty、Pagination、RichEditor（后台）等。
- 响应式: 移动优先，关键页面在 360px~1440px 断点良好展示。
- 可访问性: 语义化标签、键盘可操作、对比度与 ARIA 标签。

### 状态与数据
- 服务器组件优先；必要时在客户端使用 SWR 或 React Query。
- 表单与校验: antd Form + zod/yup；统一错误提示与空状态。
- 缓存: Next.js 数据缓存与 ISR；后台走非缓存直连。
- 前端通过 fetch/axios 调用 Go API（`/api/v1/...`），由 Next.js 开发服务器或生产反代转发。

### API 设计（简要）
- 版本: `/api/v1`
- 鉴权: JWT（HS256），登录获得 `access_token`（短期）+ 可选 `refresh_token`。
- 中间件: 请求日志、恢复、CORS、JWT 验证、RBAC（基于角色/资源/动作）。
- REST 路径示例：
  - 文章: `GET /api/v1/articles?status=published&tag=…`、`GET /api/v1/articles/:id|:slug`、`POST /api/v1/articles`、`PATCH /api/v1/articles/:id`、`DELETE ...`
  - 投稿: `POST /api/v1/submissions`、`GET /api/v1/submissions/mine`、审核流相关 `PATCH`
  - 活动: `GET/POST/PATCH /api/v1/events`、报名 `POST /api/v1/events/:id/signup`
  - 媒体: `POST /api/v1/media`（multipart）
  - 用户: `POST /api/v1/auth/login`、`POST /api/v1/auth/register`、`POST /api/v1/auth/refresh`、`GET /api/v1/me`
  - RSS: `GET /rss.xml`（最新文章）、`GET /rss/:channel.xml`（分类/标签/活动）
  - AI: `POST /api/v1/ai/summarize`、`POST /api/v1/ai/title`、`POST /api/v1/ai/suggest-tags`

### SEO、国际化与分享
- SEO: 元信息、Open Graph、结构化数据（文章/活动），站点地图与 RSS。
- I18N: 初期中文为主，结构预留多语言。
- 分享: 文章详情生成 OG 图（可选）并支持社交分享。

### 媒体与存储策略
- 开发: 本地磁盘或 MinIO（S3 兼容）；生产：S3/兼容（如 COS/OSS/MinIO）。
- 图片处理: 上传时压缩/限制分辨率，前台使用自适应与懒加载。

### 安全与合规
- 输入校验与 XSS 防护（渲染时进行白名单/转义）。
- 角色权限最小化；审计关键操作（发布、删除、角色变更）。
- 文件上传校验 MIME/大小/病毒扫描（后期接入）。

### 性能与可观测性
- 图片与静态资源优化、按需分包、RSC 减少数据传输。
- 指标: FCP/LCP/INP、API 成功率与延迟、错误率；告警（后期）。

### 开发流程
- Git 约定式提交、ESLint+Prettier、CI 基础检查（构建/类型/简单测试）。
- 分支策略: main（可发布）/dev（集成）/feature-*。
- 需求→PR→预览（Vercel Preview）→评审→合并。

### 环境与部署
- docker-compose: `web`（Next.js）、`api`（Go Fiber）、`db`（Postgres）、可选 `minio`。
- 环境变量（示例）:
  - 通用: `SITE_NAME`, `SITE_URL`
  - 数据库: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`
  - JWT: `JWT_SECRET`, `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL`
  - 存储: `STORAGE_PROVIDER`（local/s3）、`S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`
  - AI: `AI_PROVIDER`（openai/azure/glm/...）, `AI_API_KEY`
- 前端部署: Vercel/容器化（Node 18+）。后端部署: 容器化（Go 镜像），Nginx/Caddy 反代。
- 数据迁移: 开发用 Gorm AutoMigrate；生产用 goose/golang-migrate 进行版本化迁移与回滚。

#### 本地启动（docker-compose）
```
cd deploy
docker compose up --build
```
访问：前端 `http://localhost:3000`，API 健康检查 `http://localhost:8080/healthz`、ready `http://localhost:8080/readyz`、Ping `http://localhost:8080/api/v1/ping`。

### 里程碑与路线图
1. M1 基础脚手架与容器化（1-2 天）
   - 前端: Next.js + TS + antd 初始化、主题配置、基础路由与布局
   - 后端: Go 模块初始化、Fiber 基础路由、Viper 配置、Logrus 日志
   - docker-compose: `web/api/db` 可启动，健康检查通过
2. M2 数据建模与认证（3-4 天）
   - Gorm 模型与仓储：Article/Category/Tag/Event/Album/User 等
   - JWT 登录/注册/刷新、RBAC 中间件、用户资料接口
   - 初版 API 对接前端页面（文章/活动/相册）
3. M3 投稿与后台 CMS（5-7 天）
   - 投稿流程与审核工作流、媒体上传（本地/MinIO）
   - 后台内容/活动/用户/设置模块
   - RSS 输出（全站、分类/标签/活动专栏）
4. M4 AI 与发布能力增强（3-5 天）
   - AI 辅助：标题生成、摘要、标签建议、相似内容推荐
   - 定时发布、版本预览、敏感词增强，性能与监控优化
   - 部署与文档完善

### 验收标准（DoD）
- 主要页面与 API 可用，权限与工作流闭环可演示。
- SEO 基础可测（站点地图/RSS、OG 卡片生成）。
- 样式与交互在主流桌面与移动端表现稳定。
- 关键路径端到端用例通过（创建→审核→发布→展示）。

### 可选增强（后续）
- 编辑器从基础富文本升级到 MDX + 可视化块。
- 活动签到与导出、数据看板、邮件订阅与自动化。
- 评论系统接入（自建/第三方）与内容推荐算法。
- AI 扩展：多模型路由（OpenAI/GLM/Qwen）、向量数据库（pgvector/Weaviate）做相似检索。

### RSS 与 AI 方案细化
- RSS
  - 输出源：最新已发布、按分类/标签、活动预告与回顾、作者专属源
  - 标准：RSS 2.0/Atom，内容摘要与封面图、OG 元信息
  - 刷新：发布/更新时触发或定时重建；缓存与 ETag/Last-Modified 支持
- AI
  - 能力：标题建议、摘要生成、标签/关键词建议、相似内容推荐（向量匹配）
  - 位置：后端 `internal/ai` 封装提供服务接口，前端在后台编辑器中调用
  - 安全：速率限制、审计日志、提示模板可配置（Viper）

### 需确认的问题
- 主题品牌色与 Logo 是否已有？
- 评论与邮件订阅是否纳入首期？
- 存储是否使用对象存储（S3/COS/OSS）还是先本地？
- 是否需要英文版界面与内容结构？

—— 请在以上规划上批注/确认，我们将据此开始脚手架搭建与实现。


