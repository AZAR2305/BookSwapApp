import { ENV } from '@/src/config/env';
import type { BookListing } from '@/src/utils/types';

const buildBookContext = (book: BookListing) => {
  const description = book.description?.trim() || 'No description was provided in the listing.';

  return [
    `Title: ${book.title}`,
    `Author: ${book.author}`,
    `Price: $${book.price.toFixed(2)}`,
    `Condition: ${book.condition}`,
    `Seller: ${book.sellerName || 'Student seller'}`,
    `Description: ${description}`,
  ].join('\n');
};

const buildFallbackReply = (book: BookListing, question?: string) => {
  const base = `${book.title} by ${book.author} is listed for $${book.price.toFixed(2)} in ${book.condition} condition. ${book.description?.trim() || 'The listing does not include a description.'}`;

  if (question?.trim()) {
    return `I could not reach the assistant service, but based on the listing: ${base} You can ask about condition, class fit, or pricing.`;
  }

  return `Quick overview: ${base} Seller: ${book.sellerName || 'Student seller'}.`;
};

const extractGeminiText = (payload: {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}) => payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim() ?? '';

export const generateBookAssistantReply = async (book: BookListing, question?: string) => {
  if (!ENV.geminiApiKey) {
    return buildFallbackReply(book, question);
  }

  const prompt = question?.trim()
    ? [
        'You are a concise, helpful book marketplace assistant.',
        'Answer only from the listing details below.',
        'Do not invent facts or claim you inspected the physical book.',
        'Keep the answer under 120 words and focus on the buyer question.',
        `Buyer question: ${question.trim()}`,
        'Listing details:',
        buildBookContext(book),
      ].join('\n\n')
    : [
        'You are a concise, helpful book marketplace assistant.',
        'Create a short overview for a buyer based only on the listing details below.',
        'Include what the book is, what the condition and price suggest, and one useful follow-up question.',
        'Do not invent facts or claim you inspected the physical book.',
        'Keep the answer under 120 words.',
        'Listing details:',
        buildBookContext(book),
      ].join('\n\n');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${ENV.geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 180,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed with status ${response.status}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const reply = extractGeminiText(data);
    return reply || buildFallbackReply(book, question);
  } catch (error) {
    console.error('Book assistant request failed:', error);
    return buildFallbackReply(book, question);
  }
};