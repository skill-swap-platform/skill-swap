# Skill Swap Platform 🔄 💡

### *"Exchange Skills, Grow Together"*

**Skill Swap** is an innovative digital platform designed to facilitate skill and knowledge exchange between individuals through a **skill-for-skill barter system**. The platform enables users to learn new skills (such as programming or languages) by sharing their own expertise—without any financial transactions.


## ✨ Key Features

Based on the platform’s **Information Architecture (IA)** and **UI/UX designs**:

* **Onboarding & Profile Setup:**
  A flexible registration flow that allows users to select **3–5 skills** they want to learn or offer.

* **Skill Discovery:**
  An advanced search and discovery engine to find skill providers, with filtering by category and difficulty level.

* **Swap Request System:**
  Send skill exchange requests or free session invitations, with the ability to specify preferred time slots and include an introductory message.

* **Real-time Chat & Scheduling:**
  An integrated chat system to coordinate session details and confirm schedules.

* **Sessions Management:**
  Dedicated interfaces for upcoming sessions, session summaries, and request management (accept / decline).

* **Gamification & Feedback:**
  A motivational system including **Skill Points**, **Badges** such as *“Consistency Champion”*, and a mutual rating system after each session.


## 🎨 Design System

The front-end was developed based on a defined visual identity to enhance trust and collaboration:

### Color Palette

* **Primary Blue:** `#3E8FCC` (used for core elements and branding)
* **Skill Orange:** `#FF9F00` (represents growth and creativity)
* **Success:** `#16A34A` | **Error:** `#DC2626` | **Warning:** `#F59E0B`
* **Neutrals:** Backgrounds starting from `#F9FAFB` with white cards `#FFFFFF`

### Typography

* **Titles & Headings:** **Poppins** 
* **UI & Body Text:** **Inter** 


## 🏗️ Site Structure (Site Map)

The platform follows a clear hierarchical flow:

1. **Landing & Auth:** Landing pages, authentication, and onboarding
2. **Explore:** Skill and provider discovery
3. **Exchange & Chat:** Request handling and real-time messaging
4. **Dashboard:** User dashboard (sessions, points, badges)
5. **Support:** Help center and dispute reporting


## 🛠️ Tech Stack



* **Framework:** React.js 
* **Styling:** Tailwind CSS

## State Management & Data Fetching

The platform uses a hybrid approach for state management to ensure performance, scalability, and clean separation of concerns:

**Zustand:**

Used for managing simple and local UI states, such as:

* Opening and closing menus and modals

* Temporary profile data

* UI preferences and lightweight global states

**TanStack Query (React Query):**

Used for handling server-side state and data fetched from the database, including:

* Skills data

* Sessions and exchange requests

* Caching, background refetching, and data synchronization
