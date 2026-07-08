# Security

## Firebase / Google Cloud project

Project ID: `ardent-fuze-7tn3v`

### 1. Rotate the exposed Web API key

The previous Firebase Web API key was committed to `src/firebase.ts` in the
repository history and must be treated as leaked.

Steps:

1. Open Google Cloud Console -> **APIs & Services -> Credentials** for
   project `ardent-fuze-7tn3v`.
2. Find the **Browser key (auto created by Firebase)** used by the web
   app. Click **Regenerate key**.
3. Copy the new key into `.env.local` as `VITE_FIREBASE_API_KEY`. The
   file is gitignored (`.env*` in `.gitignore`).
4. Update any deployed environments (Cloud Run, Firebase Hosting,
   AI Studio Secrets panel) with the new key.

### 2. Restrict the new key

While editing the credential in the console:

- **Application restrictions -> HTTP referrers**
  - Add every domain the app is served from, e.g.
    - `https://ardent-fuze-7tn3v.web.app/*`
    - `https://ardent-fuze-7tn3v.firebaseapp.com/*`
    - Your production custom domain, e.g. `https://kitchenlab.example.com/*`
    - `http://localhost:3000/*` for local dev
- **API restrictions -> Restrict key**
  - Allow only the APIs the client actually needs:
    - Identity Toolkit API (Firebase Auth)
    - Cloud Firestore API
    - Firebase Installations API
    - Token Service API
    - Firebase Management API (only if used from the web app)
- Save.

### 3. Firestore rules

`firestore.rules` now requires `request.auth != null` for all reads and
writes. Deploy from the console or CLI:

```
firebase deploy --only firestore:rules
```

Next step (not done yet): add a whitelist of allowed workshop UIDs, or
per-document ownership fields, so that any signed-in Google account
can't read the whole workshop database.

### 4. Auth

Sign-in uses Google via Firebase Auth. Enable the Google provider in
**Firebase Console -> Authentication -> Sign-in method** and add the
production domain to the **Authorized domains** list.

### Notes on the leaked-key blast radius

A Firebase Web API key is not a secret by itself; it identifies the
project. Combined with the previous `allow read, write: if true`
Firestore rule, however, anyone who fetched the repo could read and
write the entire database. Between rotating the key, restricting it,
locking down the rules, and requiring auth, the exposure is closed.
Consider auditing Firestore data for unexpected documents written
during the open window.
