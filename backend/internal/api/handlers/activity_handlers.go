package handlers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"maimang/backend/internal/repo"
	"maimang/backend/internal/types"
)

// 获取活动列表
func ListActivities(db *gorm.DB) fiber.Handler {
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
			query.SortBy = "date"
		}
		if query.SortDir == "" {
			query.SortDir = "asc"
		}

		var activities []repo.Activity
		var total int64

		// 构建查询（排除已删除的活动）
		tx := db.Model(&repo.Activity{}).Where("is_deleted = ?", false)

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
		tx = tx.Order(query.SortBy + " " + query.SortDir).
			Offset(offset).
			Limit(query.PerPage).
			Find(&activities)

		if tx.Error != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch activities",
			})
		}

		// 计算总页数
		totalPages := int((total + int64(query.PerPage) - 1) / int64(query.PerPage))

		return c.JSON(types.PaginatedResponse{
			Success: true,
			Data:    activities,
			Meta: types.PaginationMeta{
				Page:       query.Page,
				PerPage:    query.PerPage,
				Total:      total,
				TotalPages: totalPages,
			},
		})
	}
}

// 获取活动详情
func GetActivity(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		activityID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid activity ID",
			})
		}

		var activity repo.Activity
		if err := db.Where("is_deleted = ?", false).Preload("Participants").Preload("Participants.User").First(&activity, activityID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Activity not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch activity",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Data:    activity,
		})
	}
}

// 报名活动
func RegisterActivity(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		activityID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid activity ID",
			})
		}

		// 获取当前用户ID
		userID := c.Locals("uid").(uint)

		// 检查活动是否存在（排除已删除的活动）
		var activity repo.Activity
		if err := db.Where("is_deleted = ?", false).First(&activity, activityID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Activity not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch activity",
			})
		}

		// 检查活动状态
		if activity.Status != repo.ActivityUpcoming {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Activity is not open for registration",
			})
		}

		// 检查是否已报名
		var existingParticipant repo.ActivityParticipant
		if err := db.Where("activity_id = ? AND user_id = ?", activityID, userID).First(&existingParticipant).Error; err == nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Already registered for this activity",
			})
		}

		// 检查人数限制
		if activity.MaxParticipants > 0 && activity.CurrentParticipants >= activity.MaxParticipants {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Activity is full",
			})
		}

		// 创建报名记录
		participant := repo.ActivityParticipant{
			ActivityID: uint(activityID),
			UserID:     userID,
			Status:     "registered",
		}

		if err := db.Create(&participant).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to register for activity",
			})
		}

		// 更新活动参与人数
		db.Model(&activity).Update("current_participants", activity.CurrentParticipants+1)

		return c.Status(201).JSON(types.Response{
			Success: true,
			Message: "Successfully registered for activity",
		})
	}
}

// 取消报名活动
func UnregisterActivity(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		activityID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid activity ID",
			})
		}

		// 获取当前用户ID
		userID := c.Locals("uid").(uint)

		// 检查报名记录是否存在
		var participant repo.ActivityParticipant
		if err := db.Where("activity_id = ? AND user_id = ?", activityID, userID).First(&participant).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Not registered for this activity",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch registration",
			})
		}

		// 删除报名记录
		if err := db.Delete(&participant).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to unregister from activity",
			})
		}

		// 更新活动参与人数
		var activity repo.Activity
		db.First(&activity, activityID)
		if activity.CurrentParticipants > 0 {
			db.Model(&activity).Update("current_participants", activity.CurrentParticipants-1)
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Successfully unregistered from activity",
		})
	}
}

// 获取活动管理列表（管理员）
func ListAdminActivities(db *gorm.DB) fiber.Handler {
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

		var activities []repo.Activity
		var total int64

		// 构建查询（排除已删除的活动）
		tx := db.Model(&repo.Activity{}).Where("is_deleted = ?", false)

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
		tx = tx.Order("created_at DESC").
			Offset(offset).
			Limit(query.PerPage).
			Find(&activities)

		if tx.Error != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch activities",
			})
		}

		// 计算总页数
		totalPages := int((total + int64(query.PerPage) - 1) / int64(query.PerPage))

		return c.JSON(types.PaginatedResponse{
			Success: true,
			Data:    activities,
			Meta: types.PaginationMeta{
				Page:       query.Page,
				PerPage:    query.PerPage,
				Total:      total,
				TotalPages: totalPages,
			},
		})
	}
}

// 创建活动（管理员）
func CreateActivity(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req types.CreateActivityRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 解析日期
		date, err := time.Parse("2006-01-02", req.Date)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid date format",
			})
		}

		activity := repo.Activity{
			Title:               req.Title,
			Description:         req.Description,
			ImageURL:            req.ImageURL,
			Date:                date,
			Time:                req.Time,
			Location:            req.Location,
			Instructor:          req.Instructor,
			Status:              repo.ActivityUpcoming,
			MaxParticipants:     req.MaxParticipants,
			CurrentParticipants: 0,
		}

		if err := db.Create(&activity).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to create activity",
			})
		}

		return c.Status(201).JSON(types.Response{
			Success: true,
			Message: "Activity created successfully",
			Data:    activity,
		})
	}
}

// 更新活动（管理员）
func UpdateActivity(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		activityID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid activity ID",
			})
		}

		var req types.UpdateActivityRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 检查活动是否存在（排除已删除的活动）
		var activity repo.Activity
		if err := db.Where("is_deleted = ?", false).First(&activity, activityID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Activity not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch activity",
			})
		}

		// 更新字段
		updates := make(map[string]interface{})
		if req.Title != "" {
			updates["title"] = req.Title
		}
		if req.Description != "" {
			updates["description"] = req.Description
		}
		if req.ImageURL != "" {
			updates["image_url"] = req.ImageURL
		}
		if req.Date != "" {
			date, err := time.Parse("2006-01-02", req.Date)
			if err != nil {
				return c.Status(400).JSON(types.Response{
					Success: false,
					Error:   "Invalid date format",
				})
			}
			updates["date"] = date
		}
		if req.Time != "" {
			updates["time"] = req.Time
		}
		if req.Location != "" {
			updates["location"] = req.Location
		}
		if req.Instructor != "" {
			updates["instructor"] = req.Instructor
		}
		if req.MaxParticipants > 0 {
			updates["max_participants"] = req.MaxParticipants
		}
		if req.Status != "" {
			updates["status"] = req.Status
		}

		if err := db.Model(&activity).Updates(updates).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update activity",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Activity updated successfully",
			Data:    activity,
		})
	}
}

// 删除活动（管理员）
func DeleteActivity(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		activityID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid activity ID",
			})
		}

		// 检查活动是否存在（排除已删除的活动）
		var activity repo.Activity
		if err := db.Where("is_deleted = ?", false).First(&activity, activityID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Activity not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch activity",
			})
		}

		// 软删除活动
		if err := db.Model(&activity).Update("is_deleted", true).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to delete activity",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Activity deleted successfully",
		})
	}
}

// 获取活动参与者（管理员）
func GetActivityParticipants(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		activityID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid activity ID",
			})
		}

		var participants []repo.ActivityParticipant
		if err := db.Where("activity_id = ?", activityID).
			Preload("User").
			Order("created_at ASC").
			Find(&participants).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch participants",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Data:    participants,
		})
	}
}

// 更新活动状态（管理员）
func UpdateActivityStatus(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		activityID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid activity ID",
			})
		}

		var req struct {
			Status string `json:"status" validate:"required,oneof=upcoming ongoing completed cancelled"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 检查活动是否存在（排除已删除的活动）
		var activity repo.Activity
		if err := db.Where("is_deleted = ?", false).First(&activity, activityID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Activity not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch activity",
			})
		}

		// 更新状态
		if err := db.Model(&activity).Update("status", req.Status).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update activity status",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Activity status updated successfully",
		})
	}
}
