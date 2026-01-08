# Firebase Authentication & Firestore Integration

## Overview

This implementation provides a complete authentication and user management system using Firebase v10 modular SDK with Next.js 14 App Router.

## Key Features

✅ **Unified User Document Creation** - Automatically creates/updates Firestore user documents after ANY sign-in method  
✅ **Email-Based Account Merging** - Prevents duplicate users when same email is used across different auth providers  
✅ **Validation** - Ensures user documents are only created when both name and email exist  
✅ **Subcollections** - Automatically initializes `cart` and `orders` subcollections for new users  
✅ **Type-Safe** - Full TypeScript support with proper types  
✅ **Clean Architecture** - Modular structure with separation of concerns

---

## File Structure

```
lib/firebase/
├── config.ts       # Firebase initialization and exports
├── auth.ts         # Authentication functions
├── firestore.ts    # Firestore user document management
└── index.ts        # Barrel exports for clean imports

components/
├── GoogleSignInButton.tsx  # Styled Google OAuth button
└── AuthExample.tsx         # Complete example component
```

---

## How It Works

### 1. Account Merging Logic

The `createOrUpdateUserDocument` function implements smart merging:

1. **Email Check First**: Queries Firestore for existing user with the same email
2. **Merge if Found**: Updates the existing document instead of creating a new one
3. **Create if New**: Creates a new document under `users/{uid}` if email doesn't exist
4. **Subcollections**: Initializes `cart` and `orders` subcollections for new users

**Example Scenario:**

```
User signs up with email/password → Document created at users/abc123
Same user logs in with Google OAuth → Same document updated (no duplicate!)
```

### 2. Validation Rules

User documents are **only created** when:

- ✅ Email exists (`user.email`)
- ✅ Display name exists (`user.displayName`)

For email/password signup, we call `updateProfile()` before creating the document.  
For Google OAuth, the display name is automatically provided.

### 3. Firestore Document Structure

```typescript
users /
  { uid } /
  {
    uid: string, // Firebase Auth UID
    name: string, // User's display name
    email: string, // User's email
    provider: string, // "password" | "google.com" | etc.
    photoURL: string | null, // Profile photo (from OAuth)
    createdAt: Timestamp, // When document was created
    updatedAt: Timestamp, // Last update time
  };

cart / // Subcollection for cart items
  _placeholder; // Initial placeholder doc

orders / // Subcollection for orders
  _placeholder; // Initial placeholder doc
```

---

## Usage Examples

### Basic Import

```typescript
// Import everything you need
import {
  signupWithEmailPassword,
  loginWithEmailPassword,
  loginWithGoogle,
  logout,
} from "@/lib/firebase";
```

### Email/Password Signup

```typescript
import { signupWithEmailPassword } from "@/lib/firebase";

async function handleSignup() {
  try {
    const user = await signupWithEmailPassword(
      "user@example.com",
      "securePassword123",
      "John Doe"
    );
    console.log("User created:", user.uid);
    // User document automatically created in Firestore
  } catch (error) {
    console.error("Signup failed:", error);
  }
}
```

### Email/Password Login

```typescript
import { loginWithEmailPassword } from "@/lib/firebase";

async function handleLogin() {
  try {
    const user = await loginWithEmailPassword(
      "user@example.com",
      "securePassword123"
    );
    console.log("Logged in:", user.uid);
    // User document automatically updated
  } catch (error) {
    console.error("Login failed:", error);
  }
}
```

### Google OAuth Login

```typescript
import { loginWithGoogle } from "@/lib/firebase";

async function handleGoogleLogin() {
  try {
    const user = await loginWithGoogle();
    console.log("Logged in with Google:", user.uid);
    // User document automatically created/updated
  } catch (error) {
    console.error("Google login failed:", error);
  }
}
```

### Using the Google Sign-In Button Component

```typescript
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <GoogleSignInButton />
    </div>
  );
}
```

### Complete Auth Form (See AuthExample.tsx)

The `AuthExample.tsx` component provides a complete, production-ready authentication UI with:

- Email/password signup and login
- Google OAuth integration
- Form validation
- Error handling
- Loading states
- Responsive design

---

## Google Sign-In Button Design

The `GoogleSignInButton` component follows [Google's Brand Guidelines](https://developers.google.com/identity/branding-guidelines):

- ✅ Official Google logo (4-color SVG)
- ✅ Proper spacing and padding
- ✅ Correct color scheme (white background, gray border)
- ✅ Hover and focus states
- ✅ Loading state with spinner
- ✅ Accessible (ARIA labels)

---

## Migration from Old Code

If you have existing code using the old `lib/firebase.ts`:

**Before:**

```typescript
import { auth, db } from "@/lib/firebase";
```

**After:**

```typescript
import { auth, db } from "@/lib/firebase";
// Still works! The old file now re-exports from the new structure
```

---

## Security Considerations

### Firestore Security Rules

Update your `firestore.rules` to allow users to read/write their own documents:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Users can manage their own cart
      match /cart/{cartId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      // Users can manage their own orders
      match /orders/{orderId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Important Notes

⚠️ **Account Linking**: When a user signs in with Google using an email that already exists from email/password signup, the Firestore document is shared, but Firebase Auth treats them as separate authentication methods. Consider implementing [account linking](https://firebase.google.com/docs/auth/web/account-linking) for a complete solution.

⚠️ **Email Verification**: Consider adding email verification for email/password signups using `sendEmailVerification()`.

⚠️ **Password Reset**: Implement password reset using `sendPasswordResetEmail()`.

---

## Testing

### Test Scenario 1: Email/Password Signup

1. Sign up with email/password
2. Check Firestore - user document should exist at `users/{uid}`
3. Verify `cart` and `orders` subcollections exist

### Test Scenario 2: Google OAuth

1. Sign in with Google
2. Check Firestore - user document should exist
3. Verify name and email are populated from Google profile

### Test Scenario 3: Account Merging

1. Sign up with email/password (e.g., `test@example.com`)
2. Log out
3. Sign in with Google using the same email
4. Check Firestore - should be only ONE user document (not two)
5. Document should be updated with Google provider info

---

## Troubleshooting

### "Cannot create user document: Missing displayName"

**Cause**: Email/password signup didn't set displayName before calling `createOrUpdateUserDocument`

**Solution**: The `signupWithEmailPassword` function already handles this by calling `updateProfile()`. Make sure you're using the provided function.

### "Found existing user by email. Using document: xyz"

**This is normal!** It means the account merging is working correctly.

### Subcollections not appearing in Firestore Console

**This is normal!** Firestore doesn't show empty subcollections. The placeholder documents ensure they exist programmatically.

---

## Next Steps

1. ✅ Implement email verification
2. ✅ Add password reset functionality
3. ✅ Implement account linking for better UX
4. ✅ Add profile update functionality
5. ✅ Create protected routes using Firebase Auth state
6. ✅ Add cart and orders CRUD operations

---

## Support

For Firebase documentation:

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Next.js + Firebase Guide](https://firebase.google.com/docs/web/setup)
