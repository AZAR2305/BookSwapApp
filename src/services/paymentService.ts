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

  const response = await axios.post(`${ENV.stripeSecretApiUrl}/checkout`, {
    amount: Math.round(amount * 100),
    currency,
    description,
  });

  return {
    success: response.data.success,
    transactionId: response.data.transactionId,
  };
};
