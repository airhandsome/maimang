package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"maimang/backend/internal/repo"
	"maimang/backend/internal/types"
)

// 获取作品列表
func ListWorks(db *gorm.DB) fiber.Handler {
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
		if query.SortBy == "" {
			query.SortBy = "created_at"
		}
		if query.SortDir == "" {
			query.SortDir = "desc"
		}

		var works []repo.Work
		var total int64

		// 构建查询
		tx := db.Model(&repo.Work{}).Preload("Author")

		// 搜索条件
		if query.Search != "" {
			tx = tx.Where("title ILIKE ? OR content ILIKE ?", "%"+query.Search+"%", "%"+query.Search+"%")
		}
		if query.Status != "" {
			tx = tx.Where("status = ?", query.Status)
		}
		if query.Type != "" {
			tx = tx.Where("type = ?", query.Type)
		}

		// 获取总数
		tx.Count(&total)

		// 分页和排序
		offset := (query.Page - 1) * query.PerPage
		tx = tx.Order(query.SortBy + " " + query.SortDir).
			Offset(offset).
			Limit(query.PerPage).
			Find(&works)

		if tx.Error != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch works",
			})
		}

		// 计算总页数
		totalPages := int((total + int64(query.PerPage) - 1) / int64(query.PerPage))

		return c.JSON(types.PaginatedResponse{
			Success: true,
			Data:    works,
			Meta: types.PaginationMeta{
				Page:       query.Page,
				PerPage:    query.PerPage,
				Total:      total,
				TotalPages: totalPages,
			},
		})
	}
}

// 获取作品详情
func GetWork(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		workID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid work ID",
			})
		}

		var work repo.Work
		if err := db.Preload("Author").Preload("Reviewer").First(&work, workID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Work not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch work",
			})
		}

		// 增加浏览量
		db.Model(&work).Update("views", work.Views+1)

		return c.JSON(types.Response{
			Success: true,
			Data:    work,
		})
	}
}

// 创建作品
func CreateWork(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req types.CreateWorkRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 获取当前用户ID（从JWT token中）
		userID := c.Locals("uid").(uint)

		work := repo.Work{
			Title:    req.Title,
			Type:     repo.WorkType(req.Type),
			Content:  req.Content,
			Status:   repo.WorkPending,
			AuthorID: userID,
		}

		if err := db.Create(&work).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to create work",
			})
		}

		// 预加载作者信息
		db.Preload("Author").First(&work, work.ID)

		return c.Status(201).JSON(types.Response{
			Success: true,
			Message: "Work created successfully",
			Data:    work,
		})
	}
}

// 更新作品
func UpdateWork(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		workID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid work ID",
			})
		}

		var req types.UpdateWorkRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 获取当前用户ID
		userID := c.Locals("uid").(uint)

		// 检查作品是否存在
		var work repo.Work
		if err := db.First(&work, workID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Work not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch work",
			})
		}

		// 检查权限（只有作者可以修改）
		if work.AuthorID != userID {
			return c.Status(403).JSON(types.Response{
				Success: false,
				Error:   "Permission denied",
			})
		}

		// 更新字段
		updates := make(map[string]interface{})
		if req.Title != "" {
			updates["title"] = req.Title
		}
		if req.Type != "" {
			updates["type"] = req.Type
		}
		if req.Content != "" {
			updates["content"] = req.Content
		}

		if err := db.Model(&work).Updates(updates).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update work",
			})
		}

		// 预加载作者信息
		db.Preload("Author").First(&work, work.ID)

		return c.JSON(types.Response{
			Success: true,
			Message: "Work updated successfully",
			Data:    work,
		})
	}
}

// 删除作品
func DeleteWork(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		workID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid work ID",
			})
		}

		// 获取当前用户ID
		userID := c.Locals("uid").(uint)

		// 检查作品是否存在
		var work repo.Work
		if err := db.First(&work, workID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Work not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch work",
			})
		}

		// 检查权限（只有作者可以删除）
		if work.AuthorID != userID {
			return c.Status(403).JSON(types.Response{
				Success: false,
				Error:   "Permission denied",
			})
		}

		// 删除作品
		if err := db.Delete(&work).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to delete work",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Work deleted successfully",
		})
	}
}

// 点赞作品
func LikeWork(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		workID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid work ID",
			})
		}

		// 检查作品是否存在
		var work repo.Work
		if err := db.First(&work, workID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Work not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch work",
			})
		}

		// 增加点赞数
		if err := db.Model(&work).Update("likes", work.Likes+1).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to like work",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Work liked successfully",
		})
	}
}

// 取消点赞作品
func UnlikeWork(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		workID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid work ID",
			})
		}

		// 检查作品是否存在
		var work repo.Work
		if err := db.First(&work, workID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Work not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch work",
			})
		}

		// 减少点赞数
		if work.Likes > 0 {
			if err := db.Model(&work).Update("likes", work.Likes-1).Error; err != nil {
				return c.Status(500).JSON(types.Response{
					Success: false,
					Error:   "Failed to unlike work",
				})
			}
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Work unliked successfully",
		})
	}
}

// 获取待审核作品列表（管理员）
func ListPendingWorks(db *gorm.DB) fiber.Handler {
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

		var works []repo.Work
		var total int64

		// 构建查询
		tx := db.Model(&repo.Work{}).Preload("Author").Where("status = ?", repo.WorkPending)

		// 搜索条件
		if query.Search != "" {
			tx = tx.Where("title ILIKE ? OR content ILIKE ?", "%"+query.Search+"%", "%"+query.Search+"%")
		}
		if query.Type != "" {
			tx = tx.Where("type = ?", query.Type)
		}

		// 获取总数
		tx.Count(&total)

		// 分页和排序
		offset := (query.Page - 1) * query.PerPage
		tx = tx.Order("created_at ASC").
			Offset(offset).
			Limit(query.PerPage).
			Find(&works)

		if tx.Error != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch pending works",
			})
		}

		// 计算总页数
		totalPages := int((total + int64(query.PerPage) - 1) / int64(query.PerPage))

		return c.JSON(types.PaginatedResponse{
			Success: true,
			Data:    works,
			Meta: types.PaginationMeta{
				Page:       query.Page,
				PerPage:    query.PerPage,
				Total:      total,
				TotalPages: totalPages,
			},
		})
	}
}

// 审核作品（管理员）
func ReviewWork(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		workID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid work ID",
			})
		}

		var req types.WorkReviewRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 获取当前用户ID（审核员）
		reviewerID := c.Locals("uid").(uint)

		// 检查作品是否存在
		var work repo.Work
		if err := db.First(&work, workID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Work not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch work",
			})
		}

		// 更新审核状态
		updates := map[string]interface{}{
			"reviewed_by": reviewerID,
			"reviewed_at": "NOW()",
		}

		if req.Action == "approve" {
			updates["status"] = repo.WorkApproved
			updates["review_note"] = req.Note
		} else if req.Action == "reject" {
			updates["status"] = repo.WorkRejected
			updates["reject_reason"] = req.Note
		}

		if err := db.Model(&work).Updates(updates).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to review work",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Work reviewed successfully",
		})
	}
}
