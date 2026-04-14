import axios from 'axios';
import { ENV } from '@/src/config/env';
import type { BookListing } from '@/src/utils/types';

export const getBookRecommendations = async (
  userId: string,
  fallbackBooks: BookListing[]
): Promise<BookListing[]> => {
  if (!ENV.aiRecommendationApiUrl) {
    return [];
  }

  const response = await axios.post(`${ENV.aiRecommendationApiUrl}/recommend`, {
    userId,
  });

  return response.data.books as BookListing[];
};
