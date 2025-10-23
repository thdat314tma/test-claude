import { BorrowStatus } from '../types';

export interface IBorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: BorrowStatus;
}

export class BorrowRecord implements IBorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: BorrowStatus;

  constructor(
    id: string,
    bookId: string,
    userId: string,
    borrowDays: number = 14 // Mặc định cho mượn 14 ngày
  ) {
    this.id = id;
    this.bookId = bookId;
    this.userId = userId;
    this.borrowDate = new Date();
    this.dueDate = new Date();
    this.dueDate.setDate(this.dueDate.getDate() + borrowDays);
    this.status = BorrowStatus.ACTIVE;
  }

  // Đánh dấu sách đã được trả
  markAsReturned(): void {
    if (this.status === BorrowStatus.RETURNED) {
      throw new Error('Sách đã được trả trước đó');
    }
    this.returnDate = new Date();
    this.status = BorrowStatus.RETURNED;
  }

  // Kiểm tra có quá hạn không
  isOverdue(): boolean {
    if (this.status === BorrowStatus.RETURNED) {
      return false;
    }
    return new Date() > this.dueDate;
  }

  // Cập nhật trạng thái quá hạn
  updateStatus(): void {
    if (this.status === BorrowStatus.ACTIVE && this.isOverdue()) {
      this.status = BorrowStatus.OVERDUE;
    }
  }

  // Tính số ngày quá hạn
  getDaysOverdue(): number {
    if (!this.isOverdue()) {
      return 0;
    }
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - this.dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Hiển thị thông tin phiếu mượn
  toString(): string {
    const returnInfo = this.returnDate
      ? `Đã trả: ${this.returnDate.toLocaleDateString('vi-VN')}`
      : `Hạn trả: ${this.dueDate.toLocaleDateString('vi-VN')}`;

    return `[${this.id}] Sách: ${this.bookId} - Người mượn: ${this.userId} - ${returnInfo} - ${this.status}`;
  }
}
