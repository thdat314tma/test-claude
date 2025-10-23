import { BookStatus } from '../types';

export interface IBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  category: string;
  status: BookStatus;
  createdAt: Date;
}

export class Book implements IBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  category: string;
  status: BookStatus;
  createdAt: Date;

  constructor(
    id: string,
    title: string,
    author: string,
    isbn: string,
    publishYear: number,
    category: string,
    status: BookStatus = BookStatus.AVAILABLE
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publishYear = publishYear;
    this.category = category;
    this.status = status;
    this.createdAt = new Date();
  }

  // Đánh dấu sách là đang được mượn
  markAsBorrowed(): void {
    if (this.status !== BookStatus.AVAILABLE) {
      throw new Error(`Sách "${this.title}" không thể mượn. Trạng thái hiện tại: ${this.status}`);
    }
    this.status = BookStatus.BORROWED;
  }

  // Đánh dấu sách đã được trả
  markAsReturned(): void {
    if (this.status !== BookStatus.BORROWED) {
      throw new Error(`Sách "${this.title}" không trong trạng thái mượn`);
    }
    this.status = BookStatus.AVAILABLE;
  }

  // Đánh dấu sách bảo trì
  markAsMaintenance(): void {
    this.status = BookStatus.MAINTENANCE;
  }

  // Đánh dấu sách bị mất
  markAsLost(): void {
    this.status = BookStatus.LOST;
  }

  // Kiểm tra sách có sẵn để mượn không
  isAvailable(): boolean {
    return this.status === BookStatus.AVAILABLE;
  }

  // Hiển thị thông tin sách
  toString(): string {
    return `[${this.id}] ${this.title} - ${this.author} (${this.publishYear}) - ${this.status}`;
  }
}
