# BookSwap Mobile App

BookSwap is a student marketplace mobile app for buying and selling used books.

## Tech Stack

- React Native + Expo (Expo Go compatible)
- Firebase Auth + Firestore + Storage
- React Navigation (Stack + Tabs)
- Zustand (Auth, Cart, Theme, Wishlist)
- Expo Image Picker
- Expo Notifications
- Axios (Stripe/AI API integrations)

## Project Structure

```txt
src/
   screens/
      Auth/
      Home/
      Book/
      Cart/
      Profile/
      Admin/
   components/
   navigation/
   services/
   config/
   utils/
   hooks/
   store/
```

## Setup

1. Install packages:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Add Firebase keys in `.env`.
   You can either:
   - Fill individual `EXPO_PUBLIC_FIREBASE_*` keys, or
   - Set `EXPO_PUBLIC_FIREBASE_CONFIG_JSON` with your Firebase web config JSON.

4. Add `EXPO_PUBLIC_GEMINI_API_KEY` if you want the chat assistant to summarize the current book listing.

5. **Deploy Firebase Security Rules** (required):

   Deploy Firestore and Storage rules to your Firebase project:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules,storage
   ```

   This deploys `firestore.rules` and `storage.rules` from the project root.

5. Run app in Expo Go:

```bash
npx expo start
```

## Web Preview

Do not use `npx expo start --web` if your site has a strict CSP. Expo's web dev server uses tooling that can trigger `eval`.

Use the production web bundle instead:

```bash
npm run web:prod
```

That builds the static web output and serves `dist/` as a single-page app on port 3000 without the dev-router runtime.

## Stripe in Expo Go

This app uses a Stripe-compatible checkout service via Axios. In Expo Go, checkout is mocked if `EXPO_PUBLIC_STRIPE_SECRET_API_URL` is empty.

## Implemented Modules

- Authentication: register, login, logout, persistence, validation
- Book listing: upload image + metadata with Firebase Storage/Firestore
- Browse/search/filter: realtime book feed, search by title/author, price + condition filters
- Cart + checkout: add/remove cart items, checkout flow, order save in Firestore
- Rating/reviews: submit post-purchase reviews and seller rating summary
- Profile: uploaded books, purchases, ratings, edit profile
- Admin: role-based dashboard, users list, block/unblock, report moderation
- Notifications: push registration + local notifications for new books/orders
- Chat: realtime buyer-seller messaging with Firestore threads/messages
- Chat: realtime buyer-seller messaging with Firestore threads/messages plus a Gemini-powered book assistant panel
- Bonus: wishlist, dark mode, basic pagination, AI recommendation hook (requires API URL)

## Firestore Schema (Sample)

```txt
users/{userId}
   id, email, displayName, role, blocked, campus, bio, ratingCount, ratingTotal

books/{bookId}
   title, author, price, condition, imageUrl, description, userId, sellerName,
   status(active|sold|removed), reported, createdAt

orders/{orderId}
   buyerId, sellerId, bookId, total, paymentStatus, createdAt

reviews/{reviewId}
   orderId, sellerId, buyerId, rating, comment, createdAt

threads/{threadId}
   participants[], bookId, lastMessage, updatedAt

threads/{threadId}/messages/{messageId}
   senderId, text, createdAt
```

## Notes

- Ensure Firestore indexes for compound queries (`where + orderBy`) as prompted in Firebase console.
- Keep production secrets out of source control.
- If Firestore is returning `permission-denied`, deploy rules that match the app's collections. A starter template is in [firestore.rules](firestore.rules).
# BookSwapApp
