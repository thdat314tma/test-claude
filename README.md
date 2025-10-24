# Hệ Thống Quản Lý Thư Viện Sách

Hệ thống quản lý thư viện sách full-stack với Backend API (Express.js) và Frontend (React), hỗ trợ đầy đủ các chức năng quản lý sách, người dùng, mượn/trả sách.

## Tech Stack

- **Backend**: Node.js + Express.js + TypeScript
- **Frontend**: React + TypeScript
- **Core Library**: TypeScript Models & Services

## Tính năng

### Quản lý Sách
- Thêm/xóa sách
- Tìm kiếm sách theo tiêu đề, tác giả, thể loại
- Xem danh sách sách có sẵn
- Quản lý trạng thái sách (Có sẵn, Đang mượn, Bảo trì, Mất)

### Quản lý Người dùng
- Đăng ký/xóa người dùng
- Giới hạn số sách có thể mượn (mặc định: 5 quyển)
- Theo dõi số sách đang mượn
- Xem lịch sử mượn sách

### Quản lý Mượn/Trả sách
- Mượn sách với thời hạn tùy chỉnh (mặc định: 14 ngày)
- Trả sách
- Theo dõi phiếu mượn quá hạn
- Lọc phiếu mượn theo trạng thái

### Thống kê & Dashboard
- Tổng số sách, người dùng
- Số sách có sẵn/đang mượn
- Số phiếu mượn đang hoạt động/quá hạn
- Giao diện trực quan với charts

## Cấu trúc thư mục

```
library-management-system/
├── backend/                    # Backend API Server
│   ├── src/
│   │   ├── controllers/        # API Controllers
│   │   │   └── LibraryController.ts
│   │   ├── routes/             # API Routes
│   │   │   └── index.ts
│   │   └── server.ts           # Express server
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # React Components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Books.tsx
│   │   │   ├── Users.tsx
│   │   │   └── Borrows.tsx
│   │   ├── services/           # API Service
│   │   │   └── api.ts
│   │   ├── styles/             # CSS Styles
│   │   │   └── App.css
│   │   ├── App.tsx             # Main App Component
│   │   ├── index.tsx           # Entry point
│   │   └── types.ts            # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── src/                        # Core Library (Shared Logic)
    ├── models/                 # Data Models
    │   ├── Book.ts
    │   ├── User.ts
    │   └── BorrowRecord.ts
    ├── services/               # Business Logic
    │   └── LibraryService.ts
    ├── types/                  # Type Definitions
    │   └── index.ts
    ├── index.ts                # Library exports
    └── demo.ts                 # Demo usage
```

## Cài đặt và Chạy

### 1. Cài đặt Backend

```bash
cd backend
npm install
```

### 2. Chạy Backend API

```bash
# Development mode với auto-reload
npm run watch

# Hoặc chạy thông thường
npm run dev

# Build và chạy production
npm run build
npm start
```

Backend sẽ chạy tại: `http://localhost:3001`

### 3. Cài đặt Frontend

```bash
cd frontend
npm install
```

### 4. Chạy Frontend

```bash
# Development mode
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 5. Chạy Demo Core Library

```bash
# Từ thư mục gốc
npm install
npm run dev
```

## REST API Endpoints

### Books API

```
GET    /api/books                           # Lấy tất cả sách
GET    /api/books/available                 # Lấy sách có sẵn
GET    /api/books/:id                       # Lấy sách theo ID
POST   /api/books                           # Thêm sách mới
DELETE /api/books/:id                       # Xóa sách
GET    /api/books/search/title/:query       # Tìm theo tiêu đề
GET    /api/books/search/author/:query      # Tìm theo tác giả
GET    /api/books/search/category/:query    # Tìm theo thể loại
```

### Users API

```
GET    /api/users                           # Lấy tất cả người dùng
GET    /api/users/:id                       # Lấy người dùng theo ID
POST   /api/users                           # Đăng ký người dùng
DELETE /api/users/:id                       # Xóa người dùng
GET    /api/users/:id/borrows               # Lấy phiếu mượn của user
GET    /api/users/:id/active-borrows        # Lấy phiếu mượn đang hoạt động
```

### Borrows API

```
GET    /api/borrows                         # Lấy tất cả phiếu mượn
GET    /api/borrows/active                  # Lấy phiếu mượn đang hoạt động
GET    /api/borrows/overdue                 # Lấy phiếu mượn quá hạn
POST   /api/borrows                         # Mượn sách
POST   /api/borrows/:id/return              # Trả sách
```

### Statistics API

```
GET    /api/statistics                      # Lấy thống kê tổng quan
```

## API Request Examples

### Thêm sách mới

```bash
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Đắc Nhân Tâm",
    "author": "Dale Carnegie",
    "isbn": "978-0671027032",
    "publishYear": 1936,
    "category": "Kỹ năng sống"
  }'
```

### Đăng ký người dùng

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@email.com",
    "phone": "0901234567",
    "address": "Hà Nội"
  }'
```

### Mượn sách

```bash
curl -X POST http://localhost:3001/api/borrows \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "U0001",
    "bookId": "B0001",
    "borrowDays": 14
  }'
```

### Trả sách

```bash
curl -X POST http://localhost:3001/api/borrows/R0001/return
```

## Frontend Features

### Dashboard
- Thống kê tổng quan với cards màu sắc
- Số liệu real-time về sách, người dùng, phiếu mượn

### Quản lý Sách
- Danh sách sách với bảng dữ liệu đẹp
- Form thêm sách mới
- Tìm kiếm sách theo tiêu đề
- Xóa sách (không cho phép xóa sách đang mượn)
- Badge trạng thái với màu sắc

### Quản lý Người dùng
- Danh sách người dùng
- Form đăng ký người dùng mới
- Hiển thị số sách đang mượn / giới hạn
- Xóa người dùng (không cho phép xóa nếu đang mượn sách)

### Mượn/Trả Sách
- Form mượn sách với dropdown chọn user và book
- Lọc phiếu mượn: Tất cả / Đang hoạt động / Quá hạn
- Hiển thị ngày mượn, hạn trả, ngày trả
- Nút trả sách cho phiếu đang hoạt động
- Badge trạng thái phiếu mượn

## Models

### Book
- `id`: ID sách (tự động: B0001, B0002,...)
- `title`: Tiêu đề
- `author`: Tác giả
- `isbn`: Mã ISBN
- `publishYear`: Năm xuất bản
- `category`: Thể loại
- `status`: Trạng thái (AVAILABLE, BORROWED, MAINTENANCE, LOST)

### User
- `id`: ID người dùng (tự động: U0001, U0002,...)
- `name`: Tên
- `email`: Email
- `phone`: Số điện thoại
- `address`: Địa chỉ
- `borrowedBooksCount`: Số sách đang mượn
- `maxBorrowLimit`: Giới hạn mượn (mặc định: 5)

### BorrowRecord
- `id`: ID phiếu mượn (tự động: R0001, R0002,...)
- `bookId`: ID sách
- `userId`: ID người dùng
- `borrowDate`: Ngày mượn
- `dueDate`: Hạn trả
- `returnDate`: Ngày trả (nếu đã trả)
- `status`: Trạng thái (ACTIVE, RETURNED, OVERDUE)

## Giới hạn và Quy tắc

1. Mỗi người dùng chỉ được mượn tối đa 5 quyển sách (có thể tùy chỉnh)
2. Thời hạn mượn mặc định là 14 ngày (có thể tùy chỉnh khi mượn)
3. Không thể xóa sách đang được mượn
4. Không thể xóa người dùng đang mượn sách
5. Sách chỉ có thể mượn khi ở trạng thái AVAILABLE
6. Hệ thống tự động đánh dấu phiếu mượn quá hạn

## Sử dụng Core Library trong Code

```typescript
import { LibraryService } from './src/services/LibraryService';

// Khởi tạo service
const library = new LibraryService();

// Thêm sách
const book = library.addBook(
  'Đắc Nhân Tâm',
  'Dale Carnegie',
  '978-0671027032',
  1936,
  'Kỹ năng sống'
);

// Đăng ký người dùng
const user = library.registerUser(
  'Nguyễn Văn A',
  'nguyenvana@email.com',
  '0901234567',
  'Hà Nội'
);

// Mượn sách
const record = library.borrowBook(user.id, book.id, 14);

// Trả sách
library.returnBook(record.id);

// Tìm kiếm
const books = library.searchBooksByTitle('Đắc Nhân Tâm');

// Thống kê
library.printStatistics();
```

## Môi trường & Cấu hình

### Backend Environment Variables
Không cần cấu hình đặc biệt. Port mặc định: 3001

### Frontend Environment Variables
File `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:3001/api
```

## Screenshots & Demo

### Dashboard
- 6 cards thống kê với màu sắc đẹp mắt
- Hiển thị real-time data

### Quản lý Sách
- Table responsive với header cố định
- Form thêm sách với validation
- Search box với nút tìm kiếm và làm mới

### Quản lý Người dùng
- Hiển thị đầy đủ thông tin người dùng
- Badge số sách đang mượn
- Disable delete button khi có sách đang mượn

### Mượn/Trả Sách
- Dropdown chọn user và book
- Input số ngày mượn (1-90)
- Filter buttons: Tất cả / Đang hoạt động / Quá hạn
- Badge trạng thái với màu sắc phù hợp

## Mở rộng

Hệ thống có thể được mở rộng với:

- Database persistence (MongoDB, PostgreSQL, MySQL)
- Authentication & Authorization (JWT, OAuth)
- File upload cho ảnh bìa sách
- Đặt trước sách
- Hệ thống phạt cho sách quá hạn
- Email notifications
- QR code cho sách
- Mobile app với .NET MAUI (sử dụng chung REST API)
- Reports & Analytics
- Multi-language support

## .NET MAUI Integration

Để tích hợp với .NET MAUI, bạn có thể:

1. Sử dụng REST API backend đã có (http://localhost:3001/api)
2. Tạo MAUI app với HttpClient để gọi API
3. Sử dụng MVVM pattern
4. Tận dụng Xamarin.Forms controls

Ví dụ C# code:

```csharp
public class LibraryApiService
{
    private readonly HttpClient _client;
    private const string BaseUrl = "http://localhost:3001/api";

    public async Task<List<Book>> GetBooksAsync()
    {
        var response = await _client.GetAsync($"{BaseUrl}/books");
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<List<Book>>(json);
    }

    public async Task<Book> AddBookAsync(Book book)
    {
        var json = JsonSerializer.Serialize(book);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await _client.PostAsync($"{BaseUrl}/books", content);
        return await response.Content.ReadAsAsync<Book>();
    }
}
```

## Troubleshooting

### Backend không chạy được
- Kiểm tra port 3001 có bị chiếm không
- Chạy `npm install` trong thư mục backend
- Kiểm tra TypeScript compiler: `npx tsc --version`

### Frontend không kết nối được API
- Kiểm tra backend đang chạy ở port 3001
- Kiểm tra file `.env` trong frontend
- Kiểm tra CORS settings trong backend

### Module not found
- Xóa `node_modules` và chạy lại `npm install`
- Kiểm tra `tsconfig.json`

## License

MIT

## Contributors

Được phát triển với Claude Code
