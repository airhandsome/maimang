package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/spf13/viper"

	"maimang/backend/internal/auth"
)

func AuthRequired() fiber.Handler {
	return func(c *fiber.Ctx) error {
		header := c.Get("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "missing token"})
		}
		token := strings.TrimPrefix(header, "Bearer ")
		claims, err := auth.ParseToken(viper.GetString("JWT_SECRET"), token)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid token"})
		}
		c.Locals("uid", claims.UserID)
		c.Locals("role", claims.Role)
		return c.Next()
	}
}
