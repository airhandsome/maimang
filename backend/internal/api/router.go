package api

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"maimang/backend/internal/api/handlers"
	"maimang/backend/internal/api/middleware"
)

func RegisterRoutes(app *fiber.App, db *gorm.DB) {
	v1 := app.Group("/api/v1")

	// 认证相关 API
	v1.Post("/auth/register", handlers.Register(db))
	v1.Post("/auth/login", handlers.Login(db))
	v1.Post("/auth/refresh", handlers.Refresh())
	v1.Get("/me", middleware.AuthRequired(), handlers.Me())

	// 文件上传 API
	v1.Post("/upload/avatar", middleware.AuthRequired(), handlers.UploadAvatar())

	// 个人中心 API
	profile := v1.Group("/profile", middleware.AuthRequired())
	profile.Get("/", handlers.GetProfile(db))
	profile.Put("/", handlers.UpdateProfile(db))
	profile.Get("/works", handlers.GetMyWorks(db))
	profile.Get("/activities", handlers.GetMyActivities(db))
	profile.Get("/notifications", handlers.GetNotifications(db))

	// 作品管理 API
	works := v1.Group("/works")
	works.Get("/", handlers.ListWorks(db))
	works.Get("/:id", handlers.GetWork(db))
	works.Post("/", middleware.AuthRequired(), handlers.CreateWork(db))
	works.Put("/:id", middleware.AuthRequired(), handlers.UpdateWork(db))
	works.Delete("/:id", middleware.AuthRequired(), handlers.DeleteWork(db))
	works.Post("/:id/like", middleware.AuthRequired(), handlers.LikeWork(db))
	works.Delete("/:id/like", middleware.AuthRequired(), handlers.UnlikeWork(db))

	// 评论管理 API
	comments := v1.Group("/works/:id/comments")
	comments.Get("/", handlers.ListWorkComments(db))
	comments.Post("/", middleware.AuthRequired(), handlers.CreateComment(db))

	commentsById := v1.Group("/comments/:id")
	commentsById.Put("/", middleware.AuthRequired(), handlers.UpdateComment(db))
	commentsById.Delete("/", middleware.AuthRequired(), handlers.DeleteComment(db))
	commentsById.Post("/like", middleware.AuthRequired(), handlers.LikeComment(db))

	// 活动管理 API
	activities := v1.Group("/activities")
	activities.Get("/", handlers.ListActivities(db))
	activities.Get("/:id", handlers.GetActivity(db))
	activities.Post("/:id/register", middleware.AuthRequired(), handlers.RegisterActivity(db))
	activities.Delete("/:id/register", middleware.AuthRequired(), handlers.UnregisterActivity(db))

	// 公开内容 API
	v1.Get("/articles", handlers.ListArticles(db))
	v1.Get("/articles/:id", handlers.GetArticle(db))
	v1.Get("/events", handlers.ListEvents(db))
	v1.Get("/events/:id", handlers.GetEvent(db))
	v1.Get("/albums", handlers.ListAlbums(db))
	v1.Get("/albums/:id", handlers.GetAlbum(db))
	v1.Get("/carousels", handlers.ListCarousels(db))         // 公开轮播图
	v1.Get("/announcements", handlers.ListAnnouncements(db)) // 公开公告

	// 管理员 API
	admin := v1.Group("/admin", middleware.AuthRequired(), middleware.AdminRequired())

	// 仪表盘和统计
	admin.Get("/dashboard", handlers.GetDashboardStats(db))
	admin.Get("/statistics", handlers.GetDashboardStats(db))
	admin.Get("/statistics/users", handlers.GetUserStats(db))
	admin.Get("/statistics/works", handlers.GetWorkStats(db))
	admin.Get("/statistics/activities", handlers.GetActivityStats(db))

	// 用户管理
	admin.Get("/users", handlers.ListUsers(db))
	admin.Get("/users/:id", handlers.GetUser(db))
	admin.Put("/users/:id", handlers.UpdateUser(db))
	admin.Delete("/users/:id", handlers.DeleteUser(db))
	admin.Put("/users/:id/status", handlers.UpdateUserStatus(db))

	// 作品审核
	admin.Get("/works", handlers.ListPendingWorks(db))
	admin.Put("/works/:id/approve", handlers.ReviewWork(db))
	admin.Put("/works/:id/reject", handlers.ReviewWork(db))

	// 评论审核
	admin.Get("/comments", handlers.ListPendingComments(db))
	admin.Put("/comments/:id/approve", handlers.ReviewComment(db))
	admin.Put("/comments/:id/reject", handlers.ReviewComment(db))
	admin.Put("/comments/:id/hide", handlers.ReviewComment(db))

	// 活动管理
	admin.Get("/activities", handlers.ListAdminActivities(db))
	admin.Post("/activities", handlers.CreateActivity(db))
	admin.Put("/activities/:id", handlers.UpdateActivity(db))
	admin.Delete("/activities/:id", handlers.DeleteActivity(db))
	admin.Get("/activities/:id/participants", handlers.GetActivityParticipants(db))
	admin.Put("/activities/:id/status", handlers.UpdateActivityStatus(db))

	// 轮播图管理
	admin.Get("/carousels", handlers.ListCarousels(db))
	admin.Post("/carousels", handlers.CreateCarousel(db))
	admin.Put("/carousels/:id", handlers.UpdateCarousel(db))
	admin.Delete("/carousels/:id", handlers.DeleteCarousel(db))
	admin.Put("/carousels/:id/order", handlers.UpdateCarouselOrder(db))

	// 公告管理
	admin.Get("/announcements", handlers.ListAnnouncements(db))
	admin.Post("/announcements", handlers.CreateAnnouncement(db))
	admin.Put("/announcements/:id", handlers.UpdateAnnouncement(db))
	admin.Delete("/announcements/:id", handlers.DeleteAnnouncement(db))
	admin.Put("/announcements/:id/publish", handlers.PublishAnnouncement(db))

	// 管理员管理（超级管理员）
	superAdmin := admin.Group("/admins", middleware.SuperAdminRequired())
	superAdmin.Get("/", handlers.ListAdmins(db))
	superAdmin.Post("/", handlers.CreateAdmin(db))
	superAdmin.Put("/:id", handlers.UpdateAdmin(db))
	superAdmin.Delete("/:id", handlers.DeleteAdmin(db))

	// 系统设置
	admin.Get("/settings", handlers.GetSystemSettings(db))
	admin.Put("/settings", handlers.UpdateSystemSettings(db))
	admin.Get("/settings/:key", handlers.GetSystemSetting(db))
	admin.Put("/settings/:key", handlers.UpdateSystemSetting(db))

	// 素材管理
	admin.Get("/materials", handlers.ListMaterials(db))
	admin.Post("/materials", handlers.CreateMaterial(db))
	admin.Put("/materials/:id", handlers.UpdateMaterial(db))
	admin.Delete("/materials/:id", handlers.DeleteMaterial(db))

	// 静态文件服务
	app.Get("/uploads/*", handlers.ServeStaticFiles())
}
