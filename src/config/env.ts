export const ENV = {
  firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
  firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
  stripeSecretApiUrl: process.env.EXPO_PUBLIC_STRIPE_SECRET_API_URL ?? '',
  aiRecommendationApiUrl: process.env.EXPO_PUBLIC_AI_RECOMMENDER_API_URL ?? '',
  firebaseConfigJson: process.env.EXPO_PUBLIC_FIREBASE_CONFIG_JSON ?? '',
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const normalizeEnvJson = (value: string) => value.trim().replace(/;\s*$/, '');

export const parsedFirebaseConfig = (() => {
  if (!ENV.firebaseConfigJson) return null;

  try {
    const parsed = JSON.parse(normalizeEnvJson(ENV.firebaseConfigJson)) as {
      apiKey?: string;
      authDomain?: string;
      projectId?: string;
      storageBucket?: string;
      messagingSenderId?: string;
      appId?: string;
      measurementId?: string;
    };

    if (
      !isNonEmptyString(parsed.apiKey) ||
      !isNonEmptyString(parsed.projectId) ||
      !isNonEmptyString(parsed.appId)
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
})();

export const isFirebaseConfigured =
  isNonEmptyString(parsedFirebaseConfig?.apiKey ?? ENV.firebaseApiKey) &&
  isNonEmptyString(parsedFirebaseConfig?.projectId ?? ENV.firebaseProjectId) &&
  isNonEmptyString(parsedFirebaseConfig?.appId ?? ENV.firebaseAppId);
