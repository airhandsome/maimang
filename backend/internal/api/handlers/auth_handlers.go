package handlers

import (
	"log"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"

	"maimang/backend/internal/auth"
	"maimang/backend/internal/repo"

	"gorm.io/gorm"
)

type registerReq struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		log.Printf("=== Register API Called ===")
		log.Printf("Request Method: %s", c.Method())
		log.Printf("Request Path: %s", c.Path())
		log.Printf("Request Headers: %v", c.GetReqHeaders())
		log.Printf("Request Body: %s", string(c.Body()))

		var req registerReq
		if err := c.BodyParser(&req); err != nil {
			log.Printf("BodyParser error: %v", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad payload"})
		}

		log.Printf("Parsed request: %+v", req)

		req.Email = strings.TrimSpace(strings.ToLower(req.Email))
		if req.Email == "" || req.Password == "" || req.Name == "" {
			log.Printf("Missing fields - Email: %s, Password: %s, Name: %s", req.Email, req.Password, req.Name)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "missing fields"})
		}

		log.Printf("Generating password hash...")
		hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("Password hash error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "hash error"})
		}

		user := repo.User{Name: req.Name, Email: req.Email, Password: string(hashed), Role: repo.RoleMember}
		log.Printf("Creating user: %+v", user)

		if err := db.Create(&user).Error; err != nil {
			log.Printf("Database create error: %v", err)
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "email exists"})
		}

		log.Printf("User created successfully: ID=%d, Email=%s, Name=%s", user.ID, user.Email, user.Name)
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": user.ID, "email": user.Email, "name": user.Name})
	}
}

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req loginReq
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad payload"})
		}
		req.Email = strings.TrimSpace(strings.ToLower(req.Email))
		var user repo.User
		if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid credentials"})
		}
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid credentials"})
		}
		ttl := viper.GetDuration("ACCESS_TOKEN_TTL")
		if ttl == 0 {
			ttl = time.Hour * 2
		}
		token, err := auth.GenerateAccessToken(viper.GetString("JWT_SECRET"), user.ID, string(user.Role), ttl)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "token error"})
		}
		rttl := viper.GetDuration("REFRESH_TOKEN_TTL")
		if rttl == 0 {
			rttl = time.Hour * 24 * 7
		}
		rt, err := auth.GenerateRefreshToken(viper.GetString("JWT_SECRET"), user.ID, string(user.Role), rttl)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "token error"})
		}
		return c.JSON(fiber.Map{"access_token": token, "refresh_token": rt})
	}
}

func Me() fiber.Handler {
	return func(c *fiber.Ctx) error {
		uid := c.Locals("uid")
		role := c.Locals("role")
		return c.JSON(fiber.Map{"uid": uid, "role": role})
	}
}

type refreshReq struct {
	RefreshToken string `json:"refresh_token"`
}

func Refresh() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req refreshReq
		if err := c.BodyParser(&req); err != nil || req.RefreshToken == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad payload"})
		}
		claims, err := auth.ParseToken(viper.GetString("JWT_SECRET"), req.RefreshToken)
		if err != nil || !auth.IsRefresh(claims) {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid token"})
		}
		ttl := viper.GetDuration("ACCESS_TOKEN_TTL")
		if ttl == 0 {
			ttl = time.Hour * 2
		}
		at, err := auth.GenerateAccessToken(viper.GetString("JWT_SECRET"), claims.UserID, claims.Role, ttl)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "token error"})
		}
		return c.JSON(fiber.Map{"access_token": at})
	}
}
