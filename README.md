# Skill Swap

Skill Swap is a web platform for exchanging skills between users through session-based learning. Users can discover skills, send swap requests, schedule sessions, and track progress through points and badges.

## What Is Skill Swap Platform?

Skill Swap Platform is a digital service that allows individuals to exchange skills and knowledge through direct skill-for-skill exchanges. Instead of monetary transactions, users trade expertise (for example: graphic design for guitar lessons, or coding tutoring for language practice).

## Platform Purpose

The platform enables:

- Skill Providers to list their skills, set availability, and connect with learners
- Skill Seekers to discover skills, request swaps, and schedule sessions
- Administrators to moderate content, manage disputes, and maintain platform quality

## Target Audience

Primary users:

- Skill Providers/Teachers: Ages 22-55, including professionals, hobbyists, and retirees with expertise to share
- Skill Seekers/Learners: Ages 18-60, including curious learners, career changers, and skill enthusiasts

## User Roles

| Role | Main Goal | Key Actions |
| --- | --- | --- |
| Learner (Skill Seeker) | Learn new skills through exchange sessions | Search skills, send swap requests, schedule sessions, leave feedback |
| Provider (Skill Teacher) | Share expertise and receive other skills in return | Create/manage skill offerings, set availability, accept/decline requests, run sessions |
| Admin | Keep platform quality and safety | Moderate content, handle disputes, manage users/sessions/swaps, monitor platform activity |

## 🧩 Features

- Authentication flows: register, email verification, login, forgot/reset password
- Onboarding and profile setup
- Skill discovery and provider exploration
- Swap request lifecycle (send, accept, decline, cancel)
- Session management and session feedback
- Gamification system (points, badges, achievements)
- Admin area for users, sessions, swaps, badges, and audit logs

## 🛠 Tech Stack

- React 19 + TypeScript
- Vite (Rolldown Vite)
- React Router
- TanStack Query
- Zustand
- Axios
- Tailwind CSS + MUI

## 🎨 Design System

### Core Colors

- `Primary`:
  `#3272A3` (default), `#3E8FCC` (light), `#2F71A3` (dark)
- `Text`:
  `#0C0D0F` (primary), `#666666` (secondary), `#9CA3AF` (disabled)
- `Neutral`:
  `#F9FAFB` (background), `#F7FAFF` (background2), `#FFFFFF` (card/background), `#E5E7EB` (border)
- `Status`:
  `#16A34A` (success), `#FFA412` / `#F59E0B` (warning)

### Typography

- `Outfit` is used as the main body font in `src/index.css`
- `Inter` and `Poppins` are configured in Tailwind (`fontFamily.sans`, `fontFamily.poppins`)

## 🚀 Getting Started

### Prerequisites

- Node.js (recommended: latest LTS)
- npm

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

App runs by default on:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Environment Configuration

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-api-url.com
```

Notes:

- `src/services/api.ts` uses `VITE_API_BASE_URL` (with a fallback URL).
- Most API calls in the app use `src/api/axiosInstance.ts`, where `API_BASE_URL` is currently hardcoded.
- If you need a different backend URL, update both places to keep behavior consistent.

## 📁 Project Structure

```text
src/
  api/          # Axios instance + API service modules
  services/     # Domain services used by features/pages
  pages/        # Route-level pages
  components/   # Reusable UI components
  hooks/        # Custom React hooks
  routes/       # Route config and guards
  store/        # Zustand stores
  types/        # Shared TypeScript types
```

## Main Scripts

- `npm run dev` - Start development server
- `npm run build` - Type-check and build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
