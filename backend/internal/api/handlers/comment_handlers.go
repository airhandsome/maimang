package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"maimang/backend/internal/repo"
	"maimang/backend/internal/types"
)

// 获取作品评论列表
func ListWorkComments(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		workID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid work ID",
			})
		}

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

		var comments []repo.Comment
		var total int64

		// 构建查询
		tx := db.Model(&repo.Comment{}).Where("work_id = ?", workID).Preload("Author")

		// 搜索条件
		if query.Search != "" {
			tx = tx.Where("content ILIKE ?", "%"+query.Search+"%")
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
			Find(&comments)

		if tx.Error != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch comments",
			})
		}

		// 计算总页数
		totalPages := int((total + int64(query.PerPage) - 1) / int64(query.PerPage))

		return c.JSON(types.PaginatedResponse{
			Success: true,
			Data:    comments,
			Meta: types.PaginationMeta{
				Page:       query.Page,
				PerPage:    query.PerPage,
				Total:      total,
				TotalPages: totalPages,
			},
		})
	}
}

// 发表评论
func CreateComment(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		workID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid work ID",
			})
		}

		var req types.CreateCommentRequest
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

		comment := repo.Comment{
			Content:  req.Content,
			Status:   repo.CommentPending,
			AuthorID: userID,
			WorkID:   uint(workID),
		}

		if err := db.Create(&comment).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to create comment",
			})
		}

		// 预加载作者信息
		db.Preload("Author").First(&comment, comment.ID)

		return c.Status(201).JSON(types.Response{
			Success: true,
			Message: "Comment created successfully",
			Data:    comment,
		})
	}
}

// 更新评论
func UpdateComment(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		commentID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid comment ID",
			})
		}

		var req types.UpdateCommentRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 获取当前用户ID
		userID := c.Locals("uid").(uint)

		// 检查评论是否存在
		var comment repo.Comment
		if err := db.First(&comment, commentID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Comment not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch comment",
			})
		}

		// 检查权限（只有作者可以修改）
		if comment.AuthorID != userID {
			return c.Status(403).JSON(types.Response{
				Success: false,
				Error:   "Permission denied",
			})
		}

		// 更新内容
		if err := db.Model(&comment).Update("content", req.Content).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update comment",
			})
		}

		// 预加载作者信息
		db.Preload("Author").First(&comment, comment.ID)

		return c.JSON(types.Response{
			Success: true,
			Message: "Comment updated successfully",
			Data:    comment,
		})
	}
}

// 删除评论
func DeleteComment(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		commentID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid comment ID",
			})
		}

		// 获取当前用户ID
		userID := c.Locals("uid").(uint)

		// 检查评论是否存在
		var comment repo.Comment
		if err := db.First(&comment, commentID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Comment not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch comment",
			})
		}

		// 检查权限（只有作者可以删除）
		if comment.AuthorID != userID {
			return c.Status(403).JSON(types.Response{
				Success: false,
				Error:   "Permission denied",
			})
		}

		// 删除评论
		if err := db.Delete(&comment).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to delete comment",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Comment deleted successfully",
		})
	}
}

// 点赞评论
func LikeComment(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		commentID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid comment ID",
			})
		}

		// 检查评论是否存在
		var comment repo.Comment
		if err := db.First(&comment, commentID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Comment not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch comment",
			})
		}

		// 增加点赞数
		if err := db.Model(&comment).Update("likes", comment.Likes+1).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to like comment",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Comment liked successfully",
		})
	}
}

// 获取待审核评论列表（管理员）
func ListPendingComments(db *gorm.DB) fiber.Handler {
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

		var comments []repo.Comment
		var total int64

		// 构建查询
		tx := db.Model(&repo.Comment{}).Preload("Author").Preload("Work")

		// 搜索条件
		if query.Search != "" {
			tx = tx.Where("content ILIKE ?", "%"+query.Search+"%")
		}
		if query.Status != "" {
			// 指定了状态时才按状态过滤；未指定时显示全部状态
			tx = tx.Where("status = ?", query.Status)
		}

		// 获取总数
		tx.Count(&total)

		// 分页和排序
		offset := (query.Page - 1) * query.PerPage
		tx = tx.Order("created_at ASC").
			Offset(offset).
			Limit(query.PerPage).
			Find(&comments)

		if tx.Error != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch comments",
			})
		}

		// 计算总页数
		totalPages := int((total + int64(query.PerPage) - 1) / int64(query.PerPage))

		return c.JSON(types.PaginatedResponse{
			Success: true,
			Data:    comments,
			Meta: types.PaginationMeta{
				Page:       query.Page,
				PerPage:    query.PerPage,
				Total:      total,
				TotalPages: totalPages,
			},
		})
	}
}

// 审核评论（管理员）
func ReviewComment(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		commentID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid comment ID",
			})
		}

		var req types.CommentReviewRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 获取当前用户ID（审核员）
		reviewerID := c.Locals("uid").(uint)

		// 检查评论是否存在
		var comment repo.Comment
		if err := db.First(&comment, commentID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Comment not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch comment",
			})
		}

		// 更新审核状态
		updates := map[string]interface{}{
			"reviewed_by": reviewerID,
		}

		switch req.Action {
		case "approve":
			updates["status"] = repo.CommentApproved
			updates["reviewed_at"] = gorm.Expr("NOW()")
		case "reject":
			updates["status"] = repo.CommentRejected
			updates["reviewed_at"] = gorm.Expr("NOW()")
		case "hide":
			updates["status"] = repo.CommentHidden
			updates["reviewed_at"] = gorm.Expr("NOW()")
		case "unhide":
			updates["status"] = repo.CommentApproved
			updates["reviewed_at"] = gorm.Expr("NOW()")
		case "pend":
			updates["status"] = repo.CommentPending
			updates["reviewed_at"] = gorm.Expr("NOW()")
		}

		if err := db.Model(&comment).Updates(updates).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to review comment",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Comment reviewed successfully",
		})
	}
}
