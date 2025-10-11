package api

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"maimang/backend/internal/api/handlers"
	"maimang/backend/internal/api/middleware"
)

func RegisterRoutes(app *fiber.App, db *gorm.DB) {
	v1 := app.Group("/api/v1")

	// auth
	v1.Post("/auth/register", handlers.Register(db))
	v1.Post("/auth/login", handlers.Login(db))
	v1.Post("/auth/refresh", handlers.Refresh())
	v1.Get("/me", middleware.AuthRequired(), handlers.Me())

	// public content
	v1.Get("/articles", handlers.ListArticles(db))
	v1.Get("/articles/:id", handlers.GetArticle(db))
	v1.Get("/events", handlers.ListEvents(db))
	v1.Get("/events/:id", handlers.GetEvent(db))
	v1.Get("/albums", handlers.ListAlbums(db))
	v1.Get("/albums/:id", handlers.GetAlbum(db))
}
