package handlers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"maimang/backend/internal/repo"
	"maimang/backend/internal/types"
)

type sendMessageRequest struct {
	Content string `json:"content"`
}

// 获取与当前用户有过对话的会话列表（对方用户）
func ListConversations(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		uid := c.Locals("uid").(uint)

		// 查询最近的消息，聚合出会话对方用户ID
		var msgs []repo.Message
		if err := db.Where("from_user_id = ? OR to_user_id = ?", uid, uid).
			Order("created_at DESC").
			Limit(200).
			Find(&msgs).Error; err != nil {
			return c.Status(500).JSON(types.Response{Success: false, Error: "Failed to fetch conversations"})
		}

		// 聚合唯一的对方用户ID，保持顺序
		seen := make(map[uint]bool)
		var otherIDs []uint
		for _, m := range msgs {
			var other uint
			if m.FromUserID == uid {
				other = m.ToUserID
			} else {
				other = m.FromUserID
			}
			if !seen[other] {
				seen[other] = true
				otherIDs = append(otherIDs, other)
			}
		}

		if len(otherIDs) == 0 {
			return c.JSON(types.Response{Success: true, Data: []repo.User{}})
		}

		var users []repo.User
		if err := db.Where("id IN ?", otherIDs).Find(&users).Error; err != nil {
			return c.Status(500).JSON(types.Response{Success: false, Error: "Failed to fetch users"})
		}

		return c.JSON(types.Response{Success: true, Data: users})
	}
}

// 获取与某个用户的消息历史
func ListMessagesWith(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		uid := c.Locals("uid").(uint)
		otherID, err := parseUintParam(c, "id")
		if err != nil {
			return c.Status(400).JSON(types.Response{Success: false, Error: "Invalid user id"})
		}

		var msgs []repo.Message
		if err := db.Where("(from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)", uid, otherID, otherID, uid).
			Order("created_at ASC").
			Limit(200).
			Find(&msgs).Error; err != nil {
			return c.Status(500).JSON(types.Response{Success: false, Error: "Failed to fetch messages"})
		}
		return c.JSON(types.Response{Success: true, Data: msgs})
	}
}

// 发送消息
func SendMessage(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		uid := c.Locals("uid").(uint)
		otherID, err := parseUintParam(c, "id")
		if err != nil {
			return c.Status(400).JSON(types.Response{Success: false, Error: "Invalid user id"})
		}
		var req sendMessageRequest
		if err := c.BodyParser(&req); err != nil || req.Content == "" {
			return c.Status(400).JSON(types.Response{Success: false, Error: "Invalid content"})
		}

		msg := repo.Message{
			FromUserID: uid,
			ToUserID:   uint(otherID),
			Content:    req.Content,
		}
		if err := db.Create(&msg).Error; err != nil {
			return c.Status(500).JSON(types.Response{Success: false, Error: "Failed to send message"})
		}
		return c.Status(201).JSON(types.Response{Success: true, Data: msg})
	}
}

// 标记与某用户的消息为已读
func MarkMessagesRead(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		uid := c.Locals("uid").(uint)
		otherID, err := parseUintParam(c, "id")
		if err != nil {
			return c.Status(400).JSON(types.Response{Success: false, Error: "Invalid user id"})
		}
		now := time.Now()
		if err := db.Model(&repo.Message{}).
			Where("to_user_id = ? AND from_user_id = ? AND read_at IS NULL", uid, otherID).
			Updates(map[string]interface{}{"read_at": &now}).Error; err != nil {
			return c.Status(500).JSON(types.Response{Success: false, Error: "Failed to mark read"})
		}
		return c.JSON(types.Response{Success: true})
	}
}

func parseUintParam(c *fiber.Ctx, name string) (uint, error) {
	id, err := parseUint(c.Params(name))
	return uint(id), err
}

func parseUint(s string) (uint64, error) {
	return strconv.ParseUint(s, 10, 64)
}
