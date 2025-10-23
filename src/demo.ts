import { LibraryService } from './services/LibraryService';

// Tạo instance của LibraryService
const library = new LibraryService();

console.log('========== HỆ THỐNG QUẢN LÝ THƯ VIỆN ==========\n');

// 1. Thêm sách vào thư viện
console.log('1. Thêm sách vào thư viện:');
const book1 = library.addBook(
  'Đắc Nhân Tâm',
  'Dale Carnegie',
  '978-0671027032',
  1936,
  'Kỹ năng sống'
);
console.log(`  ✓ ${book1.toString()}`);

const book2 = library.addBook(
  'Sapiens: Lược Sử Loài Người',
  'Yuval Noah Harari',
  '978-0062316097',
  2011,
  'Lịch sử'
);
console.log(`  ✓ ${book2.toString()}`);

const book3 = library.addBook(
  'Nhà Giả Kim',
  'Paulo Coelho',
  '978-0062315007',
  1988,
  'Tiểu thuyết'
);
console.log(`  ✓ ${book3.toString()}`);

const book4 = library.addBook(
  'Clean Code',
  'Robert C. Martin',
  '978-0132350884',
  2008,
  'Lập trình'
);
console.log(`  ✓ ${book4.toString()}`);

const book5 = library.addBook(
  'Tôi Tài Giỏi, Bạn Cũng Thế',
  'Adam Khoo',
  '978-6041103009',
  2009,
  'Kỹ năng sống'
);
console.log(`  ✓ ${book5.toString()}\n`);

// 2. Đăng ký người dùng
console.log('2. Đăng ký người dùng:');
const user1 = library.registerUser(
  'Nguyễn Văn A',
  'nguyenvana@email.com',
  '0901234567',
  'Hà Nội'
);
console.log(`  ✓ ${user1.toString()}`);

const user2 = library.registerUser(
  'Trần Thị B',
  'tranthib@email.com',
  '0907654321',
  'Hồ Chí Minh'
);
console.log(`  ✓ ${user2.toString()}`);

const user3 = library.registerUser(
  'Lê Văn C',
  'levanc@email.com',
  '0909876543',
  'Đà Nẵng'
);
console.log(`  ✓ ${user3.toString()}\n`);

// 3. Mượn sách
console.log('3. Mượn sách:');
try {
  const record1 = library.borrowBook(user1.id, book1.id);
  console.log(`  ✓ ${user1.name} mượn sách "${book1.title}"`);
  console.log(`    Hạn trả: ${record1.dueDate.toLocaleDateString('vi-VN')}`);

  const record2 = library.borrowBook(user1.id, book2.id, 21); // Mượn 21 ngày
  console.log(`  ✓ ${user1.name} mượn sách "${book2.title}"`);
  console.log(`    Hạn trả: ${record2.dueDate.toLocaleDateString('vi-VN')}`);

  const record3 = library.borrowBook(user2.id, book3.id);
  console.log(`  ✓ ${user2.name} mượn sách "${book3.title}"`);
  console.log(`    Hạn trả: ${record3.dueDate.toLocaleDateString('vi-VN')}\n`);
} catch (error: any) {
  console.log(`  ✗ Lỗi: ${error.message}\n`);
}

// 4. Hiển thị sách có sẵn
console.log('4. Danh sách sách có sẵn:');
const availableBooks = library.getAvailableBooks();
availableBooks.forEach(book => {
  console.log(`  - ${book.title} (${book.author})`);
});
console.log();

// 5. Tìm kiếm sách
console.log('5. Tìm kiếm sách theo thể loại "Kỹ năng sống":');
const skillBooks = library.searchBooksByCategory('Kỹ năng sống');
skillBooks.forEach(book => {
  console.log(`  - ${book.title} - ${book.status}`);
});
console.log();

// 6. Xem sách đang mượn của người dùng
console.log('6. Sách đang mượn của người dùng:');
const user1Records = library.getUserActiveBorrowRecords(user1.id);
console.log(`  ${user1.name}:`);
user1Records.forEach(record => {
  const book = library.getBook(record.bookId);
  console.log(`    - ${book?.title} (Hạn trả: ${record.dueDate.toLocaleDateString('vi-VN')})`);
});
console.log();

// 7. Trả sách
console.log('7. Trả sách:');
try {
  const activeRecords = library.getUserActiveBorrowRecords(user1.id);
  if (activeRecords.length > 0) {
    const returnedRecord = library.returnBook(activeRecords[0].id);
    const returnedBook = library.getBook(returnedRecord.bookId);
    console.log(`  ✓ ${user1.name} trả sách "${returnedBook?.title}"`);
    console.log(`    Trả vào: ${returnedRecord.returnDate?.toLocaleDateString('vi-VN')}\n`);
  }
} catch (error: any) {
  console.log(`  ✗ Lỗi: ${error.message}\n`);
}

// 8. Thống kê thư viện
library.printStatistics();

// 9. Thử mượn sách đã được mượn (sẽ báo lỗi)
console.log('9. Thử mượn sách đã được mượn:');
try {
  library.borrowBook(user3.id, book2.id);
} catch (error: any) {
  console.log(`  ✗ ${error.message}\n`);
}

// 10. Hiển thị tất cả người dùng
console.log('10. Danh sách người dùng:');
const allUsers = library.getAllUsers();
allUsers.forEach(user => {
  console.log(`  ${user.toString()}`);
});
console.log();

// 11. Hiển thị tất cả phiếu mượn đang hoạt động
console.log('11. Phiếu mượn đang hoạt động:');
const activeRecords = library.getActiveBorrowRecords();
activeRecords.forEach(record => {
  const book = library.getBook(record.bookId);
  const user = library.getUser(record.userId);
  console.log(`  ${user?.name}: "${book?.title}" - Hạn: ${record.dueDate.toLocaleDateString('vi-VN')}`);
});
console.log();

console.log('========== KẾT THÚC DEMO ==========');
