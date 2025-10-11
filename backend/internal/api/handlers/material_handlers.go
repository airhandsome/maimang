package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"maimang/backend/internal/repo"
	"maimang/backend/internal/types"
)

// 获取素材列表（管理员）
func ListMaterials(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var query types.ListQuery
		if err := c.QueryParser(&query); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid query parameters",
			})
		}

		// 设置默认值
		if query.Page == 0 {
			query.Page = 1
		}
		if query.PerPage == 0 {
			query.PerPage = 20
		}

		var materials []repo.Material
		var total int64

		// 构建查询
		tx := db.Model(&repo.Material{}).Preload("Uploader")

		// 搜索条件
		if query.Search != "" {
			tx = tx.Where("name ILIKE ? OR description ILIKE ?", "%"+query.Search+"%", "%"+query.Search+"%")
		}
		if query.Type != "" {
			tx = tx.Where("type = ?", query.Type)
		}

		// 获取总数
		tx.Count(&total)

		// 分页和排序
		offset := (query.Page - 1) * query.PerPage
		tx = tx.Order("created_at DESC").
			Offset(offset).
			Limit(query.PerPage).
			Find(&materials)

		if tx.Error != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch materials",
			})
		}

		// 计算总页数
		totalPages := int((total + int64(query.PerPage) - 1) / int64(query.PerPage))

		return c.JSON(types.PaginatedResponse{
			Success: true,
			Data:    materials,
			Meta: types.PaginationMeta{
				Page:       query.Page,
				PerPage:    query.PerPage,
				Total:      total,
				TotalPages: totalPages,
			},
		})
	}
}

// 上传素材（管理员）
func CreateMaterial(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req types.CreateMaterialRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 获取当前用户ID（上传者）
		uploaderID := c.Locals("uid").(uint)

		material := repo.Material{
			Name:        req.Name,
			Type:        repo.MaterialType(req.Type),
			Size:        req.Size,
			URL:         req.URL,
			Description: req.Description,
			Tags:        req.Tags,
			UploaderID:  uploaderID,
		}

		if err := db.Create(&material).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to create material",
			})
		}

		// 预加载上传者信息
		db.Preload("Uploader").First(&material, material.ID)

		return c.Status(201).JSON(types.Response{
			Success: true,
			Message: "Material created successfully",
			Data:    material,
		})
	}
}

// 更新素材信息（管理员）
func UpdateMaterial(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		materialID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid material ID",
			})
		}

		var req types.UpdateMaterialRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid request body",
			})
		}

		// 检查素材是否存在
		var material repo.Material
		if err := db.First(&material, materialID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Material not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch material",
			})
		}

		// 更新字段
		updates := make(map[string]interface{})
		if req.Name != "" {
			updates["name"] = req.Name
		}
		if req.Description != "" {
			updates["description"] = req.Description
		}
		if req.Tags != "" {
			updates["tags"] = req.Tags
		}

		if err := db.Model(&material).Updates(updates).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to update material",
			})
		}

		// 预加载上传者信息
		db.Preload("Uploader").First(&material, material.ID)

		return c.JSON(types.Response{
			Success: true,
			Message: "Material updated successfully",
			Data:    material,
		})
	}
}

// 删除素材（管理员）
func DeleteMaterial(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		materialID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(types.Response{
				Success: false,
				Error:   "Invalid material ID",
			})
		}

		// 检查素材是否存在
		var material repo.Material
		if err := db.First(&material, materialID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(404).JSON(types.Response{
					Success: false,
					Error:   "Material not found",
				})
			}
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to fetch material",
			})
		}

		// 删除素材
		if err := db.Delete(&material).Error; err != nil {
			return c.Status(500).JSON(types.Response{
				Success: false,
				Error:   "Failed to delete material",
			})
		}

		return c.JSON(types.Response{
			Success: true,
			Message: "Material deleted successfully",
		})
	}
}
