# Quy chuẩn Cổng Nghiệm Thu Tasks (DRV Tasks Acceptance Portal)

> [!IMPORTANT]
> **Quy định Bắt buộc:**
> Tất cả các task, thành phần giao diện và lịch sử nghiệm thu trên cổng web này phải tuân thủ các nguyên tắc thiết kế và quy chuẩn định danh được nêu dưới đây.

---

## 1. Môi trường & Triển khai Máy chủ Web (IIS Hosting)
- **Loại Website**: Static Web Application (HTML5 / Modern JavaScript / Tailwind CSS).
- **Web Server**: Microsoft Internet Information Services (IIS).
- **Physical Path**: `X:\acc\drv\slns\drv-tasks-sln`.
- **Cổng Binding**: Port `5555` (`http://localhost:5555` hoặc `http://<IP-LAN>:5555`).
- **Ưu điểm**: Khởi chạy tức thì, không tốn RAM máy chủ, không phụ thuộc môi trường runtime NodeJS/ASP.NET, độ ổn định 100%.

---

## 2. Quy chuẩn Định danh Bất biến (UUID v7 Standard - RFC 9562)
- **Chuẩn UUID v7**: Mọi Task ID, Screen Item ID và Lượt nghiệm thu (Acceptance ID) **BẮT BUỘC** sử dụng định dạng **UUID v7**.
- **Đặc tính**:
  1. *Time-ordered*: 48-bit đầu là Unix millisecond timestamp $\rightarrow$ dữ liệu JSON tự động sắp xếp theo thứ tự thời gian.
  2. *Không bao giờ trùng lặp (Collision-free 100%)*: An toàn khi nhiều người cùng thao tác.
  3. *Git-friendly*: Diff trên Git ổn định, không làm xáo trộn các khóa JSON.

---

## 3. Cấu trúc Thư mục Phân cấp (Folder-per-Task Architecture)
Hệ thống được tổ chức phân cấp rõ ràng theo cấu trúc Năm / Tháng / Tên Task:

```text
X:\acc\drv\slns\drv-tasks-sln\
├── index.html                           # Dashboard tổng quan danh sách tasks & quản lý phiên
├── RULES.md                             # Tài liệu quy chuẩn kiến trúc & vận hành
├── assets\
│   └── js\
│       ├── uuidv7.js                    # Thư viện sinh UUID v7 chuẩn RFC 9562
│       └── auth.js                      # Quản lý xác thực client-side & phân biệt người duyệt
└── tasks\
    └── 2026\
        └── 09\
            └── PQ-SDT-KH\               # Thư mục riêng của Task Phân quyền SĐT Khách hàng
                ├── index.html           # Giao diện nghiệm thu trực quan dành cho Boss/User
                ├── data.json            # Dữ liệu danh mục 27 màn hình kèm UUID v7
                └── approvals\           # Nơi lưu trữ các file JSON nghiệm thu đã xuất
                    └── .gitkeep
```

---

## 4. Cơ chế Đăng nhập & Phân định Người duyệt (User Roles)
Hệ thống sử dụng xác thực Client-side qua JavaScript, lưu phiên an toàn trong `sessionStorage` / `localStorage`:
- **Tài khoản `chi` / Mật khẩu `chi`**:
  - *Chức vụ*: Quản lý (Boss / Approver).
  - *Quyền hạn*: Ký duyệt nghiệm thu chính thức, xuất file JSON báo cáo nghiệm thu có chữ ký `role: "approver"`.
- **Tài khoản `drv` / Mật khẩu `drv`**:
  - *Chức vụ*: Kỹ thuật (Dev / Tester).
  - *Quyền hạn*: Kiểm thử trước, soát lỗi, chạy demo (`role: "tester"`).

---

## 5. Quy chuẩn Góc nhìn Người dùng (User-Centric UI Acceptance)
Trên giao diện nghiệm thu của Boss:
- **Tuyệt đối không dùng thuật ngữ code**: Không hiển thị tên file `.cs`, tên biến `_gcc...`, class hay delegate C#.
- **Thông tin hiển thị bắt buộc**:
  1. *Tên màn hình thực tế*: Tên thân quen mà Boss nhìn thấy trên phần mềm.
  2. *Đường dẫn Menu trong App*: Chỉ rõ đường dẫn bấm vào (vd: `Lịch hẹn > Đặt lịch`).
  3. *Vị trí trên giao diện*: Cột bảng, ô nhập liệu, ô tìm kiếm hay tiêu đề form.
  4. *Hành vi khi bị khóa*: Nêu rõ biểu hiện thực tế (Ẩn cột, che `***`, nền xám, chặn xuất Excel).
  5. *Hướng dẫn kiểm tra nhanh*: Hướng dẫn 1 thao tác cụ thể để Boss kiểm tra ngay trên app.
