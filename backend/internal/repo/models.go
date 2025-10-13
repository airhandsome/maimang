package repo

import (
	"time"

	"gorm.io/gorm"
)

type Role string

const (
	RoleVisitor    Role = "visitor"
	RoleMember     Role = "member"
	RoleEditor     Role = "editor"
	RoleAdmin      Role = "admin"
	RoleSuperAdmin Role = "super_admin"
	RoleReviewer   Role = "reviewer"
)

type User struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Name     string `gorm:"size:100;not null;index"`
	Email    string `gorm:"size:200;uniqueIndex;not null"`
	Password string `gorm:"size:200;not null"` // bcrypt hash
	Role     Role   `gorm:"type:varchar(20);not null;default:'member';index"`

	AvatarURL string `gorm:"size:500"`
	Bio       string `gorm:"size:1000"`

	// 扩展用户信息
	Gender string `gorm:"size:20"` // male, female, secret
	Phone  string `gorm:"size:20"`
	Tags   string `gorm:"size:500"` // JSON array of tags
	Weibo  string `gorm:"size:200"`
	Wechat string `gorm:"size:200"`

	// 用户状态
	Status      string     `gorm:"type:varchar(20);not null;default:'active';index"` // active, inactive, banned
	LastLoginAt *time.Time `gorm:"index"`

	// 关联关系
	Works                []Work                `gorm:"foreignKey:AuthorID"`
	Comments             []Comment             `gorm:"foreignKey:AuthorID"`
	ActivityParticipants []ActivityParticipant `gorm:"foreignKey:UserID"`
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

// 作品管理
type WorkStatus string

const (
	WorkPending  WorkStatus = "pending"
	WorkApproved WorkStatus = "approved"
	WorkRejected WorkStatus = "rejected"
)

type WorkType string

const (
	WorkTypePoetry WorkType = "poetry"
	WorkTypeProse  WorkType = "prose"
	WorkTypeNovel  WorkType = "novel"
	WorkTypePhoto  WorkType = "photo"
)

type Work struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Title    string     `gorm:"size:200;not null;index"`
	Type     WorkType   `gorm:"type:varchar(20);not null;index"`
	Content  string     `gorm:"type:text;not null"`
	Status   WorkStatus `gorm:"type:varchar(20);not null;default:'pending';index"`
	AuthorID uint       `gorm:"not null;index"`
	Author   User       `gorm:"foreignKey:AuthorID"`

	// 统计数据
	Views int `gorm:"default:0;index"`
	Likes int `gorm:"default:0;index"`

	// 审核信息
	ReviewedAt   *time.Time
	ReviewedBy   *uint
	Reviewer     *User  `gorm:"foreignKey:ReviewedBy"`
	ReviewNote   string `gorm:"size:1000"`
	RejectReason string `gorm:"size:1000"`

	// 关联关系
	Comments []Comment `gorm:"foreignKey:WorkID"`
}

// 评论管理
type CommentStatus string

const (
	CommentPending  CommentStatus = "pending"
	CommentApproved CommentStatus = "approved"
	CommentRejected CommentStatus = "rejected"
	CommentHidden   CommentStatus = "hidden"
)

type Comment struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`

	Content  string        `gorm:"type:text;not null"`
	Status   CommentStatus `gorm:"type:varchar(20);not null;default:'pending';index"`
	AuthorID uint          `gorm:"not null;index"`
	Author   User          `gorm:"foreignKey:AuthorID"`
	WorkID   uint          `gorm:"not null;index"`
	Work     Work          `gorm:"foreignKey:WorkID"`

	// 统计数据
	Likes   int `gorm:"default:0;index"`
	Replies int `gorm:"default:0"`

	// 审核信息
	ReviewedAt *time.Time
	ReviewedBy *uint
	Reviewer   *User `gorm:"foreignKey:ReviewedBy"`
}

// 活动管理
type ActivityStatus string

const (
	ActivityUpcoming  ActivityStatus = "upcoming"
	ActivityOngoing   ActivityStatus = "ongoing"
	ActivityCompleted ActivityStatus = "completed"
	ActivityCancelled ActivityStatus = "cancelled"
)

type Activity struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	IsDeleted bool `gorm:"default:false;index"` // 软删除字段

	Title               string         `gorm:"size:200;not null;index"`
	Description         string         `gorm:"size:2000"`
	ImageURL            string         `gorm:"size:500"`
	Date                time.Time      `gorm:"not null;index"`
	Time                string         `gorm:"size:50"`
	Location            string         `gorm:"size:200"`
	Instructor          string         `gorm:"size:100"`
	Status              ActivityStatus `gorm:"type:varchar(20);not null;default:'upcoming';index"`
	MaxParticipants     int            `gorm:"default:0"`
	CurrentParticipants int            `gorm:"default:0"`

	// 关联关系
	Participants []ActivityParticipant `gorm:"foreignKey:ActivityID"`
}

// 活动参与者
type ActivityParticipant struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	ActivityID uint     `gorm:"not null;index"`
	Activity   Activity `gorm:"foreignKey:ActivityID"`
	UserID     uint     `gorm:"not null;index"`
	User       User     `gorm:"foreignKey:UserID"`

	// 参与状态
	Status string `gorm:"type:varchar(20);not null;default:'registered';index"` // registered, attended, absent
	Notes  string `gorm:"size:500"`

	// 唯一约束：一个用户只能参与一次活动
	// 使用复合唯一索引确保一个用户只能参与一次活动
}

// 轮播图管理
type CarouselStatus string

const (
	CarouselActive   CarouselStatus = "active"
	CarouselInactive CarouselStatus = "inactive"
)

type Carousel struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Title       string         `gorm:"size:200;not null"`
	ImageURL    string         `gorm:"size:500;not null"`
	LinkURL     string         `gorm:"size:500"`
	Description string         `gorm:"size:1000"`
	Status      CarouselStatus `gorm:"type:varchar(20);not null;default:'active';index"`
	Order       int            `gorm:"default:0;index"`
}

// 公告管理
type AnnouncementStatus string

const (
	AnnouncementDraft     AnnouncementStatus = "draft"
	AnnouncementPublished AnnouncementStatus = "published"
)

type Announcement struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Title       string             `gorm:"size:200;not null;index"`
	Content     string             `gorm:"type:text;not null"`
	Status      AnnouncementStatus `gorm:"type:varchar(20);not null;default:'draft';index"`
	PublishedAt *time.Time         `gorm:"index"`
	AuthorID    uint               `gorm:"not null;index"`
	Author      User               `gorm:"foreignKey:AuthorID"`
}

// 系统设置
type SystemSetting struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Key   string `gorm:"size:100;uniqueIndex;not null"`
	Value string `gorm:"type:text"`
	Type  string `gorm:"size:20;not null;default:'string'"` // string, int, bool, json
}

// 素材管理
type MaterialType string

const (
	MaterialTypeImage    MaterialType = "image"
	MaterialTypeDocument MaterialType = "document"
	MaterialTypeVideo    MaterialType = "video"
	MaterialTypeAudio    MaterialType = "audio"
)

type Material struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Name        string       `gorm:"size:200;not null;index"`
	Type        MaterialType `gorm:"type:varchar(20);not null;index"`
	Size        int64        `gorm:"not null"`
	URL         string       `gorm:"size:500;not null"`
	Description string       `gorm:"size:1000"`
	Tags        string       `gorm:"size:500"` // JSON array of tags
	UploaderID  uint         `gorm:"not null;index"`
	Uploader    User         `gorm:"foreignKey:UploaderID"`
}
