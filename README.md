# 🎁 Gợi Ý Tặng Quà

## 📋 Mô tả dự án

"Gợi Ý Tặng Quà" là nền tảng web thông minh giúp người dùng tìm kiếm và nhận gợi ý quà tặng phù hợp cho các dịp đặc biệt như sinh nhật, kỷ niệm, lễ tết. Hệ thống sử dụng AI để cá nhân hóa gợi ý dựa trên thông tin người nhận, sở thích, độ tuổi, mối quan hệ. Ngoài ra, hệ thống còn hỗ trợ quản lý sản phẩm, bài viết, bình luận, chat real-time và nhiều tính năng nâng cao cho cả người dùng cuối lẫn quản trị viên.

---

## 🏗️ Kiến trúc hệ thống

Dự án được chia thành 3 phần chính:

- **Server**: Backend API Node.js/Express với TypeScript
- **Client Admin**: Giao diện quản trị viên (React + TypeScript + Vite)
- **Client User**: Giao diện người dùng cuối (React + TypeScript + Vite)

---

## 🖥️ SERVER - Chức năng Backend

### 🔐 1. Xác thực và Phân quyền (Authentication & Authorization)

#### 1.1. Đăng ký và Đăng nhập
- **Đăng ký tài khoản**: 
  - Xác thực email qua OTP
  - Mã hóa mật khẩu bằng bcrypt
  - Validation đầu vào
- **Đăng nhập**: 
  - Xác thực email/password
  - Tạo JWT access token và refresh token
  - Lưu refresh token vào cookie (httpOnly, secure)
- **Đăng nhập Google OAuth**: 
  - Tích hợp Passport.js với Google OAuth 2.0
  - Tự động tạo tài khoản nếu chưa tồn tại
  - Session management với MongoDB Store

#### 1.2. Quản lý Token
- **Refresh Token**: 
  - Lưu trữ trong cookie và database
  - Tự động làm mới access token khi hết hạn
  - Hỗ trợ logout (xóa token)
- **Access Token**: 
  - JWT với thời gian hết hạn ngắn
  - Chứa thông tin user ID và role
- **Middleware xác thực**: 
  - `verifyAccessToken`: Xác thực access token
  - `verifyRefreshToken`: Xác thực refresh token
  - `verifyAdmin`: Kiểm tra quyền admin
  - `authOptional`: Cho phép truy cập không cần đăng nhập

#### 1.3. Quên mật khẩu
- **Yêu cầu reset**: Gửi OTP qua email
- **Reset mật khẩu**: Xác thực OTP và cập nhật mật khẩu mới

### 👤 2. Quản lý Người dùng (User Management)

- **Lấy thông tin người dùng hiện tại**: Trả về profile đầy đủ
- **Cập nhật profile**: 
  - Tên, ngày sinh, giới tính
  - Sở thích (preferences)
- **Đổi mật khẩu**: Xác thực mật khẩu cũ trước khi đổi
- **Quản lý mối quan hệ**: Lưu trữ thông tin người thân/bạn bè để gợi ý quà

### 🛍️ 3. Quản lý Sản phẩm (Product Management)

#### 3.1. CRUD Sản phẩm
- **Tạo sản phẩm**: 
  - Tên, giá, mô tả, hình ảnh
  - Slug tự động từ tên
  - Link sản phẩm, danh mục, tags
- **Lấy danh sách sản phẩm**: 
  - Phân trang (pagination)
  - Lọc theo giá (min_price, max_price)
  - Lọc theo tags, category
  - Tìm kiếm theo tên
  - Sắp xếp (sort)
- **Lấy chi tiết sản phẩm**: Theo slug
- **Cập nhật sản phẩm**: Chỉnh sửa thông tin
- **Xóa sản phẩm**: Soft delete hoặc hard delete

### 📝 4. Quản lý Bài viết (Post Management)

#### 4.1. CRUD Bài viết
- **Tạo bài viết**: 
  - Tiêu đề, nội dung (HTML), thumbnail
  - Slug, tags, filters
  - Liên kết sản phẩm
  - Tác giả, trạng thái (draft/published)
- **Lấy danh sách bài viết**: 
  - Phân trang
  - Lọc theo tags, filters, status
  - Tìm kiếm
  - Lọc theo featured, generatedBy (AI/manual)
- **Lấy bài viết nổi bật**: Top bài viết theo lượt xem/tương tác
- **Lấy chi tiết bài viết**: Theo slug
- **Tăng lượt xem**: Tracking view với IP và user ID
- **Cập nhật bài viết**: 
  - Chỉnh sửa nội dung
  - Thay đổi trạng thái
  - Lên lịch xuất bản (scheduledFor)
- **Xóa bài viết**: Soft delete

#### 4.2. Tính năng nâng cao
- **Lên lịch xuất bản**: Tự động publish vào thời gian chỉ định
- **Featured posts**: Đánh dấu bài viết nổi bật
- **AI Generated**: Đánh dấu bài viết được tạo bởi AI

### 💬 5. Hệ thống Bình luận (Comment System)

- **Tạo bình luận**: 
  - Bình luận trên bài viết
  - Validation nội dung
- **Lấy danh sách bình luận**: 
  - Theo bài viết
  - Phân trang
  - Sắp xếp theo thời gian
- **Kiểm duyệt**: Admin có thể duyệt/xóa bình luận

### 🤖 6. Tích hợp AI (AI Integration)

#### 6.1. AI Prompt Management
- **Quản lý AI Prompts**: 
  - Tạo, sửa, xóa prompts
  - Cấu hình AI provider (OpenAI, Claude, Gemini)
  - Cấu hình model, temperature, maxTokens
  - System message tùy chỉnh
  - Kích hoạt/vô hiệu hóa prompt
- **Hỗ trợ nhiều AI Provider**: 
  - OpenAI (GPT models)
  - Anthropic Claude
  - Google Gemini

#### 6.2. Chat với AI
- **Chat thông thường**: 
  - Gửi tin nhắn và nhận phản hồi từ AI
  - Lưu lịch sử conversation
- **Chat Streaming (SSE)**: 
  - Phản hồi real-time qua Server-Sent Events
  - Hiển thị text từng phần khi AI đang generate
  - Lưu conversation sau khi hoàn thành
- **Quản lý Conversation**: 
  - Tạo conversation mới
  - Lấy lịch sử tin nhắn
  - Lưu trữ lịch sử chat

#### 6.3. Tự động tạo nội dung
- **Tạo bài viết bằng AI**: 
  - Sử dụng AI Prompt để generate nội dung
  - Tự động tạo bài viết theo lịch trình
  - Tích hợp với Content Schedule

### 📅 7. Lịch trình Nội dung (Content Scheduling)

- **Tạo lịch trình**: 
  - Liên kết với AI Prompt
  - Cấu hình thời gian chạy (cron expression)
  - Tự động tạo bài viết theo lịch
- **Quản lý lịch trình**: 
  - Xem, cập nhật, xóa schedule
  - Kiểm tra và thực thi tự động
- **Cron Jobs**: 
  - Chạy mỗi phút để kiểm tra schedule
  - Tự động generate content khi đến thời gian

### 🔔 8. Hệ thống Thông báo (Notification System)

- **Gửi thông báo**: 
  - Thông báo real-time qua Socket.io
  - Thông báo khi có bình luận mới
  - Thông báo khi có phản hồi
- **Quản lý thông báo**: 
  - Lấy danh sách thông báo của user
  - Đánh dấu đã đọc
  - Xóa thông báo
- **Thông báo kỷ niệm**: 
  - Cron job chạy hàng ngày (0h)
  - Tự động gửi thông báo nhắc nhở ngày kỷ niệm
  - Dựa trên Relationship data

### 🔍 9. Hệ thống Lọc (Filter System)

- **Quản lý Filters**: 
  - Tạo, sửa, xóa filters
  - Filters theo type (dịp, đối tượng, sở thích, giá...)
  - Options cho mỗi filter type
- **Sử dụng Filters**: 
  - Lọc sản phẩm theo filters
  - Lọc bài viết theo filters
  - Kết hợp nhiều filters

### 📊 10. Thống kê (Statistics)

- **Thống kê tổng quan**: 
  - Số lượng users, products, posts
  - Số lượng comments, conversations
  - Thống kê theo thời gian
- **Thống kê AI**: 
  - Số lượng conversations
  - Số lượng prompts được sử dụng
  - Thống kê theo AI provider
- **Thống kê nội dung**: 
  - Top bài viết được xem nhiều nhất
  - Top sản phẩm được quan tâm
  - Thống kê tương tác
- **Thống kê hoạt động**: 
  - Hoạt động của users
  - Lượt xem, bình luận theo thời gian

### 🖼️ 11. Quản lý Hình ảnh (Image Management)

- **Upload hình ảnh**: 
  - Sử dụng Multer + Cloudinary
  - Upload single/multiple images
  - Tự động optimize và resize
- **Lưu trữ**: 
  - Cloudinary CDN
  - URL trả về để sử dụng
- **Xóa hình ảnh**: Xóa từ Cloudinary

### 💬 12. Chat Real-time (Socket.io)

- **Kết nối Socket**: 
  - Xác thực user qua JWT
  - Quản lý rooms và connections
- **Events**: 
  - `chat`: Gửi tin nhắn chat
  - `notification`: Gửi thông báo real-time
  - `comment`: Thông báo bình luận mới
- **Broadcasting**: 
  - Gửi thông báo đến user cụ thể
  - Gửi thông báo đến nhiều users

### 📝 13. Logging và Error Handling

- **Winston Logger**: 
  - Log errors vào file
  - Daily rotate log files
  - Log format chuẩn
- **Error Handler Middleware**: 
  - Xử lý lỗi tập trung
  - Trả về error response chuẩn
  - Log errors
- **API Logs**: 
  - Endpoint để xem logs
  - Filter logs theo level, date

### ⚙️ 14. Cấu hình và Middleware

#### 14.1. Database
- **MongoDB**: 
  - Kết nối với connection pooling
  - Models với Mongoose
  - Indexes cho performance
- **Redis**: 
  - Cache dữ liệu
  - Session storage (optional)
  - OTP storage

#### 14.2. Middleware
- **Validation**: 
  - Validate request body/query/params
  - Sử dụng DTOs (Data Transfer Objects)
  - Custom validators
- **CORS**: 
  - Cấu hình whitelist domains
  - Credentials support
- **Morgan**: HTTP request logging
- **Cookie Parser**: Parse cookies
- **Express Session**: Session management với MongoDB Store

#### 14.3. Scheduled Tasks (Cron Jobs)
- **Anniversary Checker**: 
  - Chạy mỗi ngày lúc 0h
  - Kiểm tra ngày kỷ niệm và gửi thông báo
- **Content Generator**: 
  - Chạy mỗi phút
  - Kiểm tra content schedules và tự động generate
- **Post Publisher**: 
  - Tự động publish bài viết đã lên lịch

### 🔒 15. Bảo mật

- **JWT Security**: 
  - Access token ngắn hạn
  - Refresh token dài hạn
  - Token rotation
- **Password Security**: 
  - Bcrypt hashing
  - Salt rounds
- **Session Security**: 
  - HttpOnly cookies
  - Secure cookies (HTTPS)
  - SameSite protection
- **Input Validation**: 
  - Sanitize inputs
  - Validate data types
  - Prevent injection attacks
- **Rate Limiting**: (Có thể thêm)
- **CORS Protection**: Whitelist domains

---

## 💻 CLIENT - Chức năng Frontend

### 👥 CLIENT USER - Giao diện Người dùng

#### 1. Xác thực
- **Đăng ký**: Form đăng ký với OTP verification
- **Đăng nhập**: Form đăng nhập hoặc Google OAuth
- **Quên mật khẩu**: Flow reset password với OTP
- **Đổi mật khẩu**: Đổi mật khẩu trong profile

#### 2. Trang chủ (Home)
- **Hiển thị sản phẩm nổi bật**: Carousel hoặc grid
- **Bài viết mới nhất**: Danh sách bài viết
- **Danh mục**: Navigation theo categories
- **Tìm kiếm**: Search bar

#### 3. Gợi ý Quà tặng (Suggest Gift)
- **Form nhập thông tin**: 
  - Thông tin người nhận (tuổi, giới tính, sở thích)
  - Dịp tặng quà
  - Mối quan hệ
  - Ngân sách
- **Kết quả gợi ý**: 
  - Danh sách sản phẩm được gợi ý
  - Bài viết liên quan
  - Giải thích lý do gợi ý

#### 4. Sản phẩm
- **Danh sách sản phẩm**: 
  - Grid/List view
  - Phân trang
  - Lọc theo giá, tags, category
  - Sắp xếp
- **Chi tiết sản phẩm**: 
  - Hình ảnh, mô tả
  - Giá, link mua
  - Sản phẩm liên quan

#### 5. Bài viết (Articles)
- **Danh sách bài viết**: 
  - Card layout
  - Phân trang
  - Lọc theo tags, filters
  - Tìm kiếm
- **Chi tiết bài viết**: 
  - Nội dung HTML
  - Bình luận
  - Sản phẩm liên quan
  - Bài viết tương tự

#### 6. Chatbot AI
- **Giao diện chat**: 
  - Chat interface với AI
  - Hiển thị lịch sử conversation
  - Streaming response (real-time)
  - Gửi tin nhắn, xóa conversation
- **Gợi ý quà qua chat**: 
  - Chat với AI để được tư vấn
  - Nhận gợi ý quà tặng

#### 7. Dashboard Người dùng
- **Profile**: 
  - Xem và chỉnh sửa thông tin
  - Cập nhật sở thích
  - Quản lý mối quan hệ
- **Thông báo**: 
  - Danh sách thông báo
  - Đánh dấu đã đọc
  - Real-time updates
- **Lịch sử**: 
  - Lịch sử chat
  - Lịch sử tìm kiếm

#### 8. Tính năng khác
- **Bình luận**: 
  - Bình luận trên bài viết
  - Xem bình luận của người khác
- **Thông báo real-time**: 
  - Socket.io client
  - Hiển thị thông báo mới
- **Responsive Design**: 
  - Mobile-friendly
  - Tablet support

### 👨‍💼 CLIENT ADMIN - Giao diện Quản trị

#### 1. Dashboard
- **Thống kê tổng quan**: 
  - Số lượng users, products, posts
  - Biểu đồ thống kê
  - Top content, top products
- **Hoạt động gần đây**: 
  - Logs hoạt động
  - Thống kê AI usage

#### 2. Quản lý Sản phẩm
- **Danh sách sản phẩm**: 
  - Table với pagination
  - Tìm kiếm, lọc
- **Tạo/Sửa sản phẩm**: 
  - Form với validation
  - Upload hình ảnh
  - Chọn category, tags
- **Xóa sản phẩm**: 
  - Confirm dialog
  - Soft delete

#### 3. Quản lý Bài viết
- **Danh sách bài viết**: 
  - Table với status, featured
  - Lọc theo status, author
- **Tạo/Sửa bài viết**: 
  - Rich text editor (TinyMCE)
  - Upload thumbnail
  - Chọn filters, tags, products
  - Lên lịch xuất bản
  - Đánh dấu featured
- **Xuất bản**: 
  - Draft/Published status
  - Scheduled publishing

#### 4. Quản lý AI Prompts
- **Danh sách prompts**: 
  - Table với active status
  - AI provider, model info
- **Tạo/Sửa prompt**: 
  - Form cấu hình AI
  - Chọn provider (OpenAI/Claude/Gemini)
  - Cấu hình model, temperature, maxTokens
  - System message
- **Kích hoạt/Vô hiệu hóa**: 
  - Toggle active status
  - Chỉ prompt active mới được sử dụng

#### 5. Quản lý Content Schedule
- **Danh sách schedules**: 
  - Table với cron expression
  - Liên kết với AI Prompt
- **Tạo/Sửa schedule**: 
  - Form cấu hình
  - Chọn AI Prompt
  - Cron expression
  - Tự động generate content

#### 6. Quản lý Filters
- **Danh sách filters**: 
  - Table với type và options
- **Tạo/Sửa filter**: 
  - Chọn type
  - Thêm/sửa options
- **Xóa filter**

#### 7. Quản lý Bình luận
- **Danh sách bình luận**: 
  - Table với status
  - Lọc theo bài viết
- **Duyệt/Xóa bình luận**: 
  - Approve/Reject
  - Xóa bình luận không phù hợp

#### 8. Quản lý Người dùng
- **Danh sách users**: 
  - Table với role
  - Tìm kiếm
- **Xem chi tiết**: 
  - Profile user
  - Hoạt động
- **Phân quyền**: (Nếu có)

#### 9. Thống kê
- **Thống kê tổng quan**: 
  - Charts và graphs
  - Export data
- **Thống kê AI**: 
  - Usage by provider
  - Conversations stats
- **Thống kê nội dung**: 
  - Top posts, products
  - Engagement metrics

#### 10. Error Logs
- **Xem logs**: 
  - Table với logs
  - Filter theo level, date
  - Xem chi tiết error
- **Export logs**: Download logs

#### 11. Tính năng khác
- **Real-time updates**: 
  - Socket.io client
  - Cập nhật thống kê real-time
- **Responsive Design**: 
  - Admin dashboard responsive
  - Mobile support

---

## 🛠️ Công nghệ sử dụng

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: 
  - MongoDB (Mongoose)
  - Redis (ioredis)
- **Authentication**: 
  - JWT (jsonwebtoken)
  - Passport.js (Google OAuth)
  - Bcrypt
- **File Upload**: 
  - Multer
  - Cloudinary
- **Real-time**: Socket.io
- **AI Integration**: 
  - OpenAI SDK
  - Anthropic SDK
  - Google GenAI SDK
- **Scheduling**: node-cron
- **Logging**: Winston
- **Email**: Resend
- **Validation**: Custom DTOs và middleware

### Frontend (Client)
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Rich Text Editor**: TinyMCE (User client)

---

## 📁 Cấu trúc thư mục

```
goiytangqua/
├── server/                 # Backend API
│   ├── src/
│   │   ├── configs/        # Cấu hình (MongoDB, Redis, Cloudinary, Socket, Passport, Multer)
│   │   ├── controllers/    # Controllers xử lý request
│   │   ├── dtos/           # Data Transfer Objects (validation)
│   │   ├── events/         # Socket.io events
│   │   ├── middlewares/    # Middleware (auth, validation, error handling)
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── schedules/       # Cron jobs
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilities (AI service, helpers)
│   │   └── server.ts       # Entry point
│   ├── dist/               # Compiled JavaScript
│   ├── logs/               # Log files
│   └── package.json
├── client/
│   ├── admin/              # Admin dashboard
│   │   ├── src/
│   │   │   ├── app/        # Redux store
│   │   │   ├── components/ # Reusable components
│   │   │   ├── configs/    # Configurations
│   │   │   ├── contexts/   # React contexts
│   │   │   ├── features/   # Feature modules
│   │   │   ├── hooks/      # Custom hooks
│   │   │   ├── layouts/    # Layout components
│   │   │   ├── pages/      # Page components
│   │   │   ├── types/      # TypeScript types
│   │   │   └── utils/      # Utilities
│   │   └── package.json
│   └── user/               # User interface
│       ├── src/
│       │   ├── app/        # Redux store
│       │   ├── components/ # Reusable components
│       │   ├── configs/   # Configurations
│       │   ├── contexts/   # React contexts
│       │   ├── features/   # Feature modules
│       │   ├── hooks/      # Custom hooks
│       │   ├── layouts/    # Layout components
│       │   ├── pages/      # Page components
│       │   ├── types/      # TypeScript types
│       │   └── utils/      # Utilities
│       └── package.json
├── logos/                  # Logo và favicon
└── README.md
```

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Node.js >= 18.x
- MongoDB
- Redis (optional nhưng khuyến nghị)
- npm hoặc yarn

### 1. Clone repository

```bash
git clone https://github.com/Baodt2911/goiytangqua.git
cd goiytangqua
```

### 2. Cài đặt dependencies

#### Server
```bash
cd server
npm install
# hoặc
yarn install
```

#### Client Admin
```bash
cd ../client/admin
npm install
# hoặc
yarn install
```

#### Client User
```bash
cd ../user
npm install
# hoặc
yarn install
```

### 3. Cấu hình môi trường

#### Server (.env)
Tạo file `.env` trong thư mục `server/` với nội dung:

```env
# Server
PORT=5000
NODE_ENV=development
URL_CLIENT=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/goiytangqua

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

# Session
SESSION_KEY=your_session_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI APIs
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key
GEMINI_API_KEY=your_gemini_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Resend)
RESEND_API_KEY=your_resend_key
```

#### Client Admin & User
Tạo file `.env.local` trong thư mục client nếu cần:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Chạy dự án

#### Development Mode

**Server:**
```bash
cd server
npm run dev
# Server chạy tại http://localhost:5000
```

**Client Admin:**
```bash
cd client/admin
npm run dev
# Admin chạy tại http://localhost:5174
```

**Client User:**
```bash
cd client/user
npm run dev
# User chạy tại http://localhost:5173
```

#### Production Mode

**Server:**
```bash
cd server
npm run build
npm start
```

**Client Admin & User:**
```bash
cd client/admin
npm run build
# Deploy dist/ folder

cd ../user
npm run build
# Deploy dist/ folder
```

---

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `GET /auth/login/google` - Đăng nhập Google
- `GET /auth/google/callback` - Google OAuth callback

### User
- `GET /user/current` - Lấy thông tin user hiện tại
- `PATCH /user/update` - Cập nhật profile
- `PATCH /user/change-password` - Đổi mật khẩu
- `POST /user/reset-password/request` - Yêu cầu reset password
- `POST /user/reset-password` - Reset password

### Product
- `GET /product/all` - Lấy danh sách sản phẩm
- `GET /product/slug/:slug` - Lấy chi tiết sản phẩm
- `POST /product/create` - Tạo sản phẩm (Admin)
- `PATCH /product/update/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /product/delete/:id` - Xóa sản phẩm (Admin)

### Post
- `GET /post/all` - Lấy danh sách bài viết
- `GET /post/slug/:slug` - Lấy chi tiết bài viết
- `GET /post/best` - Lấy bài viết nổi bật
- `POST /post/slug/:slug/view` - Tăng lượt xem
- `POST /post/create` - Tạo bài viết (Admin)
- `PATCH /post/update/:id` - Cập nhật bài viết (Admin)
- `DELETE /post/delete/:id` - Xóa bài viết (Admin)

### Comment
- `GET /post/:id/comments` - Lấy bình luận
- `POST /post/:id/comment` - Tạo bình luận

### Chat
- `POST /chat` - Chat với AI
- `POST /chat/stream` - Chat streaming với AI

### Notification
- `GET /notification` - Lấy thông báo
- `PATCH /notification/:id/read` - Đánh dấu đã đọc

### Filter
- `GET /filter` - Lấy danh sách filters
- `POST /filter` - Tạo filter (Admin)
- `PATCH /filter/:id` - Cập nhật filter (Admin)
- `DELETE /filter/:id` - Xóa filter (Admin)

### AI Prompt
- `GET /prompt` - Lấy danh sách prompts
- `GET /prompt/:id` - Lấy chi tiết prompt
- `POST /prompt` - Tạo prompt (Admin)
- `PATCH /prompt/:id` - Cập nhật prompt (Admin)
- `PATCH /prompt/:id/active` - Kích hoạt/vô hiệu hóa (Admin)
- `DELETE /prompt/:id` - Xóa prompt (Admin)

### Content Schedule
- `GET /content-schedule/:aiPromptId` - Lấy schedule
- `POST /content-schedule` - Tạo schedule (Admin)
- `PATCH /content-schedule/:id` - Cập nhật schedule (Admin)
- `DELETE /content-schedule/:id` - Xóa schedule (Admin)

### Stats
- `GET /stats/overview` - Thống kê tổng quan
- `GET /stats/ai` - Thống kê AI
- `GET /stats/top-content` - Top nội dung
- `GET /stats/activities` - Thống kê hoạt động
- `GET /stats/post` - Thống kê bài viết

### Image
- `POST /image/upload` - Upload hình ảnh
- `DELETE /image/:publicId` - Xóa hình ảnh

### Token
- `POST /token/refresh` - Refresh access token

### OTP
- `POST /otp/send` - Gửi OTP
- `POST /otp/verify` - Xác thực OTP

### Logs
- `GET /logs` - Xem logs (Admin)

---

## 🔧 Tính năng nổi bật

### Server
- ✅ RESTful API với TypeScript
- ✅ JWT Authentication với refresh token
- ✅ Google OAuth 2.0
- ✅ Real-time communication với Socket.io
- ✅ Tích hợp AI (OpenAI, Claude, Gemini) với streaming
- ✅ Tự động tạo nội dung bằng AI
- ✅ Lên lịch xuất bản và tự động generate content
- ✅ Cron jobs cho scheduled tasks
- ✅ Upload và quản lý hình ảnh với Cloudinary
- ✅ Thống kê và analytics
- ✅ Logging và error handling
- ✅ Validation và security middleware

### Client
- ✅ Responsive design
- ✅ Real-time notifications
- ✅ Chat với AI (streaming)
- ✅ Rich text editor
- ✅ State management với Redux
- ✅ Form validation
- ✅ Image upload
- ✅ Pagination và filtering

---

## 📝 License

MIT

---

## 👨‍💻 Tác giả

Baodt2911

---

## 🤝 Đóng góp

Mọi đóng góp, báo lỗi hoặc ý tưởng mới đều được hoan nghênh! Hãy tạo issue hoặc pull request.
