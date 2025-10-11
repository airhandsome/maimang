package handlers

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"maimang/backend/internal/repo"
)

// List endpoints return minimal shape: { items: [] }

func ListArticles(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var items []repo.Article
		if err := db.Where("status = ?", repo.ArticlePublished).Order("id desc").Limit(50).Find(&items).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "db error"})
		}
		return c.JSON(fiber.Map{"items": items})
	}
}

func GetArticle(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		var item repo.Article
		q := db.Where("id = ? OR slug = ?", id, id).Where("status = ?", repo.ArticlePublished)
		if err := q.First(&item).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "not found"})
		}
		return c.JSON(item)
	}
}

func ListEvents(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var items []repo.Event
		if err := db.Order("start_at desc nulls last").Limit(50).Find(&items).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "db error"})
		}
		return c.JSON(fiber.Map{"items": items})
	}
}

func GetEvent(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		var item repo.Event
		if err := db.Where("id = ?", id).First(&item).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "not found"})
		}
		return c.JSON(item)
	}
}

func ListAlbums(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var items []repo.Album
		if err := db.Order("id desc").Limit(50).Find(&items).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "db error"})
		}
		return c.JSON(fiber.Map{"items": items})
	}
}

func GetAlbum(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		var item repo.Album
		if err := db.Where("id = ?", id).First(&item).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "not found"})
		}
		return c.JSON(item)
	}
}
