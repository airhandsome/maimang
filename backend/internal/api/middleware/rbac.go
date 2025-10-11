package middleware

import (
	"fmt"

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

		// 添加调试日志
		fmt.Printf("DEBUG: User role: '%s', Allowed roles: %v\n", role, allowed)

		if _, ok := set[role]; !ok {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error":         "forbidden",
				"user_role":     role,
				"allowed_roles": allowed,
			})
		}
		return c.Next()
	}
}

// AdminRequired 要求管理员权限
func AdminRequired() fiber.Handler {
	return RequireRoles("admin", "super_admin", "editor", "reviewer")
}

// SuperAdminRequired 要求超级管理员权限
func SuperAdminRequired() fiber.Handler {
	return RequireRoles("super_admin")
}

// EditorRequired 要求编辑权限
func EditorRequired() fiber.Handler {
	return RequireRoles("admin", "super_admin", "editor")
}

// ReviewerRequired 要求审核员权限
func ReviewerRequired() fiber.Handler {
	return RequireRoles("admin", "super_admin", "reviewer")
}
