# 🎁 Gợi Ý Tặng Quà

## Mô tả ứng dụng

"Gợi Ý Tặng Quà" là nền tảng web giúp người dùng dễ dàng tìm kiếm, lựa chọn và nhận các gợi ý quà tặng phù hợp cho từng dịp đặc biệt như sinh nhật, kỷ niệm, lễ tết, v.v. Ứng dụng sử dụng AI để cá nhân hóa gợi ý dựa trên thông tin người nhận, sở thích, độ tuổi, mối quan hệ... Ngoài ra, hệ thống còn hỗ trợ quản lý sản phẩm, bài viết, bình luận, chat real-time và nhiều tính năng nâng cao cho cả người dùng cuối lẫn quản trị viên.

Dự án gồm 3 phần chính:

- **Admin**: Quản trị nội dung, sản phẩm, bài viết, thống kê, AI prompt, quản lý người dùng, duyệt bình luận, kiểm duyệt nội dung...
- **User**: Giao diện người dùng cuối, tìm kiếm, lọc, chat, bình luận, nhận gợi ý quà tặng, xem bài viết, sản phẩm, đặt hàng...
- **Server**: API backend, xử lý logic, lưu trữ dữ liệu, xác thực, AI, socket, quản lý session, bảo mật...

## 📝 Các chức năng chi tiết

### Đối với người dùng (User)

- Đăng ký, đăng nhập, xác thực tài khoản
- Tìm kiếm, lọc sản phẩm theo dịp, đối tượng, sở thích, giá...
- Nhận gợi ý quà tặng thông minh từ AI dựa trên thông tin nhập vào
- Xem chi tiết sản phẩm, bài viết tư vấn, hướng dẫn chọn quà
- Chat, bình luận, hỏi đáp về sản phẩm hoặc bài viết
- Nhận thông báo real-time về phản hồi
- Quản lý tài khoản cá nhân

### Đối với quản trị viên (Admin)

- Quản lý danh mục, sản phẩm, bài viết, bình luận, người dùng
- Thêm/sửa/xóa sản phẩm, bài viết, kiểm duyệt nội dung
- Quản lý AI Prompt, cấu hình gợi ý AI, tự động tạo bài viết theo AI Prompt
- Thống kê số liệu: số lượng người dùng, sản phẩm, bài viết, đơn hàng, tương tác...
- Quản lý thông báo, gửi thông báo đến người dùng
- Quản lý lịch trình nội dung, sự kiện đặc biệt

### Đối với hệ thống (Server)

- Xử lý xác thực, phân quyền, bảo mật JWT
- Kết nối cơ sở dữ liệu MongoDB, Redis, Cloudinary
- Tích hợp AI Prompt cho gợi ý quà tặng
- Hỗ trợ chat, thông báo real-time qua Socket.io
- API RESTful cho client admin & user

## 📁 Cấu trúc thư mục

```
├── client/
│   ├── admin/   # Giao diện quản trị viên
│   └── user/    # Giao diện người dùng cuối
├── server/      # Backend Node.js/Express
├── logos/       # Logo, favicon
└── Biểu đồ gợi ý tặng quà.drawio # Sơ đồ hệ thống
```

## 🚀 Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone https://github.com/Baodt2911/goiytangqua.git
cd goiytangqua
```

### 2. Cài đặt dependencies

- **Server**

```bash
cd server
npm install
```

- **Client (admin & user)**

```bash
cd ../client/admin && npm install
cd ../user && npm install
```

### 3. Cấu hình môi trường

- Copy file `.env.example` thành `.env` trong thư mục `server` và cập nhật thông tin kết nối MongoDB, Redis, Cloudinary...
- Tạo file `.env.local` cho `client/admin` và `client/user` nếu cần cấu hình riêng.

### 4. Chạy dự án

- **Server**

```bash
cd server
npm run dev
```

- **Client Admin**

```bash
cd client/admin
npm run dev
```

- **Client User**

```bash
cd client/user
npm run dev
```

## 🛠️ Công nghệ sử dụng

- **Frontend**: React, TypeScript, Vite, Ant Design
- **Backend**: Node.js, Express, TypeScript, MongoDB, Redis, Cloudinary, Socket.io
- **Khác**: Docker, Passport, Multer, AI Prompt, JWT

## 📚 Tính năng nổi bật

- Đăng nhập/Đăng ký, phân quyền Admin/User
- Quản lý sản phẩm, bài viết, bình luận, thống kê
- Gợi ý quà tặng thông minh (AI Prompt)
- Chat, bình luận, thông báo real-time
- Lọc, tìm kiếm, phân loại sản phẩm/bài viết

## 👨‍💻 Đóng góp

Mọi đóng góp, báo lỗi hoặc ý tưởng mới đều được hoan nghênh! Hãy tạo issue hoặc pull request.

## 📄 License

MIT
