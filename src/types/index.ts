// Enums và types cho hệ thống

export enum BookStatus {
  AVAILABLE = 'AVAILABLE',      // Sẵn sàng cho mượn
  BORROWED = 'BORROWED',         // Đang được mượn
  MAINTENANCE = 'MAINTENANCE',   // Đang bảo trì
  LOST = 'LOST'                  // Bị mất
}

export enum BorrowStatus {
  ACTIVE = 'ACTIVE',       // Đang mượn
  RETURNED = 'RETURNED',   // Đã trả
  OVERDUE = 'OVERDUE'      // Quá hạn
}
