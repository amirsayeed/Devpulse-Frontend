# 🚼 DevPulse Frontend

> Modern React frontend for DevPulse — an internal tech issue & feature tracker built with Next.js 16, TypeScript, and Tailwind CSS.

<!-- **Live Demo:** [https://devpulse-frontend.vercel.app](https://devpulse-frontend.vercel.app)

**Backend API:** [https://devpulse-sandy.vercel.app](https://devpulse-sandy.vercel.app) -->

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Next.js Concepts Used](#nextjs-concepts-used)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [How to Use](#how-to-use)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Git Commits](#git-commits)

---

## ✨ Features

### Core Functionality

- **User Authentication** — Sign up, login with email/password
- **Issue Management** — Create, read, update, delete issues with full CRUD operations
- **Real-time Filtering & Sorting** — Filter by type (bug/feature_request) and status (open/in_progress/resolved), sort by newest/oldest
- **Role-Based Access Control** — Two roles with distinct permissions:
  - **Contributor**: Create issues, update own open issues, view all issues
  - **Maintainer**: Full access — update any issue, delete issues, change status independently
- **Persistent Authentication** — JWT tokens stored in localStorage, auto-restored on page reload
- **Responsive Design** — Mobile-friendly UI with Tailwind CSS
- **Toast Notifications** — Real-time feedback for user actions (success/error)
- **Form Validation** — Frontend validation with detailed error messages

---

## 🛠️ Tech Stack

| Technology          | Purpose                         | Version |
| ------------------- | ------------------------------- | ------- |
| **Next.js**         | React framework with App Router | 16      |
| **React**           | UI library                      | 19      |
| **TypeScript**      | Type-safe JavaScript            | Latest  |
| **Tailwind CSS**    | Utility-first CSS framework     | Latest  |
| **Axios**           | HTTP client for API calls       | ^1.6.0  |
| **React Hot Toast** | Toast notifications             | Latest  |
| **Zod**             | Schema validation               | Latest  |

---

## 📚 Next.js Concepts Used

### 1. **App Router** (File-based Routing)

```
app/
├── layout.tsx          → Root layout with AuthProvider
├── page.tsx            → Home page (redirects based on auth)
├── auth/
│   ├── login/
│   │   └── page.tsx    → Login page
│   └── signup/
│       └── page.tsx    → Signup page
├── issues/
│   ├── page.tsx        → Issues list page
│   ├── create/
│   │   └── page.tsx    → Create issue form
│   └── [id]/
│       ├── page.tsx    → Issue detail page
│       └── edit/
│           └── page.tsx → Edit issue form
```

### 2. **Server & Client Components**

- **Server Components**: Root layout for metadata, providers
- **Client Components**: All pages with interactivity, hooks, state management

```typescript
"use client"; // Marks component as Client Component
```

### 3. **Dynamic Routes**

```typescript
// app/issues/[id]/page.tsx
const params = useParams();
const id = parseInt(params.id as string);
```

### 4. **Metadata & SEO**

```typescript
export const metadata: Metadata = {
  title: "DevPulse - Issue Tracker",
  description: "Track bugs and feature requests",
};
```

### 5. **Suspense for Dynamic Routes**

```typescript
<Suspense fallback={<Loading />}>
  <IssueDetailContent />
</Suspense>
```

Used to handle `useParams()` in dynamic routes without prerendering errors.

### 6. **Navigation & Routing**

```typescript
import Link from "next/link"; // Client-side navigation
import { useRouter } from "next/navigation"; // Programmatic navigation
```

### 7. **Environment Variables**

```typescript
process.env.NEXT_PUBLIC_API_URL; // Client-side (prefixed with NEXT_PUBLIC_)
process.env.NEXT_PUBLIC_APP_URL;
```

### 8. **Incremental Static Regeneration (ISR)** - Optional

```typescript
export const revalidate = 60; // Regenerate every 60 seconds
```

Could be used for public pages that don't require authentication.

---

## 📁 Project Structure

```
devpulse-frontend/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Home page (auth redirect)
│   ├── globals.css                # Global styles
│   ├── auth/
│   │   ├── login/page.tsx         # Login page
│   │   └── signup/page.tsx        # Signup page
│   └── issues/
│       ├── page.tsx               # Issues list with filters
│       ├── create/page.tsx        # Create issue form
│       └── [id]/
│           ├── page.tsx           # Issue detail page wrapper
│           ├── content.tsx        # Issue detail content
│           └── edit/
│               ├── page.tsx       # Edit issue wrapper
│               └── content.tsx    # Edit issue content
├── components/
│   └── AuthProvider.tsx           # Auth context provider
├── lib/
│   ├── api.ts                     # Axios API client
│   ├── types.ts                   # TypeScript interfaces
│   └── constants.ts               # Constants & labels
├── hooks/
│   ├── useAuth.ts                 # Authentication hook
│   └── useIssues.ts               # Issues data hook
├── .env.local                     # Local environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- DevPulse backend running (see backend README)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/devpulse-frontend.git
cd devpulse-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Create `.env.local` file in project root:

```bash
cp .env.example .env.local  # If .env.example exists
```

Or manually create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run Development Server

```bash
npm run dev
```

Application starts at `http://localhost:3000`

### Step 5: Test Login

Use test credentials:

```
Email: admin@devpulse.com
Password: adminPass789
Role: maintainer
```

Or create a new account via signup.

---

## 🔐 Environment Variables

| Variable              | Description     | Example                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL    | `http://localhost:3000` |

**Note:** `NEXT_PUBLIC_` prefix makes variables accessible in browser. Never put secrets here.

---

## 📖 How to Use

### 1. **Authentication**

- **Signup**: Create new account with name, email, password, role
- **Login**: Sign in with email and password
- **Logout**: Click logout button in any page header
- **Session**: Automatically restored from localStorage on page reload

### 2. **Create Issue**

1. Go to `/issues`
2. Click "+ Create Issue"
3. Fill form:
   - Title (max 150 characters)
   - Description (min 20 characters)
   - Type (bug or feature_request)
4. Click "Create Issue"

### 3. **View Issues**

1. Go to `/issues`
2. See all issues in card format
3. Use filters:
   - **Sort**: Newest / Oldest
   - **Type**: Bug / Feature Request / All
   - **Status**: Open / In Progress / Resolved / All

### 4. **View Issue Details**

1. Click "View" on any issue card
2. See full details: title, description, reporter, timestamps
3. Action buttons (based on permissions):
   - Contributors: Edit own open issues
   - Maintainers: Edit any issue, change status, delete

### 5. **Edit Issue**

1. From issue detail page, click "Edit Issue" or "Update Status"
2. Modify title, description, type, status (maintainers only)
3. Click "Save Changes"

### 6. **Delete Issue** (Maintainers Only)

1. From issue detail page, click "Delete Issue"
2. Confirm in modal
3. Issue removed from system

---

## 🔗 API Integration

### Authentication API

**Login**

```
POST /api/auth/login
Body: { email, password }
Returns: { token, user }
```

**Signup**

```
POST /api/auth/signup
Body: { name, email, password, role }
Returns: { user }
```

### Issues API

**Get All Issues**

```
GET /api/issues?sort=newest&type=bug&status=open
Returns: { data: Issue[] }
```

**Get Single Issue**

```
GET /api/issues/:id
Returns: { data: Issue }
```

**Create Issue** (Authenticated)

```
POST /api/issues
Headers: Authorization: <JWT_TOKEN>
Body: { title, description, type }
Returns: { data: Issue }
```

**Update Issue** (Authenticated)

```
PATCH /api/issues/:id
Headers: Authorization: <JWT_TOKEN>
Body: { title, description, type, status }
Returns: { data: Issue }
```

**Delete Issue** (Maintainer Only)

```
DELETE /api/issues/:id
Headers: Authorization: <JWT_TOKEN>
Returns: { success: true }
```

### API Client Setup

All API calls go through `lib/api.ts`:

```typescript
// Automatically adds JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});
```

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import GitHub repository

3. **Configure Build Settings**
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Click "Settings" → "Environment Variables"
   - Add `NEXT_PUBLIC_API_URL` → Your deployed backend URL
   - Add `NEXT_PUBLIC_APP_URL` → Your Vercel app URL

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes

**Live URL:**

```
https://devpulse-frontend.vercel.app
```

---

## 📝 Git Commits

Progressive commits showing development:

```bash
1. Initial Next.js setup with TypeScript and Tailwind
2. Setup API client, types, and utilities
3. Create AuthProvider and authentication hooks
4. Implement login and signup pages
5. Create issues list page with filtering and sorting
6. Create issue detail page with Suspense
7. Implement create issue form with validation
8. Create edit issue page with role-based permissions
9. Add delete confirmation modal
10. Setup responsive layout and styling
11. Configure environment variables and deployment
12. Final testing and documentation
```

---

## 🔑 Key Implementation Details

### Authentication Flow

1. User submits login/signup form
2. Frontend calls backend API
3. Backend returns JWT token + user data
4. Frontend stores token in localStorage
5. Token automatically added to all API requests
6. On page reload, token restored from localStorage

### Data Fetching

- **Client-side fetching** via custom hooks (`useIssues`, `useAuth`)
- **Automatic token injection** via Axios interceptor
- **Error handling** with try-catch and toast notifications
- **Loading states** for better UX

### Role-Based Access Control

```typescript
// Contributors can only edit own open issues
const canEdit =
  user?.role === "maintainer" ||
  (user?.id === issue?.reporter.id && issue?.status === "open");

// Only maintainers can delete
const canDelete = user?.role === "maintainer";
```

### Form Validation

- Frontend validation before API call
- Backend validation on API side
- Specific error messages for user guidance
- Toast notifications for feedback

---

## 🧪 Testing

### Test Accounts

**Contributor Account:**

```
Email: john@devpulse.com
Password: securePassword123
Role: contributor
```

**Maintainer Account:**

```
Email: admin@devpulse.com
Password: adminPass789
Role: maintainer
```

### Test Flows

1. **Create Issue Flow**
   - Login → Go to issues → Click create → Fill form → Submit

2. **Edit Issue Flow** (Contributor)
   - Create an issue → Go to detail → Click edit → Update → Save

3. **Delete Issue Flow** (Maintainer)
   - Login as maintainer → View issue → Click delete → Confirm

4. **Filter & Sort**
   - Go to issues → Try filters (type, status) → Try sort (newest/oldest)

---

## 📚 Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open Pull Request

---

## 📄 License

This project is part of an academic assignment and is not licensed for external use.

---

## 📧 Support

For issues or questions, please create a GitHub issue or contact the project maintainer.

---

**Built with ❤️ using Next.js 16, React, TypeScript, and Tailwind CSS**
