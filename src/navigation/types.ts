import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BookListing } from '@/src/utils/types';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TabsParamList = {
  Home: undefined;
  Sell: { bookId?: string } | undefined;
  Cart: undefined;
  Chat: undefined;
  Profile: undefined;
  Admin: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabsParamList>;
  BookDetails: { book: BookListing };
  Checkout: undefined;
  OrderConfirmation: { message?: string };
  ReviewSeller: { orderId: string; sellerId: string };
  EditProfile: undefined;
  ChatRoom: { threadId: string; title?: string };
};
