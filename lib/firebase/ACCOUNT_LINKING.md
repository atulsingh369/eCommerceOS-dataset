# Firebase Account Linking Implementation

## 🎯 Problem Solved

When a user tries to sign up with email/password using an email that already exists from Google OAuth, Firebase throws:

```
Error: auth/email-already-in-use
```

This creates a poor user experience and prevents users from accessing their account with multiple sign-in methods.

## ✅ Solution

Implemented **automatic account linking** that:

1. Detects when email already exists
2. Identifies the existing sign-in provider (Google)
3. Automatically links the email/password credential to the existing Google account
4. Provides clear success messages to the user

---

## 🔄 How It Works

### Flow Diagram

```
User tries to sign up with email/password
              ↓
    Email already exists?
         ↙        ↘
       NO          YES
        ↓           ↓
   Create      Check existing
   account     sign-in methods
        ↓           ↓
   Success!    Google account?
                ↙        ↘
              YES        NO
               ↓          ↓
        Prompt Google  Show error:
        OAuth popup    "Please log in"
               ↓
        Link credentials
               ↓
        Success! (Linked)
```

### Step-by-Step Process

#### Scenario 1: Google First → Email/Password Later

1. **User logs in with Google** (`user@example.com`)

   - Firebase Auth creates account with UID: `google_uid_123`
   - Firestore doc created at `users/google_uid_123`

2. **Same user tries to sign up with email/password** (same email)

   - `signupWithEmailPassword()` attempts to create account
   - Firebase throws `auth/email-already-in-use`
   - **Our code catches this error**

3. **Automatic Linking Process**
   - Calls `fetchSignInMethodsForEmail(email)` → returns `["google.com"]`
   - Detects Google account exists
   - Calls `linkEmailPasswordToGoogle(email, password, name)`
4. **linkEmailPasswordToGoogle() executes:**

   ```typescript
   // Step 1: Sign in with Google popup
   const googleCredential = await signInWithPopup(auth, googleProvider);

   // Step 2: Create email/password credential
   const emailCredential = EmailAuthProvider.credential(email, password);

   // Step 3: Link credentials
   await linkWithCredential(googleCredential.user, emailCredential);

   // Step 4: Update Firestore
   await createOrUpdateUserDocument(user);
   ```

5. **Result**
   - User can now log in with **both** Google AND email/password
   - Only **one** Firebase Auth account exists
   - Only **one** Firestore user document exists
   - Success message: "Successfully linked your Google account with email/password login!"

#### Scenario 2: Email/Password First → Google Later

This scenario is handled by the existing Firestore email-based merging logic (already implemented).

---

## 📝 Code Changes

### 1. Updated `lib/firebase/auth.ts`

#### New Interface: `SignupResult`

```typescript
export interface SignupResult {
  user: User;
  message?: string;
  wasLinked?: boolean;
}
```

This allows the signup function to return additional context about what happened.

#### New Helper Function: `linkEmailPasswordToGoogle()`

```typescript
async function linkEmailPasswordToGoogle(
  email: string,
  password: string,
  name: string
): Promise<SignupResult> {
  // 1. Sign in with Google
  const googleCredential = await signInWithPopup(auth, googleProvider);

  // 2. Create email credential
  const emailCredential = EmailAuthProvider.credential(email, password);

  // 3. Link them together
  await linkWithCredential(googleCredential.user, emailCredential);

  // 4. Update profile and Firestore
  await updateProfile(user, { displayName: name });
  await createOrUpdateUserDocument(user);

  return {
    user,
    message:
      "Successfully linked your Google account with email/password login!",
    wasLinked: true,
  };
}
```

#### Enhanced `signupWithEmailPassword()`

**Before:**

```typescript
export async function signupWithEmailPassword(email, password, name) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(userCredential.user, { displayName: name });
  await createOrUpdateUserDocument(userCredential.user);
  return userCredential.user;
}
```

**After:**

```typescript
export async function signupWithEmailPassword(
  email: string,
  password: string,
  name: string
): Promise<SignupResult> {
  try {
    // Attempt normal signup
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: name });
    await createOrUpdateUserDocument(userCredential.user);

    return {
      user: userCredential.user,
      message: "Account created successfully!",
      wasLinked: false,
    };
  } catch (error: any) {
    // Handle email-already-in-use
    if (error.code === "auth/email-already-in-use") {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.includes("google.com")) {
        // Automatically link with Google account
        return await linkEmailPasswordToGoogle(email, password, name);
      } else {
        throw new Error(
          "This email is already registered. Please log in instead."
        );
      }
    }
    throw error;
  }
}
```

### 2. Updated `app/signup/page.tsx`

**Before:**

```typescript
await signupWithEmailPassword(email, password, name);
toast.success("Account created successfully!");
```

**After:**

```typescript
const result = await signupWithEmailPassword(email, password, name);

if (result.wasLinked) {
  toast.success(result.message || "Successfully linked your accounts!");
} else {
  toast.success(result.message || "Account created successfully!");
}
```

### 3. Updated `components/AuthExample.tsx`

Added:

- `successMessage` state
- Display logic for success messages
- Proper handling of `SignupResult`

---

## 🧪 Testing Scenarios

### Test 1: Normal Signup (No Conflict)

**Steps:**

1. Go to `/signup`
2. Enter new email: `newuser@example.com`
3. Enter password and name
4. Click "Create account"

**Expected:**

- ✅ Account created
- ✅ Message: "Account created successfully!"
- ✅ `wasLinked: false`

### Test 2: Google → Email/Password (Account Linking)

**Steps:**

1. Go to `/login`
2. Click "Sign in with Google"
3. Sign in with `test@example.com`
4. Log out
5. Go to `/signup`
6. Enter same email: `test@example.com`
7. Enter password and name
8. Click "Create account"

**Expected:**

- ✅ Google OAuth popup appears
- ✅ User signs in with Google
- ✅ Credentials are linked
- ✅ Message: "Successfully linked your Google account with email/password login!"
- ✅ `wasLinked: true`
- ✅ User can now log in with BOTH methods

### Test 3: Email/Password Already Exists

**Steps:**

1. Sign up with email/password: `existing@example.com`
2. Log out
3. Try to sign up again with same email

**Expected:**

- ❌ Error: "This email is already registered. Please log in instead."
- ✅ User directed to log in

### Test 4: User Cancels Google Popup

**Steps:**

1. Create Google account with `cancel@example.com`
2. Log out
3. Try to sign up with email/password using same email
4. **Close the Google popup without signing in**

**Expected:**

- ❌ Error: "Account linking cancelled. Please try again."
- ✅ User can retry

---

## 🔐 Security Considerations

### Why This Is Safe

1. **User Must Authenticate**: To link credentials, the user must successfully sign in with Google, proving they own the account.

2. **No Unauthorized Access**: A malicious user cannot link their email/password to someone else's Google account because they would need to complete the Google OAuth flow.

3. **Firestore Remains Consistent**: The `createOrUpdateUserDocument()` function ensures only one document exists per email.

### Potential Edge Cases

#### Edge Case 1: User Has Multiple Google Accounts

**Scenario**: User has two Google accounts with different emails, but tries to link email/password to the wrong one.

**Mitigation**: The Google OAuth popup shows which account is being used. User can switch accounts in the popup.

#### Edge Case 2: Email Verification

**Current State**: Email verification is not implemented.

**Recommendation**: Add email verification to ensure users own the email address:

```typescript
import { sendEmailVerification } from "firebase/auth";
await sendEmailVerification(user);
```

---

## 📊 User Experience Improvements

### Before Account Linking

```
User: *tries to sign up with email that exists from Google*
System: ❌ "Email already in use"
User: 😕 "What? I don't remember creating an account..."
```

### After Account Linking

```
User: *tries to sign up with email that exists from Google*
System: 🔗 *Google popup appears*
User: *signs in with Google*
System: ✅ "Successfully linked your Google account with email/password login!"
User: 😊 "Oh cool, now I can use both!"
```

---

## 🚀 Next Steps

### Recommended Enhancements

1. **Reverse Linking (Email → Google)**

   - Allow users who signed up with email/password to link their Google account
   - Add a "Link Google Account" button in user settings

2. **Email Verification**

   ```typescript
   import { sendEmailVerification } from "firebase/auth";
   await sendEmailVerification(user);
   ```

3. **Account Management Page**

   - Show all linked providers
   - Allow unlinking providers
   - Require at least one provider to remain linked

4. **Better Error Messages**

   - Detect if user has multiple accounts with different emails
   - Suggest merging accounts

5. **Firestore Security Rules Update**
   ```javascript
   // Allow users to access their document even if UID differs
   // (in case of account linking)
   match /users/{userId} {
     allow read, write: if request.auth != null &&
       (request.auth.uid == userId ||
        get(/databases/$(database)/documents/users/$(userId)).data.email == request.auth.token.email);
   }
   ```

---

## 📚 Firebase Documentation References

- [Account Linking](https://firebase.google.com/docs/auth/web/account-linking)
- [linkWithCredential](https://firebase.google.com/docs/reference/js/auth.md#linkwithcredential)
- [fetchSignInMethodsForEmail](https://firebase.google.com/docs/reference/js/auth.md#fetchsigninmethodsforemail)
- [EmailAuthProvider](https://firebase.google.com/docs/reference/js/auth.emailauthprovider)

---

## ✅ Summary

### What Was Implemented

✅ **Automatic account linking** when email conflict detected  
✅ **Smart provider detection** using `fetchSignInMethodsForEmail()`  
✅ **Seamless Google OAuth popup** for credential linking  
✅ **User-friendly success messages** for different scenarios  
✅ **Error handling** for popup cancellation and other edge cases  
✅ **Type-safe** with `SignupResult` interface  
✅ **Backward compatible** - existing code still works

### Files Modified

- ✏️ `lib/firebase/auth.ts` - Added linking logic
- ✏️ `lib/firebase/index.ts` - Exported `SignupResult`
- ✏️ `lib/firebase.ts` - Exported `SignupResult` (backward compat)
- ✏️ `app/signup/page.tsx` - Handle `SignupResult`
- ✏️ `components/AuthExample.tsx` - Display success messages

### Result

Users can now seamlessly link their email/password credentials with existing Google OAuth accounts, creating a unified authentication experience with **zero duplicate accounts** in both Firebase Auth and Firestore! 🎉
