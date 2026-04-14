import axios from 'axios';
import { ENV } from '@/src/config/env';

interface PaymentInput {
  amount: number;
  currency?: string;
  description: string;
}

export const checkoutWithStripe = async ({
  amount,
  currency = 'usd',
  description,
}: PaymentInput): Promise<{ success: boolean; transactionId: string }> => {
  if (!ENV.stripeSecretApiUrl) {
    return {
      success: true,
      transactionId: `mock_${Date.now()}`,
    };
  }

  try {
    const response = await axios.post(`${ENV.stripeSecretApiUrl}/checkout`, {
      amount: Math.round(amount * 100),
      currency,
      description,
    });

    return {
      success: response.data.success,
      transactionId: response.data.transactionId,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Stripe Checkout Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(`Payment failed: ${error.response?.data?.message || error.message}`);
    } else {
      console.error('Unexpected error in checkoutWithStripe:', error);
      throw new Error('Payment processing failed');
    }
  }
};
