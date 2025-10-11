package types

// 通用响应结构
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// 分页响应结构
type PaginatedResponse struct {
	Success bool           `json:"success"`
	Data    interface{}    `json:"data"`
	Meta    PaginationMeta `json:"meta"`
}

type PaginationMeta struct {
	Page       int   `json:"page"`
	PerPage    int   `json:"per_page"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}

// 认证相关请求
type RegisterRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// 用户相关请求
type UpdateUserRequest struct {
	Name      string `json:"name,omitempty" validate:"omitempty,min=2,max=100"`
	AvatarURL string `json:"avatar_url,omitempty"`
	Bio       string `json:"bio,omitempty" validate:"omitempty,max=1000"`
}

type UpdateUserStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=active inactive banned"`
}

// 作品相关请求
type CreateWorkRequest struct {
	Title   string `json:"title" validate:"required,min=1,max=200"`
	Type    string `json:"type" validate:"required,oneof=poetry prose novel photo"`
	Content string `json:"content" validate:"required"`
}

type UpdateWorkRequest struct {
	Title   string `json:"title,omitempty" validate:"omitempty,min=1,max=200"`
	Type    string `json:"type,omitempty" validate:"omitempty,oneof=poetry prose novel photo"`
	Content string `json:"content,omitempty"`
}

type WorkReviewRequest struct {
	Action string `json:"action" validate:"required,oneof=approve reject"`
	Note   string `json:"note,omitempty" validate:"omitempty,max=1000"`
}

// 评论相关请求
type CreateCommentRequest struct {
	Content string `json:"content" validate:"required,min=1,max=2000"`
}

type UpdateCommentRequest struct {
	Content string `json:"content" validate:"required,min=1,max=2000"`
}

type CommentReviewRequest struct {
	Action string `json:"action" validate:"required,oneof=approve reject hide"`
	Note   string `json:"note,omitempty" validate:"omitempty,max=1000"`
}

// 活动相关请求
type CreateActivityRequest struct {
	Title           string `json:"title" validate:"required,min=1,max=200"`
	Description     string `json:"description" validate:"required"`
	ImageURL        string `json:"image_url,omitempty"`
	Date            string `json:"date" validate:"required"`
	Time            string `json:"time,omitempty"`
	Location        string `json:"location,omitempty"`
	Instructor      string `json:"instructor,omitempty"`
	MaxParticipants int    `json:"max_participants,omitempty"`
}

type UpdateActivityRequest struct {
	Title           string `json:"title,omitempty" validate:"omitempty,min=1,max=200"`
	Description     string `json:"description,omitempty"`
	ImageURL        string `json:"image_url,omitempty"`
	Date            string `json:"date,omitempty"`
	Time            string `json:"time,omitempty"`
	Location        string `json:"location,omitempty"`
	Instructor      string `json:"instructor,omitempty"`
	MaxParticipants int    `json:"max_participants,omitempty"`
	Status          string `json:"status,omitempty" validate:"omitempty,oneof=upcoming ongoing completed cancelled"`
}

// 轮播图相关请求
type CreateCarouselRequest struct {
	Title       string `json:"title" validate:"required,min=1,max=200"`
	ImageURL    string `json:"image_url" validate:"required"`
	LinkURL     string `json:"link_url,omitempty"`
	Description string `json:"description,omitempty"`
	Order       int    `json:"order,omitempty"`
}

type UpdateCarouselRequest struct {
	Title       string `json:"title,omitempty" validate:"omitempty,min=1,max=200"`
	ImageURL    string `json:"image_url,omitempty"`
	LinkURL     string `json:"link_url,omitempty"`
	Description string `json:"description,omitempty"`
	Status      string `json:"status,omitempty" validate:"omitempty,oneof=active inactive"`
	Order       int    `json:"order,omitempty"`
}

// 公告相关请求
type CreateAnnouncementRequest struct {
	Title   string `json:"title" validate:"required,min=1,max=200"`
	Content string `json:"content" validate:"required"`
}

type UpdateAnnouncementRequest struct {
	Title   string `json:"title,omitempty" validate:"omitempty,min=1,max=200"`
	Content string `json:"content,omitempty"`
	Status  string `json:"status,omitempty" validate:"omitempty,oneof=draft published"`
}

// 管理员相关请求
type CreateAdminRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
	Role     string `json:"role" validate:"required,oneof=admin editor reviewer"`
}

type UpdateAdminRequest struct {
	Name string `json:"name,omitempty" validate:"omitempty,min=2,max=100"`
	Role string `json:"role,omitempty" validate:"omitempty,oneof=admin editor reviewer"`
}

// 系统设置相关请求
type UpdateSettingsRequest struct {
	Settings map[string]interface{} `json:"settings" validate:"required"`
}

// 素材相关请求
type CreateMaterialRequest struct {
	Name        string `json:"name" validate:"required,min=1,max=200"`
	Type        string `json:"type" validate:"required,oneof=image document video audio"`
	Size        int64  `json:"size" validate:"required,min=1"`
	URL         string `json:"url" validate:"required"`
	Description string `json:"description,omitempty"`
	Tags        string `json:"tags,omitempty"`
}

type UpdateMaterialRequest struct {
	Name        string `json:"name,omitempty" validate:"omitempty,min=1,max=200"`
	Description string `json:"description,omitempty"`
	Tags        string `json:"tags,omitempty"`
}

// 查询参数结构
type ListQuery struct {
	Page    int    `query:"page" validate:"omitempty,min=1"`
	PerPage int    `query:"per_page" validate:"omitempty,min=1,max=100"`
	Search  string `query:"search"`
	Status  string `query:"status"`
	Type    string `query:"type"`
	SortBy  string `query:"sort_by"`
	SortDir string `query:"sort_dir" validate:"omitempty,oneof=asc desc"`
}

// 统计响应结构
type DashboardStats struct {
	TotalUsers       int64 `json:"total_users"`
	TotalWorks       int64 `json:"total_works"`
	PendingWorks     int64 `json:"pending_works"`
	TotalActivities  int64 `json:"total_activities"`
	ActiveActivities int64 `json:"active_activities"`
	TotalComments    int64 `json:"total_comments"`
	PendingComments  int64 `json:"pending_comments"`
}

type UserStats struct {
	TotalUsers  int64 `json:"total_users"`
	ActiveUsers int64 `json:"active_users"`
	NewUsers    int64 `json:"new_users"`
	BannedUsers int64 `json:"banned_users"`
}

type WorkStats struct {
	TotalWorks    int64 `json:"total_works"`
	ApprovedWorks int64 `json:"approved_works"`
	PendingWorks  int64 `json:"pending_works"`
	RejectedWorks int64 `json:"rejected_works"`
	TotalViews    int64 `json:"total_views"`
	TotalLikes    int64 `json:"total_likes"`
}

type ActivityStats struct {
	TotalActivities     int64 `json:"total_activities"`
	UpcomingActivities  int64 `json:"upcoming_activities"`
	OngoingActivities   int64 `json:"ongoing_activities"`
	CompletedActivities int64 `json:"completed_activities"`
	TotalParticipants   int64 `json:"total_participants"`
}
