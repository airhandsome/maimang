package handlers

import (
	"encoding/json"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"maimang/backend/internal/repo"
	"maimang/backend/internal/types"
)

// 获取个人资料
func GetProfile(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		log.Printf("=== GetProfile API Called ===")

		// 获取当前用户ID
		userID := c.Locals("uid").(uint)
		log.Printf("User ID: %d", userID)

		var user repo.User
		if err := db.First(&user, userID).Error; err != nil {
			log.Printf("Database error: %v", err)
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "User not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch user",
			})
		}

		// 清除密码字段
		user.Password = ""

		// 解析Tags JSON
		var tags []string
		if user.Tags != "" {
			if err := json.Unmarshal([]byte(user.Tags), &tags); err != nil {
				log.Printf("Error parsing tags: %v", err)
				tags = []string{}
			}
		}

		// 构建响应数据
		profileData := map[string]interface{}{
			"id":         user.ID,
			"name":       user.Name,
			"email":      user.Email,
			"gender":     user.Gender,
			"phone":      user.Phone,
			"bio":        user.Bio,
			"avatar":     user.AvatarURL,
			"tags":       tags,
			"weibo":      user.Weibo,
			"wechat":     user.Wechat,
			"role":       user.Role,
			"status":     user.Status,
			"created_at": user.CreatedAt,
			"updated_at": user.UpdatedAt,
		}

		log.Printf("Profile data: %+v", profileData)

		return c.JSON(types.Response{
			Success: true,
			Data:    profileData,
		})
	}
}

// 更新个人资料
func UpdateProfile(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		log.Printf("=== UpdateProfile API Called ===")
		log.Printf("Request Body: %s", string(c.Body()))

		// 获取当前用户ID
		userID := c.Locals("uid").(uint)
		log.Printf("User ID: %d", userID)

		// 解析请求体
		var req map[string]interface{}
		if err := c.BodyParser(&req); err != nil {
			log.Printf("BodyParser error: %v", err)
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		log.Printf("Parsed request: %+v", req)

		// 检查用户是否存在
		var user repo.User
		if err := db.First(&user, userID).Error; err != nil {
			log.Printf("Database error: %v", err)
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "User not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch user",
			})
		}

		// 更新字段
		updates := make(map[string]interface{})

		if name, ok := req["name"].(string); ok && name != "" {
			updates["name"] = name
		}
		if avatar, ok := req["avatar"].(string); ok && avatar != "" {
			log.Printf("Updating avatar: %s", avatar)
			updates["avatar_url"] = avatar
		}
		if bio, ok := req["bio"].(string); ok {
			updates["bio"] = bio
		}
		if gender, ok := req["gender"].(string); ok {
			updates["gender"] = gender
		}
		if phone, ok := req["phone"].(string); ok {
			updates["phone"] = phone
		}
		if weibo, ok := req["weibo"].(string); ok {
			updates["weibo"] = weibo
		}
		if wechat, ok := req["wechat"].(string); ok {
			updates["wechat"] = wechat
		}

		// 处理tags数组
		if tags, ok := req["tags"].([]interface{}); ok {
			tagsJSON, err := json.Marshal(tags)
			if err != nil {
				log.Printf("Error marshaling tags: %v", err)
			} else {
				updates["tags"] = string(tagsJSON)
			}
		}

		log.Printf("Updates: %+v", updates)

		if err := db.Model(&user).Updates(updates).Error; err != nil {
			log.Printf("Update error: %v", err)
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update profile",
			})
		}

		// 重新获取用户数据
		if err := db.First(&user, userID).Error; err != nil {
			log.Printf("Error fetching updated user: %v", err)
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch updated user",
			})
		}

		log.Printf("Updated user avatar: %s", user.AvatarURL)

		// 清除密码字段
		user.Password = ""

		// 解析Tags JSON
		var tags []string
		if user.Tags != "" {
			if err := json.Unmarshal([]byte(user.Tags), &tags); err != nil {
				log.Printf("Error parsing tags: %v", err)
				tags = []string{}
			}
		}

		// 构建响应数据
		profileData := map[string]interface{}{
			"id":         user.ID,
			"name":       user.Name,
			"email":      user.Email,
			"gender":     user.Gender,
			"phone":      user.Phone,
			"bio":        user.Bio,
			"avatar":     user.AvatarURL,
			"tags":       tags,
			"weibo":      user.Weibo,
			"wechat":     user.Wechat,
			"role":       user.Role,
			"status":     user.Status,
			"created_at": user.CreatedAt,
			"updated_at": user.UpdatedAt,
		}

		log.Printf("Updated profile data: %+v", profileData)

		return c.JSON(types.Response{
			Success: true,
			Message: "Profile updated successfully",
			Data:    profileData,
		})
	}
}

// 获取我的作品
func GetMyWorks(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// 获取当前用户ID
		userID := c.Locals("uid").(uint)

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
		tx := db.Model(&repo.Work{}).Where("author_id = ?", userID)

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
		tx = tx.Order("created_at DESC").
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

// 获取我的活动
func GetMyActivities(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// 获取当前用户ID
		userID := c.Locals("uid").(uint)

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

		// 构建查询 - 通过参与者表关联
		tx := db.Model(&repo.Activity{}).
			Joins("JOIN activity_participants ON activities.id = activity_participants.activity_id").
			Where("activity_participants.user_id = ?", userID)

		// 搜索条件
		if query.Search != "" {
			tx = tx.Where("activities.title ILIKE ? OR activities.description ILIKE ?", "%"+query.Search+"%", "%"+query.Search+"%")
		}
		if query.Status != "" {
			tx = tx.Where("activities.status = ?", query.Status)
		}

		// 获取总数
		tx.Count(&total)

		// 分页和排序
		offset := (query.Page - 1) * query.PerPage
		tx = tx.Order("activities.date ASC").
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

// 获取通知（模拟数据）
func GetNotifications(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// 这里可以扩展为真正的通知系统
		// 目前返回模拟数据
		// userID := c.Locals("userID").(uint) // 将来用于获取用户特定通知
		notifications := []map[string]interface{}{
			{
				"id":      1,
				"type":    "work_approved",
				"title":   "作品审核通过",
				"content": "您的作品《秋日麦浪》已通过审核并发布",
				"time":    "2小时前",
				"read":    false,
			},
			{
				"id":      2,
				"type":    "activity_reminder",
				"title":   "活动提醒",
				"content": "您报名的\"秋日田野采风\"活动将于明天开始",
				"time":    "1天前",
				"read":    true,
			},
			{
				"id":      3,
				"type":    "comment",
				"title":   "新评论",
				"content": "有人评论了您的作品《秋日麦浪》",
				"time":    "3天前",
				"read":    true,
			},
		}

		return c.JSON(types.Response{
			Success: true,
			Data:    notifications,
		})
	}
}

// 获取用户详情（管理员）
func GetUser(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid user ID",
			})
		}

		var user repo.User
		if err := db.First(&user, userID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "User not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch user",
			})
		}

		// 清除密码字段
		user.Password = ""

		return c.JSON(types.Response{
			Success: true,
			Data:    user,
		})
	}
}

// 更新用户信息（管理员）
func UpdateUser(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid user ID",
			})
		}

		var req types.UpdateUserRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 检查用户是否存在
		var user repo.User
		if err := db.First(&user, userID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "User not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch user",
			})
		}

		// 更新字段
		updates := make(map[string]interface{})
		if req.Name != "" {
			updates["name"] = req.Name
		}
		if req.AvatarURL != "" {
			updates["avatar_url"] = req.AvatarURL
		}
		if req.Bio != "" {
			updates["bio"] = req.Bio
		}

		if err := db.Model(&user).Updates(updates).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update user",
			})
		}

		// 清除密码字段
		user.Password = ""

		return c.JSON(types.Response{
			Success: true,
			Message: "User updated successfully",
			Data:    user,
		})
	}
}

// 删除用户（管理员）
func DeleteUser(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid user ID",
			})
		}

		// 检查用户是否存在
		var user repo.User
		if err := db.First(&user, userID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "User not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch user",
			})
		}

		// 检查是否为超级管理员（不能删除）
		if user.Role == repo.RoleSuperAdmin {
			return c.Status(403).JSON(types.Response{
				Success: false,
				Error:   "Cannot delete super admin",
			})
		}

		// 删除用户
		if err := db.Delete(&user).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to delete user",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "User deleted successfully",
		})
	}
}
