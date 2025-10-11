package handlers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"maimang/backend/internal/repo"
	"maimang/backend/internal/types"
)

// 获取仪表盘数据
func GetDashboardStats(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var stats types.DashboardStats

		// 统计用户数
		db.Model(&repo.User{}).Count(&stats.TotalUsers)

		// 统计作品数
		db.Model(&repo.Work{}).Count(&stats.TotalWorks)
		db.Model(&repo.Work{}).Where("status = ?", repo.WorkPending).Count(&stats.PendingWorks)

		// 统计活动数
		db.Model(&repo.Activity{}).Count(&stats.TotalActivities)
		db.Model(&repo.Activity{}).Where("status IN ?", []repo.ActivityStatus{repo.ActivityUpcoming, repo.ActivityOngoing}).Count(&stats.ActiveActivities)

		// 统计评论数
		db.Model(&repo.Comment{}).Count(&stats.TotalComments)
		db.Model(&repo.Comment{}).Where("status = ?", repo.CommentPending).Count(&stats.PendingComments)

		return c.JSON(types.Response{
			Success: true,
			Data:    stats,
		})
	}
}

// 获取用户统计
func GetUserStats(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var stats types.UserStats

		// 统计用户数
		db.Model(&repo.User{}).Count(&stats.TotalUsers)
		db.Model(&repo.User{}).Where("status = ?", "active").Count(&stats.ActiveUsers)
		db.Model(&repo.User{}).Where("status = ?", "banned").Count(&stats.BannedUsers)

		// 统计新用户（最近30天）
		thirtyDaysAgo := time.Now().AddDate(0, 0, -30)
		db.Model(&repo.User{}).Where("created_at >= ?", thirtyDaysAgo).Count(&stats.NewUsers)

		return c.JSON(types.Response{
			Success: true,
			Data:    stats,
		})
	}
}

// 获取作品统计
func GetWorkStats(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var stats types.WorkStats

		// 统计作品数
		db.Model(&repo.Work{}).Count(&stats.TotalWorks)
		db.Model(&repo.Work{}).Where("status = ?", repo.WorkApproved).Count(&stats.ApprovedWorks)
		db.Model(&repo.Work{}).Where("status = ?", repo.WorkPending).Count(&stats.PendingWorks)
		db.Model(&repo.Work{}).Where("status = ?", repo.WorkRejected).Count(&stats.RejectedWorks)

		// 统计浏览量和点赞数
		db.Model(&repo.Work{}).Select("COALESCE(SUM(views), 0)").Scan(&stats.TotalViews)
		db.Model(&repo.Work{}).Select("COALESCE(SUM(likes), 0)").Scan(&stats.TotalLikes)

		return c.JSON(types.Response{
			Success: true,
			Data:    stats,
		})
	}
}

// 获取活动统计
func GetActivityStats(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var stats types.ActivityStats

		// 统计活动数（排除已删除的活动）
		db.Model(&repo.Activity{}).Where("is_deleted = ?", false).Count(&stats.TotalActivities)
		db.Model(&repo.Activity{}).Where("is_deleted = ? AND status = ?", false, repo.ActivityUpcoming).Count(&stats.UpcomingActivities)
		db.Model(&repo.Activity{}).Where("is_deleted = ? AND status = ?", false, repo.ActivityOngoing).Count(&stats.OngoingActivities)
		db.Model(&repo.Activity{}).Where("is_deleted = ? AND status = ?", false, repo.ActivityCompleted).Count(&stats.CompletedActivities)

		// 统计参与者数（只统计未删除活动的参与者）
		db.Model(&repo.ActivityParticipant{}).
			Joins("JOIN activities ON activity_participants.activity_id = activities.id").
			Where("activities.is_deleted = ?", false).
			Count(&stats.TotalParticipants)

		return c.JSON(types.Response{
			Success: true,
			Data:    stats,
		})
	}
}

// 获取用户列表（管理员）
func ListUsers(db *gorm.DB) fiber.Handler {
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

		var users []repo.User
		var total int64

		// 构建查询
		tx := db.Model(&repo.User{})

		// 搜索条件
		if query.Search != "" {
			tx = tx.Where("name ILIKE ? OR email ILIKE ?", "%"+query.Search+"%", "%"+query.Search+"%")
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
			Find(&users)

		if tx.Error != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch users",
			})
		}

		// 计算总页数
		totalPages := int((total + int64(query.PerPage) - 1) / int64(query.PerPage))

		return c.JSON(types.PaginatedResponse{
			Success: true,
			Data:    users,
			Meta: types.PaginationMeta{
				Page:       query.Page,
				PerPage:    query.PerPage,
				Total:      total,
				TotalPages: totalPages,
			},
		})
	}
}

// 更新用户状态
func UpdateUserStatus(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid user ID",
			})
		}

		var req types.UpdateUserStatusRequest
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

		// 更新状态
		if err := db.Model(&user).Update("status", req.Status).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update user status",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "User status updated successfully",
		})
	}
}

// 获取管理员列表
func ListAdmins(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var admins []repo.User

		// 只获取管理员角色的用户
		if err := db.Where("role IN ?", []repo.Role{repo.RoleAdmin, repo.RoleSuperAdmin, repo.RoleEditor, repo.RoleReviewer}).
			Order("created_at DESC").
			Find(&admins).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch admins",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Data:    admins,
		})
	}
}

// 创建管理员
func CreateAdmin(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req types.CreateAdminRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 检查邮箱是否已存在
		var existingUser repo.User
		if err := db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Email already exists",
			})
		}

		// 创建管理员
		admin := repo.User{
			Name:     req.Name,
			Email:    req.Email,
			Password: req.Password, // 注意：这里应该加密密码
			Role:     repo.Role(req.Role),
			Status:   "active",
		}

		if err := db.Create(&admin).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to create admin",
			})
		}

		// 清除密码字段
		admin.Password = ""

		return c.Status(201).JSON(types.Response{
			Success: true,
			Message: "Admin created successfully",
			Data:    admin,
		})
	}
}

// 更新管理员
func UpdateAdmin(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		adminID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid admin ID",
			})
		}

		var req types.UpdateAdminRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 检查管理员是否存在
		var admin repo.User
		if err := db.First(&admin, adminID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Admin not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch admin",
			})
		}

		// 检查是否为超级管理员（不能修改）
		if admin.Role == repo.RoleSuperAdmin {
			return c.Status(403).JSON(types.Response{
				Success: false,
				Error:   "Cannot modify super admin",
			})
		}

		// 更新字段
		updates := make(map[string]interface{})
		if req.Name != "" {
			updates["name"] = req.Name
		}
		if req.Role != "" {
			updates["role"] = req.Role
		}

		if err := db.Model(&admin).Updates(updates).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update admin",
			})
		}

		// 清除密码字段
		admin.Password = ""

		return c.JSON(types.Response{
			Success: true,
			Message: "Admin updated successfully",
			Data:    admin,
		})
	}
}

// 删除管理员
func DeleteAdmin(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		adminID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid admin ID",
			})
		}

		// 检查管理员是否存在
		var admin repo.User
		if err := db.First(&admin, adminID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Admin not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch admin",
			})
		}

		// 检查是否为超级管理员（不能删除）
		if admin.Role == repo.RoleSuperAdmin {
			return c.Status(403).JSON(types.Response{
				Success: false,
				Error:   "Cannot delete super admin",
			})
		}

		// 删除管理员
		if err := db.Delete(&admin).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to delete admin",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Admin deleted successfully",
		})
	}
}
