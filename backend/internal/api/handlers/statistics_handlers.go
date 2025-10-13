package handlers

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"maimang/backend/internal/repo"
)

// 统计数据响应结构
type StatisticsResponse struct {
	TotalUsers        int64   `json:"total_users"`
	NewUsersThisMonth int64   `json:"new_users_this_month"`
	UserGrowthRate    float64 `json:"user_growth_rate"`

	TotalWorks        int64   `json:"total_works"`
	NewWorksThisMonth int64   `json:"new_works_this_month"`
	WorkGrowthRate    float64 `json:"work_growth_rate"`

	TotalViews     int64   `json:"total_views"`
	ViewsThisMonth int64   `json:"views_this_month"`
	ViewGrowthRate float64 `json:"view_growth_rate"`

	TotalComments     int64   `json:"total_comments"`
	CommentsThisMonth int64   `json:"comments_this_month"`
	CommentGrowthRate float64 `json:"comment_growth_rate"`

	TotalActivities   int64 `json:"total_activities"`
	ActiveActivities  int64 `json:"active_activities"`
	TotalParticipants int64 `json:"total_participants"`
}

// 用户增长趋势数据
type UserGrowthData struct {
	Month       string `json:"month"`
	NewUsers    int64  `json:"new_users"`
	ActiveUsers int64  `json:"active_users"`
}

// 内容发布趋势数据
type ContentTrendData struct {
	Category string `json:"category"`
	Count    int64  `json:"count"`
}

// 活动参与度数据
type ActivityParticipationData struct {
	Participated      int64   `json:"participated"`
	NotParticipated   int64   `json:"not_participated"`
	ParticipationRate float64 `json:"participation_rate"`
}

// 月度详细统计数据
type MonthlyStatsData struct {
	Month       string `json:"month"`
	NewUsers    int64  `json:"new_users"`
	NewWorks    int64  `json:"new_works"`
	TotalViews  int64  `json:"total_views"`
	NewComments int64  `json:"new_comments"`
	Activities  int64  `json:"activities"`
}

// 公共统计汇总（公开接口用）
type PublicStatsSummary struct {
	TotalUsers    int64 `json:"total_users"`
	TotalWorks    int64 `json:"total_works"`
	TotalViews    int64 `json:"total_views"`
	TotalComments int64 `json:"total_comments"`
}

// 获取公共统计汇总（无需管理员权限）
func GetPublicStatsSummary(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var summary PublicStatsSummary

		db.Model(&repo.User{}).Count(&summary.TotalUsers)
		db.Model(&repo.Work{}).Count(&summary.TotalWorks)
		db.Model(&repo.Work{}).Select("COALESCE(SUM(views), 0)").Scan(&summary.TotalViews)
		db.Model(&repo.Comment{}).Count(&summary.TotalComments)

		return c.JSON(fiber.Map{
			"success": true,
			"data":    summary,
		})
	}
}

// 获取仪表盘统计数据
func GetDashboardStats(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		now := time.Now()
		startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
		startOfLastMonth := startOfMonth.AddDate(0, -1, 0)

		var stats StatisticsResponse

		// 用户统计
		db.Model(&repo.User{}).Count(&stats.TotalUsers)
		db.Model(&repo.User{}).Where("created_at >= ?", startOfMonth).Count(&stats.NewUsersThisMonth)

		var lastMonthUsers int64
		db.Model(&repo.User{}).Where("created_at >= ? AND created_at < ?", startOfLastMonth, startOfMonth).Count(&lastMonthUsers)
		if lastMonthUsers > 0 {
			stats.UserGrowthRate = float64(stats.NewUsersThisMonth-lastMonthUsers) / float64(lastMonthUsers) * 100
		}

		// 作品统计
		db.Model(&repo.Work{}).Count(&stats.TotalWorks)
		db.Model(&repo.Work{}).Where("created_at >= ?", startOfMonth).Count(&stats.NewWorksThisMonth)

		var lastMonthWorks int64
		db.Model(&repo.Work{}).Where("created_at >= ? AND created_at < ?", startOfLastMonth, startOfMonth).Count(&lastMonthWorks)
		if lastMonthWorks > 0 {
			stats.WorkGrowthRate = float64(stats.NewWorksThisMonth-lastMonthWorks) / float64(lastMonthWorks) * 100
		}

		// 浏览量统计
		db.Model(&repo.Work{}).Select("COALESCE(SUM(views), 0)").Scan(&stats.TotalViews)
		db.Model(&repo.Work{}).Where("created_at >= ?", startOfMonth).Select("COALESCE(SUM(views), 0)").Scan(&stats.ViewsThisMonth)

		var lastMonthViews int64
		db.Model(&repo.Work{}).Where("created_at >= ? AND created_at < ?", startOfLastMonth, startOfMonth).Select("COALESCE(SUM(views), 0)").Scan(&lastMonthViews)
		if lastMonthViews > 0 {
			stats.ViewGrowthRate = float64(stats.ViewsThisMonth-lastMonthViews) / float64(lastMonthViews) * 100
		}

		// 评论统计
		db.Model(&repo.Comment{}).Count(&stats.TotalComments)
		db.Model(&repo.Comment{}).Where("created_at >= ?", startOfMonth).Count(&stats.CommentsThisMonth)

		var lastMonthComments int64
		db.Model(&repo.Comment{}).Where("created_at >= ? AND created_at < ?", startOfLastMonth, startOfMonth).Count(&lastMonthComments)
		if lastMonthComments > 0 {
			stats.CommentGrowthRate = float64(stats.CommentsThisMonth-lastMonthComments) / float64(lastMonthComments) * 100
		}

		// 活动统计
		db.Model(&repo.Activity{}).Count(&stats.TotalActivities)
		db.Model(&repo.Activity{}).Where("status IN ?", []string{"upcoming", "ongoing"}).Count(&stats.ActiveActivities)
		db.Model(&repo.ActivityParticipant{}).Count(&stats.TotalParticipants)

		return c.JSON(fiber.Map{
			"success": true,
			"data":    stats,
		})
	}
}

// 获取用户增长趋势数据
func GetUserGrowthStats(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		now := time.Now()
		var data []UserGrowthData

		// 获取最近10个月的数据
		for i := 9; i >= 0; i-- {
			month := now.AddDate(0, -i, 0)
			startOfMonth := time.Date(month.Year(), month.Month(), 1, 0, 0, 0, 0, month.Location())
			endOfMonth := startOfMonth.AddDate(0, 1, 0)

			var newUsers, activeUsers int64
			db.Model(&repo.User{}).Where("created_at >= ? AND created_at < ?", startOfMonth, endOfMonth).Count(&newUsers)

			// 活跃用户定义为当月有登录记录或发布作品的用户
			db.Table("users").
				Where("(last_login_at >= ? AND last_login_at < ?) OR id IN (SELECT DISTINCT author_id FROM works WHERE created_at >= ? AND created_at < ?)",
					startOfMonth, endOfMonth, startOfMonth, endOfMonth).
				Count(&activeUsers)

			data = append(data, UserGrowthData{
				Month:       fmt.Sprintf("%d月", int(month.Month())),
				NewUsers:    newUsers,
				ActiveUsers: activeUsers,
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"data":    data,
		})
	}
}

// 获取内容发布趋势数据
func GetContentTrendStats(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var data []ContentTrendData

		// 按作品类型统计
		types := []string{"poetry", "prose", "novel", "photo"}
		typeNames := map[string]string{
			"poetry": "诗歌",
			"prose":  "散文",
			"novel":  "小说",
			"photo":  "摄影配文",
		}

		for _, workType := range types {
			var count int64
			db.Model(&repo.Work{}).Where("type = ? AND status = ?", workType, "approved").Count(&count)
			data = append(data, ContentTrendData{
				Category: typeNames[workType],
				Count:    count,
			})
		}

		// 其他类型
		var otherCount int64
		db.Model(&repo.Work{}).Where("type NOT IN ? AND status = ?", types, "approved").Count(&otherCount)
		data = append(data, ContentTrendData{
			Category: "其他",
			Count:    otherCount,
		})

		return c.JSON(fiber.Map{
			"success": true,
			"data":    data,
		})
	}
}

// 获取活动参与度数据
func GetActivityParticipationStats(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var totalUsers, participatedUsers int64

		db.Model(&repo.User{}).Count(&totalUsers)
		db.Model(&repo.ActivityParticipant{}).Distinct("user_id").Count(&participatedUsers)

		notParticipated := totalUsers - participatedUsers
		participationRate := float64(participatedUsers) / float64(totalUsers) * 100

		data := ActivityParticipationData{
			Participated:      participatedUsers,
			NotParticipated:   notParticipated,
			ParticipationRate: participationRate,
		}

		return c.JSON(fiber.Map{
			"success": true,
			"data":    data,
		})
	}
}

// 获取月度详细统计数据
func GetMonthlyStats(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		now := time.Now()
		var data []MonthlyStatsData

		// 获取最近6个月的数据
		for i := 5; i >= 0; i-- {
			month := now.AddDate(0, -i, 0)
			startOfMonth := time.Date(month.Year(), month.Month(), 1, 0, 0, 0, 0, month.Location())
			endOfMonth := startOfMonth.AddDate(0, 1, 0)

			var newUsers, newWorks, totalViews, newComments, activities int64

			db.Model(&repo.User{}).Where("created_at >= ? AND created_at < ?", startOfMonth, endOfMonth).Count(&newUsers)
			db.Model(&repo.Work{}).Where("created_at >= ? AND created_at < ?", startOfMonth, endOfMonth).Count(&newWorks)
			db.Model(&repo.Work{}).Where("created_at >= ? AND created_at < ?", startOfMonth, endOfMonth).Select("COALESCE(SUM(views), 0)").Scan(&totalViews)
			db.Model(&repo.Comment{}).Where("created_at >= ? AND created_at < ?", startOfMonth, endOfMonth).Count(&newComments)
			db.Model(&repo.Activity{}).Where("created_at >= ? AND created_at < ?", startOfMonth, endOfMonth).Count(&activities)

			data = append(data, MonthlyStatsData{
				Month:       fmt.Sprintf("%d月", int(month.Month())),
				NewUsers:    newUsers,
				NewWorks:    newWorks,
				TotalViews:  totalViews,
				NewComments: newComments,
				Activities:  activities,
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"data":    data,
		})
	}
}
