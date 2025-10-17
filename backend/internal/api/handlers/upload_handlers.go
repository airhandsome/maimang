package handlers

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"maimang/backend/internal/repo"
	"maimang/backend/internal/types"
)

// 上传头像
func UploadAvatar() fiber.Handler {
	return func(c *fiber.Ctx) error {
		log.Printf("=== UploadAvatar API Called ===")

		// 获取当前用户ID
		userID := c.Locals("uid").(uint)
		log.Printf("User ID: %d", userID)

		// 解析multipart form
		file, err := c.FormFile("avatar")
		if err != nil {
			log.Printf("FormFile error: %v", err)
			return c.Status(400).JSON(fiber.Map{
				"success": false,
				"error":   "请选择头像文件",
			})
		}

		// 验证文件类型
		if !strings.HasPrefix(file.Header.Get("Content-Type"), "image/") {
			log.Printf("Invalid file type: %s", file.Header.Get("Content-Type"))
			return c.Status(400).JSON(fiber.Map{
				"success": false,
				"error":   "只支持图片文件",
			})
		}

		// 验证文件大小 (2MB)
		if file.Size > 2*1024*1024 {
			log.Printf("File too large: %d bytes", file.Size)
			return c.Status(400).JSON(fiber.Map{
				"success": false,
				"error":   "文件大小不能超过2MB",
			})
		}

		// 创建上传目录
		uploadDir := "./uploads/avatars"
		if err := os.MkdirAll(uploadDir, 0755); err != nil {
			log.Printf("Failed to create upload directory: %v", err)
			return c.Status(500).JSON(fiber.Map{
				"success": false,
				"error":   "服务器错误",
			})
		}

		// 生成唯一文件名
		ext := filepath.Ext(file.Filename)
		if ext == "" {
			ext = ".jpg" // 默认扩展名
		}
		filename := fmt.Sprintf("%d_%s%s", userID, uuid.New().String(), ext)
		filepath := filepath.Join(uploadDir, filename)

		// 保存文件
		if err := c.SaveFile(file, filepath); err != nil {
			log.Printf("Failed to save file: %v", err)
			return c.Status(500).JSON(fiber.Map{
				"success": false,
				"error":   "文件保存失败",
			})
		}

		// 返回相对路径
		relativePath := fmt.Sprintf("/uploads/avatars/%s", filename)

		log.Printf("Avatar uploaded successfully: %s", relativePath)

		return c.JSON(fiber.Map{
			"success": true,
			"message": "头像上传成功",
			"data": fiber.Map{
				"url": relativePath,
			},
		})
	}
}

// 上传素材（管理员）
func UploadMaterial(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// 当前用户作为上传者
		uploaderID := c.Locals("uid").(uint)

		// 解析文件字段名为 "file"
		file, err := c.FormFile("file")
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "请选择要上传的文件",
			})
		}

		// 允许的类型：image/document/video/audio
		// 可从表单字段 type 推断，若未提供则根据 Content-Type 推断为 image 或 document
		providedType := c.FormValue("type")
		var materialType repo.MaterialType
		switch strings.ToLower(providedType) {
		case string(repo.MaterialTypeImage), string(repo.MaterialTypeDocument), string(repo.MaterialTypeVideo), string(repo.MaterialTypeAudio):
			materialType = repo.MaterialType(providedType)
		default:
			ct := file.Header.Get("Content-Type")
			if strings.HasPrefix(ct, "image/") {
				materialType = repo.MaterialTypeImage
			} else if strings.HasPrefix(ct, "video/") {
				materialType = repo.MaterialTypeVideo
			} else if strings.HasPrefix(ct, "audio/") {
				materialType = repo.MaterialTypeAudio
			} else {
				materialType = repo.MaterialTypeDocument
			}
		}

		// 创建上传目录：./uploads/materials/<type>
		baseDir := "./uploads/materials"
		typeDir := filepath.Join(baseDir, string(materialType))
		if err := os.MkdirAll(typeDir, 0755); err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "服务器创建目录失败",
			})
		}

		// 生成唯一文件名
		ext := filepath.Ext(file.Filename)
		if ext == "" {
			ext = ".bin"
		}
		filename := fmt.Sprintf("%d_%s%s", uploaderID, uuid.New().String(), ext)
		absPath := filepath.Join(typeDir, filename)

		// 保存文件
		if err := c.SaveFile(file, absPath); err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "文件保存失败",
			})
		}

		// 生成可访问的相对 URL
		relativeURL := fmt.Sprintf("/uploads/materials/%s/%s", string(materialType), filename)

		// 读取其他可选表单字段
		name := c.FormValue("name")
		if name == "" {
			name = file.Filename
		}
		description := c.FormValue("description")
		tags := c.FormValue("tags") // 约定为以逗号分隔的字符串或 JSON 字符串，由前端保持一致

		// 写入数据库
		material := repo.Material{
			Name:        name,
			Type:        materialType,
			Size:        file.Size,
			URL:         relativeURL,
			Description: description,
			Tags:        tags,
			UploaderID:  uploaderID,
		}

		if err := db.Create(&material).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "写入素材记录失败",
			})
		}

		// 预加载上传者信息后返回
		db.Preload("Uploader").First(&material, material.ID)

		return c.Status(201).JSON(types.Response{
			Success: true,
			Message: "素材上传成功",
			Data:    material,
		})
	}
}

// 静态文件服务中间件
func ServeStaticFiles() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// 设置静态文件目录
		filePath := c.Params("*")
		if filePath == "" {
			return c.Status(404).JSON(fiber.Map{
				"success": false,
				"error":   "文件不存在",
			})
		}

		// 构建完整路径
		fullPath := filepath.Join("./uploads", filePath)

		// 检查文件是否存在
		if _, err := os.Stat(fullPath); os.IsNotExist(err) {
			return c.Status(404).JSON(fiber.Map{
				"success": false,
				"error":   "文件不存在",
			})
		}

		// 设置正确的Content-Type
		ext := filepath.Ext(fullPath)
		switch ext {
		case ".jpg", ".jpeg":
			c.Set("Content-Type", "image/jpeg")
		case ".png":
			c.Set("Content-Type", "image/png")
		case ".gif":
			c.Set("Content-Type", "image/gif")
		case ".webp":
			c.Set("Content-Type", "image/webp")
		default:
			c.Set("Content-Type", "application/octet-stream")
		}

		// 设置缓存头
		c.Set("Cache-Control", "public, max-age=31536000") // 1年缓存

		return c.SendFile(fullPath)
	}
}
