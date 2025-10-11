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
		if err := db.AutoMigrate(&repo.User{}, &repo.Article{}, &repo.Event{}, &repo.Album{}); err != nil {
			return fmt.Errorf("migrate: %w", err)
		}

		// seed admin user
		var userCount int64
		db.Model(&repo.User{}).Count(&userCount)
		if userCount == 0 {
			pw, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
			admin := repo.User{Name: "Admin", Email: "admin@example.com", Password: string(pw), Role: repo.RoleAdmin}
			_ = db.Create(&admin).Error
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

		logger.Info("seed completed")
		return nil
	},
}
