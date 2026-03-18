# Sahayata - Government Schemes Portal

A modern portal to help citizens find and apply for government schemes.

## Deployment Instructions

This project is built with React, Vite, and Firebase. It can be easily deployed to platforms like Vercel, Netlify, or Firebase Hosting.

### 1. Prerequisites

- Node.js (v18 or higher)
- A Firebase Project

### 2. Environment Variables

Create a `.env` file in the root directory (or set these in your deployment platform's dashboard):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_DATABASE_ID=(default)
```

### 3. Build and Deploy

#### Vercel

1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project in Vercel.
3. Vercel will automatically detect Vite and use the correct build settings.
4. Add the environment variables listed above.
5. Deploy!

#### Netlify

1. Push your code to a repository.
2. Connect the repository to Netlify.
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Add environment variables.
6. Deploy!

#### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
   - Select your project.
   - Public directory: `dist`
   - Configure as a single-page app: `Yes`
4. Build: `npm run build`
5. Deploy: `firebase deploy --only hosting`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
