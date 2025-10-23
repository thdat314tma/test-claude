export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registeredAt: Date;
  borrowedBooksCount: number;
  maxBorrowLimit: number;
}

export class User implements IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registeredAt: Date;
  borrowedBooksCount: number;
  maxBorrowLimit: number;

  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    maxBorrowLimit: number = 5
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.registeredAt = new Date();
    this.borrowedBooksCount = 0;
    this.maxBorrowLimit = maxBorrowLimit;
  }

  // Kiểm tra người dùng có thể mượn sách không
  canBorrow(): boolean {
    return this.borrowedBooksCount < this.maxBorrowLimit;
  }

  // Tăng số lượng sách đang mượn
  incrementBorrowedBooks(): void {
    if (!this.canBorrow()) {
      throw new Error(`Người dùng ${this.name} đã đạt giới hạn mượn sách (${this.maxBorrowLimit} quyển)`);
    }
    this.borrowedBooksCount++;
  }

  // Giảm số lượng sách đang mượn
  decrementBorrowedBooks(): void {
    if (this.borrowedBooksCount > 0) {
      this.borrowedBooksCount--;
    }
  }

  // Hiển thị thông tin người dùng
  toString(): string {
    return `[${this.id}] ${this.name} - ${this.email} - Đang mượn: ${this.borrowedBooksCount}/${this.maxBorrowLimit}`;
  }
}
