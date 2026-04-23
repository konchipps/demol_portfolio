# Portfolio Firebase Dashboard

A dark, premium React portfolio built with Vite, Tailwind CSS, Framer Motion, React Router, and Firebase. It includes a protected admin dashboard for editing hero content, services, projects, resume entries, testimonials, client logos, incoming contact messages, and section visibility in real time.

## Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- React Router
- Firebase Authentication
- Firestore
- Firebase Storage
- Firebase Hosting

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```powershell
Copy-Item .env.example .env.local
```

3. Fill in your Firebase project values in `.env.local`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_ENABLE_STORAGE_UPLOADS=false
```

4. Start the app:

```bash
npm run dev
```

## Firebase setup guide

### 1. Create the Firebase project

- Create a new Firebase project in the Firebase console.
- Add a Web App.
- Enable Authentication, Firestore Database, and Storage.
- This repo is already pointed at the `portfolio-demol` Firebase project through `.firebaserc`.

### 2. Enable Authentication

- Go to `Authentication > Sign-in method`.
- Enable `Email/Password`.
- Add your admin user under `Authentication > Users`.

### 3. Create the admin role document

After creating the auth user, add a Firestore document:

- Collection: `admins`
- Document ID: the authenticated user's `uid`

Example:

```json
{
  "email": "admin@example.com",
  "role": "admin"
}
```

This document is what unlocks the dashboard.

### 4. Publish security rules

- Deploy `firestore.rules`
- Deploy `storage.rules`
- Storage uploads are restricted to authenticated users who also have an `admins/{uid}` Firestore document.
- Leave `VITE_ENABLE_STORAGE_UPLOADS=false` until Firebase Storage has been initialized in the console and uploads are confirmed working.

### 5. Seed starter content

After signing into `/admin`, click **Load demo content** on the dashboard overview page. That writes starter hero, services, resume, testimonials, and clients to Firestore.

## Example Firestore structure

```text
admins/
  {uid}

siteContent/
  hero
  resume
  settings

services/
  service-brand-systems
  service-product-design
  service-frontend-builds

projects/
  project-luxe-commerce
  project-booking-system

testimonials/
  testimonial-1
  testimonial-2

clients/
  client-1
  client-2

messages/
  auto-id
```

### `siteContent/hero`

```json
{
  "name": "Aaron Demol",
  "title": "Product Designer & Frontend Engineer",
  "description": "Portfolio intro copy",
  "location": "New York, United States",
  "email": "aarondemol2004@gmail.com",
  "resumeUrl": "/aaron-demol-cv.pdf",
  "profileImageUrl": "https://...",
  "socialLinks": [
    { "label": "GitHub", "url": "https://github.com/..." }
  ],
  "stats": [
    { "label": "Years Experience", "value": "8+" }
  ]
}
```

### `siteContent/resume`

```json
{
  "experience": [
    {
      "id": "exp-1",
      "title": "Lead Product Designer",
      "organization": "Northstar Studio",
      "period": "2022 - Present",
      "location": "Remote",
      "description": "Guided UI strategy..."
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "title": "BFA, Interactive Design",
      "organization": "RISD",
      "period": "2012 - 2016",
      "location": "Providence, RI",
      "description": "Focused on digital product design..."
    }
  ]
}
```

### `siteContent/settings`

```json
{
  "sections": {
    "hero": true,
    "services": true,
    "resume": true,
    "projects": true,
    "testimonials": true,
    "clients": true,
    "contact": true
  }
}
```

### `services/{id}`

```json
{
  "icon": "LayoutDashboard",
  "title": "Product Design",
  "description": "End-to-end UX/UI...",
  "order": 2
}
```

### `projects/{id}`

```json
{
  "title": "Luxe Commerce Dashboard",
  "category": "E-commerce",
  "status": "Case Study",
  "description": "A polished storefront and admin analytics concept.",
  "imageUrl": "https://...",
  "techStack": ["React", "Firebase", "Tailwind"],
  "liveUrl": "https://...",
  "repoUrl": "https://github.com/...",
  "order": 1
}
```

### `testimonials/{id}`

```json
{
  "name": "Maya Chen",
  "role": "Founder, Arcform",
  "rating": 5,
  "feedback": "Jordan brought a rare mix of product clarity and visual taste.",
  "order": 1
}
```

### `clients/{id}`

```json
{
  "name": "Stripe",
  "websiteUrl": "https://stripe.com",
  "logoUrl": "https://...",
  "order": 1
}
```

### `messages/{id}`

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "message": "Interested in a redesign project.",
  "createdAt": "serverTimestamp()",
  "emailNotification": {
    "provider": "FormSubmit",
    "status": "submitted"
  }
}
```

## Deployment

Build the app:

```bash
npm run build
```

Then deploy to Firebase Hosting:

```bash
firebase deploy
```

## Automatic Gmail notifications without Blaze

The contact form now does two things on submit:

1. saves the message to Firestore for the `/admin` inbox
2. sends the same submission to `aarondemol2004@gmail.com` through FormSubmit's AJAX endpoint

This avoids Firebase Functions and works on the Spark plan.

### Important first step

FormSubmit requires a one-time email confirmation for the destination inbox. Their official docs say the first submission triggers an activation email that you need to confirm.

Sources:
- [FormSubmit homepage](https://formsubmit.co/)
- [FormSubmit documentation](https://formsubmit.co/documentation)
- [FormSubmit AJAX documentation](https://formsubmit.co/ajax-documentation)

## Notes

- Public sections subscribe in real time with Firestore snapshot listeners.
- Contact form submissions are stored in `messages`.
- Image uploads in the admin dashboard go through Firebase Storage.
- The app will still render demo content before Firebase is configured, so the UI is easy to preview locally.
