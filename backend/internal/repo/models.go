package repo

import (
	"time"
)

type Role string

const (
	RoleVisitor Role = "visitor"
	RoleMember  Role = "member"
	RoleEditor  Role = "editor"
	RoleAdmin   Role = "admin"
)

type User struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Name     string `gorm:"size:100;not null"`
	Email    string `gorm:"size:200;uniqueIndex;not null"`
	Password string `gorm:"size:200;not null"` // bcrypt hash
	Role     Role   `gorm:"type:varchar(20);not null;default:'member'"`

	AvatarURL string `gorm:"size:500"`
	Bio       string `gorm:"size:1000"`
}

type ArticleStatus string

const (
	ArticleDraft     ArticleStatus = "draft"
	ArticlePublished ArticleStatus = "published"
)

type Article struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Title    string        `gorm:"size:200;not null"`
	Slug     string        `gorm:"size:200;uniqueIndex"`
	Summary  string        `gorm:"size:1000"`
	Content  string        `gorm:"type:text"`
	CoverURL string        `gorm:"size:500"`
	Status   ArticleStatus `gorm:"type:varchar(20);not null;default:'draft'"`
	AuthorID *uint
}

type EventStatus string

const (
	EventPlanned EventStatus = "planned"
	EventOpen    EventStatus = "open"
	EventClosed  EventStatus = "closed"
)

type Event struct {
	ID          uint `gorm:"primaryKey"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	Title       string `gorm:"size:200;not null"`
	Description string `gorm:"size:2000"`
	BannerURL   string `gorm:"size:500"`
	StartAt     *time.Time
	EndAt       *time.Time
	Location    string      `gorm:"size:200"`
	Status      EventStatus `gorm:"type:varchar(20);not null;default:'planned'"`
}

type Album struct {
	ID          uint `gorm:"primaryKey"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	Title       string `gorm:"size:200;not null"`
	Description string `gorm:"size:1000"`
	CoverURL    string `gorm:"size:500"`
}
