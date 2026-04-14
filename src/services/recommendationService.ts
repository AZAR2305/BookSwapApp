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

  try {
    const response = await axios.post(`${ENV.aiRecommendationApiUrl}/recommend`, {
      userId,
    });

    return response.data.books as BookListing[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('AI Recommendation API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error('Unexpected error in getBookRecommendations:', error);
    }
    // Return fallback books on error
    return fallbackBooks;
  }
};
