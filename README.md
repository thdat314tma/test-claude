# Hệ Thống Quản Lý Thư Viện Sách

Hệ thống quản lý thư viện sách đơn giản được viết bằng TypeScript, hỗ trợ các chức năng cơ bản như quản lý sách, người dùng, mượn/trả sách.

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

### Quản lý Mượn/Trả sách
- Mượn sách với thời hạn tùy chỉnh (mặc định: 14 ngày)
- Trả sách
- Theo dõi phiếu mượn quá hạn
- Xem lịch sử mượn sách

### Thống kê
- Tổng số sách, người dùng
- Số sách có sẵn/đang mượn
- Số phiếu mượn đang hoạt động/quá hạn

## Cấu trúc thư mục

```
library-management-system/
├── src/
│   ├── models/           # Các model dữ liệu
│   │   ├── Book.ts       # Model sách
│   │   ├── User.ts       # Model người dùng
│   │   └── BorrowRecord.ts # Model phiếu mượn
│   ├── services/         # Services xử lý logic
│   │   └── LibraryService.ts # Service quản lý thư viện
│   ├── types/            # Type definitions
│   │   └── index.ts      # Enums và types
│   ├── index.ts          # Export chính
│   └── demo.ts           # File demo sử dụng
├── package.json
├── tsconfig.json
└── README.md
```

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Hoặc sử dụng yarn
yarn install
```

## Sử dụng

### Chạy demo

```bash
# Sử dụng ts-node (development)
npm run dev

# Hoặc build và chạy
npm run build
npm start
```

### Sử dụng trong code

```typescript
import { LibraryService } from './services/LibraryService';

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

// Mượn sách (14 ngày)
const record = library.borrowBook(user.id, book.id);

// Mượn sách với thời hạn tùy chỉnh (21 ngày)
const record2 = library.borrowBook(user.id, book.id, 21);

// Trả sách
library.returnBook(record.id);

// Tìm kiếm sách
const searchResults = library.searchBooksByTitle('Đắc Nhân Tâm');
const authorBooks = library.searchBooksByAuthor('Dale Carnegie');
const categoryBooks = library.searchBooksByCategory('Kỹ năng sống');

// Xem sách có sẵn
const availableBooks = library.getAvailableBooks();

// Xem sách đang mượn của người dùng
const userBorrows = library.getUserActiveBorrowRecords(user.id);

// Xem phiếu mượn quá hạn
const overdueRecords = library.getOverdueBorrowRecords();

// Xem thống kê
library.printStatistics();
```

## API Reference

### LibraryService

#### Quản lý Sách

- `addBook(title, author, isbn, publishYear, category): Book` - Thêm sách mới
- `removeBook(bookId): boolean` - Xóa sách
- `getBook(bookId): Book | undefined` - Lấy thông tin sách
- `getAllBooks(): Book[]` - Lấy tất cả sách
- `getAvailableBooks(): Book[]` - Lấy sách có sẵn
- `searchBooksByTitle(title): Book[]` - Tìm sách theo tiêu đề
- `searchBooksByAuthor(author): Book[]` - Tìm sách theo tác giả
- `searchBooksByCategory(category): Book[]` - Tìm sách theo thể loại

#### Quản lý Người dùng

- `registerUser(name, email, phone, address): User` - Đăng ký người dùng
- `removeUser(userId): boolean` - Xóa người dùng
- `getUser(userId): User | undefined` - Lấy thông tin người dùng
- `getAllUsers(): User[]` - Lấy tất cả người dùng

#### Quản lý Mượn/Trả sách

- `borrowBook(userId, bookId, borrowDays?): BorrowRecord` - Mượn sách
- `returnBook(recordId): BorrowRecord` - Trả sách
- `getAllBorrowRecords(): BorrowRecord[]` - Lấy tất cả phiếu mượn
- `getActiveBorrowRecords(): BorrowRecord[]` - Lấy phiếu mượn đang hoạt động
- `getUserBorrowRecords(userId): BorrowRecord[]` - Lấy phiếu mượn của người dùng
- `getUserActiveBorrowRecords(userId): BorrowRecord[]` - Lấy phiếu mượn đang hoạt động của người dùng
- `getOverdueBorrowRecords(): BorrowRecord[]` - Lấy phiếu mượn quá hạn

#### Thống kê

- `getStatistics()` - Lấy thống kê thư viện
- `printStatistics()` - In thống kê ra console

## Models

### Book
- `id`: ID sách (tự động)
- `title`: Tiêu đề
- `author`: Tác giả
- `isbn`: Mã ISBN
- `publishYear`: Năm xuất bản
- `category`: Thể loại
- `status`: Trạng thái (AVAILABLE, BORROWED, MAINTENANCE, LOST)

### User
- `id`: ID người dùng (tự động)
- `name`: Tên
- `email`: Email
- `phone`: Số điện thoại
- `address`: Địa chỉ
- `borrowedBooksCount`: Số sách đang mượn
- `maxBorrowLimit`: Giới hạn mượn (mặc định: 5)

### BorrowRecord
- `id`: ID phiếu mượn (tự động)
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

## Ví dụ Kết quả Demo

```
========== HỆ THỐNG QUẢN LÝ THƯ VIỆN ==========

1. Thêm sách vào thư viện:
  ✓ [B0001] Đắc Nhân Tâm - Dale Carnegie (1936) - AVAILABLE
  ✓ [B0002] Sapiens: Lược Sử Loài Người - Yuval Noah Harari (2011) - AVAILABLE
  ...

2. Đăng ký người dùng:
  ✓ [U0001] Nguyễn Văn A - nguyenvana@email.com - Đang mượn: 0/5
  ...

3. Mượn sách:
  ✓ Nguyễn Văn A mượn sách "Đắc Nhân Tâm"
    Hạn trả: 06/11/2025
  ...

========== THỐNG KÊ THƯ VIỆN ==========
Tổng số sách: 5
  - Sách có sẵn: 3
  - Sách đang mượn: 2
Tổng số người dùng: 3
Phiếu mượn đang hoạt động: 2
Phiếu mượn quá hạn: 0
========================================
```

## Mở rộng

Hệ thống có thể được mở rộng với các tính năng:

- Lưu trữ dữ liệu vào database (MongoDB, PostgreSQL, etc.)
- API REST/GraphQL
- Giao diện web
- Hệ thống phạt cho sách quá hạn
- Đặt trước sách
- Đánh giá và bình luận sách
- Hệ thống thông báo (email, SMS)
- Báo cáo và xuất file

## License

MIT
