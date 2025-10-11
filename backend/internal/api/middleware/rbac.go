package middleware

import (
	"github.com/gofiber/fiber/v2"
)

// RequireRoles checks if user role in context is within allowed roles
func RequireRoles(allowed ...string) fiber.Handler {
	set := map[string]struct{}{}
	for _, r := range allowed {
		set[r] = struct{}{}
	}
	return func(c *fiber.Ctx) error {
		roleVal := c.Locals("role")
		role, _ := roleVal.(string)
		if _, ok := set[role]; !ok {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "forbidden"})
		}
		return c.Next()
	}
}
