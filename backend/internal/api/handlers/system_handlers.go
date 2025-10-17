package handlers

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"maimang/backend/internal/repo"
	"maimang/backend/internal/types"
)

// 获取系统设置
func GetSystemSettings(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var settings []repo.SystemSetting
		if err := db.Find(&settings).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch system settings",
			})
		}

		// 转换为键值对格式
		settingsMap := make(map[string]interface{})
		for _, setting := range settings {
			settingsMap[setting.Key] = setting.Value
		}

		return c.JSON(types.Response{
			Success: true,
			Data:    settingsMap,
		})
	}
}

// 更新系统设置
func UpdateSystemSettings(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req types.UpdateSettingsRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 开始事务
		tx := db.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		// 更新每个设置
		for key, value := range req.Settings {
			// 将值转换为字符串（持久化为文本）
			var valueStr string
			switch v := value.(type) {
			case string:
				valueStr = v
			case bool:
				if v {
					valueStr = "true"
				} else {
					valueStr = "false"
				}
			case float64:
				// JSON 数字默认是 float64
				// 如果是整数值，去小数点
				if v == float64(int64(v)) {
					valueStr = strconv.FormatInt(int64(v), 10)
				} else {
					valueStr = strconv.FormatFloat(v, 'f', -1, 64)
				}
			case int:
				valueStr = strconv.Itoa(v)
			case int64:
				valueStr = strconv.FormatInt(v, 10)
			case []interface{}:
				b, _ := json.Marshal(v)
				valueStr = string(b)
			case []string:
				b, _ := json.Marshal(v)
				valueStr = string(b)
			case map[string]interface{}:
				b, _ := json.Marshal(v)
				valueStr = string(b)
			default:
				valueStr = fmt.Sprintf("%v", v)
			}

			// 使用 Postgres ON CONFLICT(key) DO UPDATE 实现原子 UPSERT，避免唯一键冲突
			setting := repo.SystemSetting{Key: key, Value: valueStr, Type: "string"}
			if err := tx.Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "key"}},
				DoUpdates: clause.AssignmentColumns([]string{"value", "updated_at"}),
			}).Create(&setting).Error; err != nil {
				tx.Rollback()
				return c.Status(500).JSON(types.Response{
					Success: false,
					Error:   "Failed to upsert setting: " + key,
				})
			}
		}

		// 提交事务
		if err := tx.Commit().Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to save settings",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "System settings updated successfully",
		})
	}
}

// 获取特定设置
func GetSystemSetting(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		key := c.Params("key")
		if key == "" {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Setting key is required",
			})
		}

		var setting repo.SystemSetting
		if err := db.Where("key = ?", key).First(&setting).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Setting not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch setting",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Data:    setting,
		})
	}
}

// 更新特定设置
func UpdateSystemSetting(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		key := c.Params("key")
		if key == "" {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Setting key is required",
			})
		}

		var req struct {
			Value string `json:"value" validate:"required"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 使用 UPSERT 更新或创建设置
		if err := db.Where("key = ?", key).
			Assign(repo.SystemSetting{Value: req.Value}).
			FirstOrCreate(&repo.SystemSetting{}, repo.SystemSetting{Key: key, Value: req.Value}).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update setting",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Setting updated successfully",
		})
	}
}

// 获取轮播图列表（管理员）
func ListCarousels(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var query types.ListQuery
		if err := c.QueryParser(&query); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid query parameters",
			})
		}

		// 设置默认值
		if query.Page == 0 {
			query.Page = 1
		}
		if query.PerPage == 0 {
			query.PerPage = 20
		}

		var carousels []repo.Carousel
		var total int64

		// 构建查询
		tx := db.Model(&repo.Carousel{})

		// 搜索条件
		if query.Search != "" {
			tx = tx.Where("title ILIKE ? OR description ILIKE ?", "%"+query.Search+"%", "%"+query.Search+"%")
		}
		if query.Status != "" {
			tx = tx.Where("status = ?", query.Status)
		}

		// 获取总数
		tx.Count(&total)

		// 分页和排序
		offset := (query.Page - 1) * query.PerPage
		tx = tx.Order("\"order\" ASC, created_at DESC").
			Offset(offset).
			Limit(query.PerPage).
			Find(&carousels)

		if tx.Error != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch carousels",
			})
		}

		// 计算总页数
		totalPages := int((total + int64(query.PerPage) - 1) / int64(query.PerPage))

		return c.JSON(types.PaginatedResponse{
			Success: true,
			Data:    carousels,
			Meta: types.PaginationMeta{
				Page:       query.Page,
				PerPage:    query.PerPage,
				Total:      total,
				TotalPages: totalPages,
			},
		})
	}
}

// 创建轮播图（管理员）
func CreateCarousel(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req types.CreateCarouselRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		carousel := repo.Carousel{
			Title:       req.Title,
			ImageURL:    req.ImageURL,
			LinkURL:     req.LinkURL,
			Description: req.Description,
			Status:      repo.CarouselActive,
			Order:       req.Order,
		}

		if err := db.Create(&carousel).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to create carousel",
			})
		}

		return c.Status(201).JSON(types.Response{
			Success: true,
			Message: "Carousel created successfully",
			Data:    carousel,
		})
	}
}

// 更新轮播图（管理员）
func UpdateCarousel(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		carouselID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid carousel ID",
			})
		}

		var req types.UpdateCarouselRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 检查轮播图是否存在
		var carousel repo.Carousel
		if err := db.First(&carousel, carouselID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Carousel not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch carousel",
			})
		}

		// 更新字段
		updates := make(map[string]interface{})
		if req.Title != "" {
			updates["title"] = req.Title
		}
		if req.ImageURL != "" {
			updates["image_url"] = req.ImageURL
		}
		if req.LinkURL != "" {
			updates["link_url"] = req.LinkURL
		}
		if req.Description != "" {
			updates["description"] = req.Description
		}
		if req.Status != "" {
			updates["status"] = req.Status
		}
		if req.Order > 0 {
			updates["order"] = req.Order
		}

		if err := db.Model(&carousel).Updates(updates).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update carousel",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Carousel updated successfully",
			Data:    carousel,
		})
	}
}

// 删除轮播图（管理员）
func DeleteCarousel(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		carouselID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid carousel ID",
			})
		}

		// 检查轮播图是否存在
		var carousel repo.Carousel
		if err := db.First(&carousel, carouselID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Carousel not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch carousel",
			})
		}

		// 删除轮播图
		if err := db.Delete(&carousel).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to delete carousel",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Carousel deleted successfully",
		})
	}
}

// 更新轮播图排序（管理员）
func UpdateCarouselOrder(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		carouselID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid carousel ID",
			})
		}

		var req struct {
			Order int `json:"order" validate:"required,min=1"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 检查轮播图是否存在
		var carousel repo.Carousel
		if err := db.First(&carousel, carouselID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Carousel not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch carousel",
			})
		}

		// 更新排序
		if err := db.Model(&carousel).Update("order", req.Order).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update carousel order",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Carousel order updated successfully",
		})
	}
}

// 获取公告列表（管理员）
func ListAnnouncements(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var query types.ListQuery
		if err := c.QueryParser(&query); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid query parameters",
			})
		}

		// 设置默认值
		if query.Page == 0 {
			query.Page = 1
		}
		if query.PerPage == 0 {
			query.PerPage = 20
		}

		var announcements []repo.Announcement
		var total int64

		// 构建查询
		tx := db.Model(&repo.Announcement{}).Preload("Author")

		// 搜索条件
		if query.Search != "" {
			tx = tx.Where("title ILIKE ? OR content ILIKE ?", "%"+query.Search+"%", "%"+query.Search+"%")
		}
		if query.Status != "" {
			tx = tx.Where("status = ?", query.Status)
		}

		// 获取总数
		tx.Count(&total)

		// 分页和排序
		offset := (query.Page - 1) * query.PerPage
		tx = tx.Order("created_at DESC").
			Offset(offset).
			Limit(query.PerPage).
			Find(&announcements)

		if tx.Error != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch announcements",
			})
		}

		// 计算总页数
		totalPages := int((total + int64(query.PerPage) - 1) / int64(query.PerPage))

		return c.JSON(types.PaginatedResponse{
			Success: true,
			Data:    announcements,
			Meta: types.PaginationMeta{
				Page:       query.Page,
				PerPage:    query.PerPage,
				Total:      total,
				TotalPages: totalPages,
			},
		})
	}
}

// 创建公告（管理员）
func CreateAnnouncement(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req types.CreateAnnouncementRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 获取当前用户ID（作者）
		authorID := c.Locals("uid").(uint)

		announcement := repo.Announcement{
			Title:    req.Title,
			Content:  req.Content,
			Status:   repo.AnnouncementDraft,
			AuthorID: authorID,
		}

		if err := db.Create(&announcement).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to create announcement",
			})
		}

		// 预加载作者信息
		db.Preload("Author").First(&announcement, announcement.ID)

		return c.Status(201).JSON(types.Response{
			Success: true,
			Message: "Announcement created successfully",
			Data:    announcement,
		})
	}
}

// 更新公告（管理员）
func UpdateAnnouncement(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		announcementID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid announcement ID",
			})
		}

		var req types.UpdateAnnouncementRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 检查公告是否存在
		var announcement repo.Announcement
		if err := db.First(&announcement, announcementID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Announcement not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch announcement",
			})
		}

		// 更新字段
		updates := make(map[string]interface{})
		if req.Title != "" {
			updates["title"] = req.Title
		}
		if req.Content != "" {
			updates["content"] = req.Content
		}
		if req.Status != "" {
			updates["status"] = req.Status
		}

		if err := db.Model(&announcement).Updates(updates).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update announcement",
			})
		}

		// 预加载作者信息
		db.Preload("Author").First(&announcement, announcement.ID)

		return c.JSON(types.Response{
			Success: true,
			Message: "Announcement updated successfully",
			Data:    announcement,
		})
	}
}

// 删除公告（管理员）
func DeleteAnnouncement(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		announcementID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid announcement ID",
			})
		}

		// 检查公告是否存在
		var announcement repo.Announcement
		if err := db.First(&announcement, announcementID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Announcement not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch announcement",
			})
		}

		// 删除公告
		if err := db.Delete(&announcement).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to delete announcement",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Announcement deleted successfully",
		})
	}
}

// 发布公告（管理员）
func PublishAnnouncement(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		announcementID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid announcement ID",
			})
		}

		// 检查公告是否存在
		var announcement repo.Announcement
		if err := db.First(&announcement, announcementID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Announcement not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch announcement",
			})
		}

		// 发布公告
		now := time.Now()
		if err := db.Model(&announcement).Updates(map[string]interface{}{
			"status":       repo.AnnouncementPublished,
			"published_at": &now,
		}).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to publish announcement",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Announcement published successfully",
		})
	}
}
