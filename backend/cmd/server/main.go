package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"maimang/backend/internal/api"
	"maimang/backend/internal/repo"
)

var rootCmd = &cobra.Command{
	Use:   "server",
	Short: "Literary club backend server",
}

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start API server",
	RunE: func(cmd *cobra.Command, args []string) error {
		loadConfig()

		logger := logrus.New()
		logger.SetFormatter(&logrus.TextFormatter{
			FullTimestamp:   true,
			TimestampFormat: "2006-01-02 15:04:05",
		})
		logger.SetLevel(logrus.DebugLevel)

		dsn := viper.GetString("DATABASE_URL")
		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			return fmt.Errorf("connect db: %w", err)
		}
		sqlDB, err := db.DB()
		if err != nil {
			return fmt.Errorf("db(): %w", err)
		}
		sqlDB.SetMaxOpenConns(10)
		sqlDB.SetMaxIdleConns(5)
		sqlDB.SetConnMaxLifetime(30 * time.Minute)

		app := fiber.New(fiber.Config{
			DisableStartupMessage: true,
			ErrorHandler: func(c *fiber.Ctx, err error) error {
				logger.Errorf("Request error: %v", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
			},
		})

		// 添加CORS中间件
		app.Use(func(c *fiber.Ctx) error {
			c.Set("Access-Control-Allow-Origin", "*")
			c.Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
			c.Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
			if c.Method() == "OPTIONS" {
				return c.SendStatus(204)
			}
			return c.Next()
		})

		// 添加请求日志中间件
		app.Use(func(c *fiber.Ctx) error {
			start := time.Now()
			logger.Debugf("Request: %s %s", c.Method(), c.Path())
			logger.Debugf("Headers: %v", c.GetReqHeaders())
			if c.Method() == "POST" || c.Method() == "PUT" {
				logger.Debugf("Body: %s", string(c.Body()))
			}
			err := c.Next()
			logger.Debugf("Response: %d in %v", c.Response().StatusCode(), time.Since(start))
			return err
		})

		// healthz & readyz
		app.Get("/healthz", func(c *fiber.Ctx) error { return c.SendStatus(http.StatusOK) })
		app.Get("/readyz", func(c *fiber.Ctx) error {
			if err := sqlDB.Ping(); err != nil {
				return c.SendStatus(http.StatusServiceUnavailable)
			}
			return c.SendStatus(http.StatusOK)
		})

		// api v1 ping
		apiV1 := app.Group("/api/v1")
		apiV1.Get("/ping", func(c *fiber.Ctx) error { return c.JSON(fiber.Map{"message": "pong"}) })

		// auto migrate
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

		// 添加唯一约束：一个用户只能参与一次活动
		if err := db.Exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_activity_user_unique ON activity_participants (activity_id, user_id)").Error; err != nil {
			log.Printf("Warning: failed to create unique index: %v", err)
		}

		// register routes
		api.RegisterRoutes(app, db)

		srvErr := make(chan error, 1)
		go func() { srvErr <- app.Listen(viper.GetString("API_ADDR")) }()

		// graceful shutdown
		stop := make(chan os.Signal, 1)
		signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
		select {
		case err := <-srvErr:
			return err
		case <-stop:
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancel()
			_ = app.ShutdownWithContext(ctx)
			_ = sqlDB.Close()
			logger.Info("server stopped")
			return nil
		}
	},
}

func loadConfig() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./backend")
	_ = viper.ReadInConfig() // optional

	viper.SetDefault("API_ADDR", ":8080")
	viper.SetDefault("JWT_SECRET", "dev-secret-change-me")
	viper.SetDefault("ACCESS_TOKEN_TTL", "2h")
	viper.SetDefault("REFRESH_TOKEN_TTL", "168h")
	viper.AutomaticEnv()
	viper.SetEnvPrefix("MM") // e.g. MM_API_ADDR
}

func main() {
	rootCmd.AddCommand(serveCmd)
	rootCmd.AddCommand(seedCmd)
	if err := rootCmd.Execute(); err != nil {
		log.Fatal(err)
	}
}
