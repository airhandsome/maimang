package main

import (
	"fmt"
	"time"

	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"maimang/backend/internal/repo"
)

var seedCmd = &cobra.Command{
	Use:   "seed",
	Short: "Seed database with demo data",
	RunE: func(cmd *cobra.Command, args []string) error {
		loadConfig()

		logger := logrus.New()

		dsn := viper.GetString("DATABASE_URL")
		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			return fmt.Errorf("connect db: %w", err)
		}

		// migrate
		if err := db.AutoMigrate(
			&repo.User{},
			&repo.Article{},
			&repo.Event{},
			&repo.Album{},
			&repo.Work{},
			&repo.Comment{},
			&repo.Activity{},
			&repo.ActivityParticipant{},
			&repo.Carousel{},
			&repo.Announcement{},
			&repo.SystemSetting{},
			&repo.Material{},
		); err != nil {
			return fmt.Errorf("migrate: %w", err)
		}

		// seed admin user
		var userCount int64
		db.Model(&repo.User{}).Count(&userCount)
		if userCount == 0 {
			pw, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
			admin := repo.User{
				Name:     "王管理员",
				Email:    "admin@maimang.com",
				Password: string(pw),
				Role:     repo.RoleSuperAdmin,
				Status:   "active",
			}
			_ = db.Create(&admin).Error

			// 创建普通用户
			users := []repo.User{
				{Name: "张小明", Email: "zhangxiaoming@example.com", Password: string(pw), Role: repo.RoleMember, Status: "active"},
				{Name: "李小红", Email: "lixiaohong@example.com", Password: string(pw), Role: repo.RoleMember, Status: "active"},
				{Name: "王小华", Email: "wangxiaohua@example.com", Password: string(pw), Role: repo.RoleEditor, Status: "active"},
				{Name: "赵小强", Email: "zhaoxiaoqiang@example.com", Password: string(pw), Role: repo.RoleMember, Status: "inactive"},
			}
			_ = db.Create(&users).Error
		}

		// 确保有足够的用户用于后续数据创建
		var totalUserCount int64
		db.Model(&repo.User{}).Count(&totalUserCount)
		if totalUserCount < 4 {
			// 如果用户数量不足，补充创建用户
			pw, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
			additionalUsers := []repo.User{
				{Name: "张小明", Email: "zhangxiaoming@example.com", Password: string(pw), Role: repo.RoleMember, Status: "active"},
				{Name: "李小红", Email: "lixiaohong@example.com", Password: string(pw), Role: repo.RoleMember, Status: "active"},
				{Name: "王小华", Email: "wangxiaohua@example.com", Password: string(pw), Role: repo.RoleEditor, Status: "active"},
				{Name: "赵小强", Email: "zhaoxiaoqiang@example.com", Password: string(pw), Role: repo.RoleMember, Status: "inactive"},
			}
			_ = db.Create(&additionalUsers).Error
		}

		// seed demo articles if empty
		var artCount int64
		db.Model(&repo.Article{}).Count(&artCount)
		if artCount == 0 {
			arts := []repo.Article{
				{Title: "金色麦浪", Slug: "golden-field", Summary: "关于丰收与成长的随笔", CoverURL: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", Status: repo.ArticlePublished},
				{Title: "青春与诗", Slug: "youth-and-poem", Summary: "校园诗会合集", CoverURL: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6", Status: repo.ArticlePublished},
			}
			_ = db.Create(&arts).Error
		}

		// seed demo events if empty
		var evtCount int64
		db.Model(&repo.Event{}).Count(&evtCount)
		if evtCount == 0 {
			start := time.Now().Add(72 * time.Hour)
			end := start.Add(2 * time.Hour)
			evts := []repo.Event{
				{Title: "秋日朗诵会", Description: "诗与远方的夜晚", BannerURL: "https://images.unsplash.com/photo-1520975916090-3105956dac38", StartAt: &start, EndAt: &end, Location: "学生活动中心", Status: repo.EventOpen},
			}
			_ = db.Create(&evts).Error
		}

		// seed demo albums if empty
		var albCount int64
		db.Model(&repo.Album{}).Count(&albCount)
		if albCount == 0 {
			albs := []repo.Album{
				{Title: "社团掠影", Description: "活动日常", CoverURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"},
			}
			_ = db.Create(&albs).Error
		}

		// seed demo works if empty
		var workCount int64
		db.Model(&repo.Work{}).Count(&workCount)
		if workCount == 0 {
			// 获取用户ID
			var users []repo.User
			db.Find(&users)
			if len(users) > 0 {
				// 创建更多样化的作品数据
				works := []repo.Work{
					// 诗歌类
					{Title: "《秋日麦浪》", Type: repo.WorkTypePoetry, Content: "风吹过田野的轮廓\n麦穗低垂，如时光的重量\n每一粒果实里，都藏着\n整个夏天的阳光", Status: repo.WorkApproved, AuthorID: users[1].ID, Views: 128, Likes: 36, CreatedAt: time.Now().AddDate(0, -2, -5)},
					{Title: "《城市边缘》", Type: repo.WorkTypePoetry, Content: "高楼吞噬了最后的绿地\n钢筋水泥的森林里\n人们行色匆匆\n忘记了泥土的芬芳", Status: repo.WorkRejected, AuthorID: users[2].ID, Views: 45, Likes: 8, RejectReason: "作品主题与文学社\"田野文学\"定位偏差较大，建议增加自然元素或调整创作角度。", CreatedAt: time.Now().AddDate(0, -1, -10)},
					{Title: "《春之序曲》", Type: repo.WorkTypePoetry, Content: "嫩芽破土而出\n春风轻抚大地\n万物复苏的季节\n希望在心中萌芽", Status: repo.WorkApproved, AuthorID: users[0].ID, Views: 89, Likes: 23, CreatedAt: time.Now().AddDate(0, -3, -2)},
					{Title: "《夏夜星空》", Type: repo.WorkTypePoetry, Content: "繁星点点\n如钻石般闪烁\n夏夜的宁静\n让人心旷神怡", Status: repo.WorkApproved, AuthorID: users[1].ID, Views: 156, Likes: 42, CreatedAt: time.Now().AddDate(0, -1, -15)},

					// 散文类
					{Title: "《田野记忆》", Type: repo.WorkTypeProse, Content: "小时候，我常常在田野里奔跑，追逐着蝴蝶，听着鸟儿的歌唱。那些美好的回忆，如同珍珠般珍贵，永远闪耀在我心中。", Status: repo.WorkPending, AuthorID: users[3].ID, CreatedAt: time.Now().AddDate(0, 0, -3)},
					{Title: "《故乡的秋天》", Type: repo.WorkTypeProse, Content: "故乡的秋天总是那么美丽，金黄的稻谷在微风中摇摆，农民们脸上洋溢着丰收的喜悦。", Status: repo.WorkApproved, AuthorID: users[0].ID, Views: 203, Likes: 67, CreatedAt: time.Now().AddDate(0, -2, -8)},
					{Title: "《读书的乐趣》", Type: repo.WorkTypeProse, Content: "读书是一种享受，在书海中遨游，与古今中外的智者对话，感受知识的魅力。", Status: repo.WorkApproved, AuthorID: users[2].ID, Views: 134, Likes: 38, CreatedAt: time.Now().AddDate(0, -1, -20)},

					// 小说类
					{Title: "《麦田守望者》", Type: repo.WorkTypeNovel, Content: "在一个宁静的小村庄里，住着一个年轻的农夫，他每天都会来到麦田边，静静地守望着这片金色的海洋...", Status: repo.WorkApproved, AuthorID: users[1].ID, Views: 312, Likes: 89, CreatedAt: time.Now().AddDate(0, -2, -12)},
					{Title: "《青春岁月》", Type: repo.WorkTypeNovel, Content: "青春是一本太仓促的书，我们含着泪，一读再读。那些年少的梦想，那些纯真的友谊，都成为了最珍贵的回忆。", Status: repo.WorkApproved, AuthorID: users[0].ID, Views: 278, Likes: 76, CreatedAt: time.Now().AddDate(0, -1, -5)},

					// 摄影配文类
					{Title: "《夕阳下的麦田》", Type: repo.WorkTypePhoto, Content: "夕阳西下，金色的阳光洒在麦田上，形成了一幅美丽的画卷。这一刻，时间仿佛静止了。", Status: repo.WorkApproved, AuthorID: users[2].ID, Views: 189, Likes: 54, CreatedAt: time.Now().AddDate(0, 0, -7)},
					{Title: "《晨露》", Type: repo.WorkTypePhoto, Content: "清晨的露珠在草叶上闪闪发光，如同大自然馈赠的珍珠，纯净而美丽。", Status: repo.WorkApproved, AuthorID: users[3].ID, Views: 167, Likes: 41, CreatedAt: time.Now().AddDate(0, 0, -10)},
				}
				_ = db.Create(&works).Error
			}
		}

		// seed demo activities if empty
		var activityCount int64
		db.Model(&repo.Activity{}).Count(&activityCount)
		if activityCount == 0 {
			activities := []repo.Activity{
				{
					Title:               "秋日田野采风",
					Description:         "组织社员前往青禾农场进行秋日田野采风活动，体验丰收的喜悦，拍摄田野风光，感受大自然的魅力。",
					ImageURL:            "https://picsum.photos/id/175/800/400",
					Date:                time.Now().Add(48 * time.Hour),
					Time:                "09:00-16:00",
					Location:            "青禾农场",
					Instructor:          "李老师（摄影指导）",
					Status:              repo.ActivityUpcoming,
					MaxParticipants:     30,
					CurrentParticipants: 24,
				},
				{
					Title:               "诗歌创作工作坊",
					Description:         "特邀本地诗人王老师指导社员进行诗歌创作，分享创作心得，提升文学素养。",
					ImageURL:            "https://picsum.photos/id/176/800/400",
					Date:                time.Now().Add(168 * time.Hour),
					Time:                "14:00-17:30",
					Location:            "麦田书屋",
					Instructor:          "王老师（本地诗人）",
					Status:              repo.ActivityUpcoming,
					MaxParticipants:     25,
					CurrentParticipants: 18,
				},
			}
			_ = db.Create(&activities).Error
		}

		// seed demo carousels if empty
		var carouselCount int64
		db.Model(&repo.Carousel{}).Count(&carouselCount)
		if carouselCount == 0 {
			carousels := []repo.Carousel{
				{
					Title:       "秋日创作大赛",
					ImageURL:    "https://picsum.photos/id/175/800/400",
					LinkURL:     "/activities/1",
					Description: "欢迎参加秋日创作大赛",
					Status:      repo.CarouselActive,
					Order:       1,
				},
				{
					Title:       "文学沙龙活动",
					ImageURL:    "https://picsum.photos/id/176/800/400",
					LinkURL:     "/activities/2",
					Description: "文学沙龙活动预告",
					Status:      repo.CarouselActive,
					Order:       2,
				},
				{
					Title:       "新书推荐",
					ImageURL:    "https://picsum.photos/id/177/800/400",
					LinkURL:     "/articles/1",
					Description: "最新图书推荐",
					Status:      repo.CarouselInactive,
					Order:       3,
				},
			}
			_ = db.Create(&carousels).Error
		}

		// seed demo announcements if empty
		var announcementCount int64
		db.Model(&repo.Announcement{}).Count(&announcementCount)
		if announcementCount == 0 {
			var users []repo.User
			db.Find(&users)
			if len(users) > 0 {
				now := time.Now()
				announcements := []repo.Announcement{
					{
						Title:       "秋日创作大赛开始报名",
						Content:     "麦芒文学社秋日创作大赛正式开始报名，欢迎各位社员积极参与！",
						Status:      repo.AnnouncementPublished,
						PublishedAt: &now,
						AuthorID:    users[0].ID,
					},
					{
						Title:       "系统维护通知",
						Content:     "系统将于本周六进行维护升级，期间可能影响正常使用。",
						Status:      repo.AnnouncementPublished,
						PublishedAt: &now,
						AuthorID:    users[0].ID,
					},
					{
						Title:    "新功能上线预告",
						Content:  "我们即将推出新的功能，敬请期待！",
						Status:   repo.AnnouncementDraft,
						AuthorID: users[0].ID,
					},
				}
				_ = db.Create(&announcements).Error
			}
		}

		// seed system settings if empty
		var settingCount int64
		db.Model(&repo.SystemSetting{}).Count(&settingCount)
		if settingCount == 0 {
			settings := []repo.SystemSetting{
				{Key: "site_name", Value: "麦芒文学社", Type: "string"},
				{Key: "site_description", Value: "一个专注于文学创作和交流的社区平台", Type: "string"},
				{Key: "site_domain", Value: "www.maimang.com", Type: "string"},
				{Key: "admin_email", Value: "admin@maimang.com", Type: "string"},
				{Key: "contact_phone", Value: "400-123-4567", Type: "string"},
				{Key: "contact_wechat", Value: "maimang_wx", Type: "string"},
				{Key: "contact_weibo", Value: "@麦芒文学社", Type: "string"},
				{Key: "contact_qq", Value: "123456789", Type: "string"},
				{Key: "max_file_size", Value: "10", Type: "int"},
				{Key: "auto_approve_works", Value: "false", Type: "bool"},
				{Key: "require_email_verification", Value: "true", Type: "bool"},
				{Key: "enable_comments", Value: "true", Type: "bool"},
				{Key: "enable_user_registration", Value: "true", Type: "bool"},
				{Key: "maintenance_mode", Value: "false", Type: "bool"},
			}
			_ = db.Create(&settings).Error
		}

		// seed demo comments if empty
		var commentCount int64
		db.Model(&repo.Comment{}).Count(&commentCount)
		if commentCount == 0 {
			var users []repo.User
			var works []repo.Work
			db.Find(&users)
			db.Find(&works)
			if len(users) > 0 && len(works) > 0 {
				// 确保有足够的用户和作品
				userCount := len(users)
				workCount := len(works)

				comments := []repo.Comment{
					{Content: "写得真好！很有诗意", Status: repo.CommentApproved, AuthorID: users[0].ID, WorkID: works[0].ID, Likes: 5, CreatedAt: time.Now().AddDate(0, -1, -5)},
				}

				if userCount > 1 && workCount > 0 {
					comments = append(comments, repo.Comment{Content: "作者的文字功底很深厚", Status: repo.CommentApproved, AuthorID: users[1].ID, WorkID: works[0].ID, Likes: 3, CreatedAt: time.Now().AddDate(0, -1, -3)})
				}

				if userCount > 2 && workCount > 0 {
					comments = append(comments, repo.Comment{Content: "让我想起了家乡的麦田", Status: repo.CommentApproved, AuthorID: users[2].ID, WorkID: works[0].ID, Likes: 7, CreatedAt: time.Now().AddDate(0, -1, -1)})
				}

				if userCount > 0 && workCount > 1 {
					comments = append(comments, repo.Comment{Content: "这篇散文很有感染力", Status: repo.CommentApproved, AuthorID: users[0].ID, WorkID: works[1].ID, Likes: 4, CreatedAt: time.Now().AddDate(0, -2, -10)})
				}

				if userCount > 1 && workCount > 1 {
					comments = append(comments, repo.Comment{Content: "作者的观察很细致", Status: repo.CommentApproved, AuthorID: users[1].ID, WorkID: works[1].ID, Likes: 2, CreatedAt: time.Now().AddDate(0, -2, -8)})
				}

				if userCount > 2 && workCount > 2 {
					comments = append(comments, repo.Comment{Content: "小说情节很吸引人", Status: repo.CommentApproved, AuthorID: users[2].ID, WorkID: works[2].ID, Likes: 6, CreatedAt: time.Now().AddDate(0, -1, -15)})
				}

				if userCount > 3 && workCount > 2 {
					comments = append(comments, repo.Comment{Content: "期待后续章节", Status: repo.CommentApproved, AuthorID: users[3].ID, WorkID: works[2].ID, Likes: 3, CreatedAt: time.Now().AddDate(0, -1, -12)})
				}

				if userCount > 0 && workCount > 3 {
					comments = append(comments, repo.Comment{Content: "照片拍得很美", Status: repo.CommentApproved, AuthorID: users[0].ID, WorkID: works[3].ID, Likes: 8, CreatedAt: time.Now().AddDate(0, 0, -5)})
				}

				if userCount > 1 && workCount > 3 {
					comments = append(comments, repo.Comment{Content: "配文也很棒", Status: repo.CommentApproved, AuthorID: users[1].ID, WorkID: works[3].ID, Likes: 4, CreatedAt: time.Now().AddDate(0, 0, -3)})
				}

				if userCount > 2 && workCount > 4 {
					comments = append(comments, repo.Comment{Content: "很有意境", Status: repo.CommentApproved, AuthorID: users[2].ID, WorkID: works[4].ID, Likes: 5, CreatedAt: time.Now().AddDate(0, 0, -2)})
				}

				_ = db.Create(&comments).Error
			}
		}

		// seed demo materials if empty
		var materialCount int64
		db.Model(&repo.Material{}).Count(&materialCount)
		if materialCount == 0 {
			var users []repo.User
			db.Find(&users)
			if len(users) > 0 {
				materials := []repo.Material{
					{
						Name:        "秋日麦田风景.jpg",
						Type:        repo.MaterialTypeImage,
						Size:        2350000, // 2.3 MB
						URL:         "https://picsum.photos/id/175/800/600",
						Description: "秋日麦田的美丽风景，适合作为诗歌配图",
						Tags:        `["风景", "麦田", "秋天", "自然"]`,
						UploaderID:  users[0].ID,
					},
					{
						Name:        "文学创作指南.pdf",
						Type:        repo.MaterialTypeDocument,
						Size:        1800000, // 1.8 MB
						URL:         "#",
						Description: "文学创作的基础指南和技巧分享",
						Tags:        `["指南", "创作", "文学", "技巧"]`,
						UploaderID:  users[0].ID,
					},
					{
						Name:        "诗歌朗诵视频.mp4",
						Type:        repo.MaterialTypeVideo,
						Size:        45200000, // 45.2 MB
						URL:         "#",
						Description: "经典诗歌的朗诵视频，用于学习参考",
						Tags:        `["朗诵", "诗歌", "视频", "学习"]`,
						UploaderID:  users[0].ID,
					},
				}
				_ = db.Create(&materials).Error
			}
		}

		logger.Info("seed completed")
		return nil
	},
}
