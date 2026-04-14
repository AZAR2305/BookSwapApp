export type BookCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  campus?: string;
  bio?: string;
  role: 'student' | 'admin';
  blocked?: boolean;
  ratingAverage?: number;
  ratingCount?: number;
}

export interface BookListing {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: BookCondition;
  imageUrl: string;
  description?: string;
  userId: string;
  sellerName?: string;
  status: 'active' | 'sold' | 'removed';
  createdAt?: unknown;
}

export interface CartItem {
  book: BookListing;
  qty: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  bookId: string;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt?: unknown;
}

export interface Review {
  id: string;
  orderId: string;
  sellerId: string;
  buyerId: string;
  rating: number;
  comment: string;
  createdAt?: unknown;
}

export interface ChatThread {
  id: string;
  participants: string[];
  bookId: string;
  lastMessage?: string;
  updatedAt?: unknown;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt?: unknown;
}
