# Genesi - Fertility Wellness Platform

A fertility wellness platform for Zimbabwean women combining faith, nutrition, lifestyle, and medical awareness.

---

## Table of Contents
1. [New Features](#new-features)
2. [Project Structure](#project-structure)
3. [Setup Commands](#setup-commands)
4. [Running the App Locally](#running-the-app-locally)
5. [Setting Up Supabase](#setting-up-supabase)
6. [Deployment](#deployment)

---

## New Features

### Authentication System
- User registration with email/password
- Secure login/logout
- Profile management
- **Data Deletion**: Users can permanently delete their account and all associated data

### Protected Features (Login Required)
- **Fertility Log**: Daily tracking with summary and trends
- **Ovulation Tracker**: Calendar-based tracking with predictions

### Fertility Log Features
- Daily mood tracking (5 levels)
- Flow level tracking
- Cervical mucus monitoring
- Symptom checklist
- Basal temperature logging
- Quick actions (intimacy, medication)
- **Summary View**: 
  - Total logs count
  - Period days tracked
  - High fertility days
  - Most common mood
  - Weekly overview chart
  - Top symptoms
  - Recent logs table

### Ovulation Tracker Features
- Monthly calendar view
- Period tracking
- Cervical mucus logging
- Basal temperature tracking
- Ovulation test results
- **Predictions**:
  - Next period date
  - Predicted ovulation date
  - Fertile window
- Visual indicators on calendar

### Meal Plans
- 5 different meal plans based on fertility concerns:
  - General Fertility Boost
  - Ovulation Support
  - Hormone Balance
  - Anti-Inflammatory (for fibroids)
  - IVF Preparation
- Each plan includes Sunday-Sunday schedule
- Breakfast, lunch, dinner, and snacks
- Zimbabwean foods featured

### Personalized Fertility Check
- Age-based advice (35+, 38+)
- Trying duration advice (6-12 months, 1+ year)
- BMI-based recommendations
- Condition-specific meal plan recommendation

---

## Project Structure

```
genesi/
├── public/                 
│   └── vite.svg           
│
├── src/                   
│   ├── assets/           
│   │   ├── logo.png     
│   │   └── lotus.png    
│   │
│   ├── components/       
│   │   ├── Navbar.jsx   
│   │   ├── Footer.jsx   
│   │   └── ProtectedRoute.jsx  ← NEW: Route protection
│   │
│   ├── contexts/         ← NEW: Auth context
│   │   └── AuthContext.jsx
│   │
│   ├── data/             ← NEW: Meal plans data
│   │   └── mealPlans.js
│   │
│   ├── pages/            
│   │   ├── Home.jsx     
│   │   ├── FertilityCheck.jsx  ← Updated with personalization
│   │   ├── FertilityLog.jsx    ← Updated with auth & summary
│   │   ├── Education.jsx      
│   │   ├── Results.jsx        ← Updated with meal plan recommendation
│   │   ├── Login.jsx          ← NEW
│   │   ├── Signup.jsx         ← NEW
│   │   ├── Profile.jsx        ← NEW: User profile & data deletion
│   │   ├── MealPlans.jsx      ← NEW
│   │   └── OvulationTracker.jsx  ← NEW
│   │
│   ├── utils/            
│   │   └── supabase.js   ← NEW: Supabase client
│   │
│   ├── App.jsx           
│   ├── main.jsx          
│   └── index.css         
│
├── supabase/
│   └── schema.sql        ← Updated with new tables
│
├── index.html           
├── package.json         
├── tailwind.config.js   
├── vite.config.js       
├── .env.example         
├── .gitignore           
└── README.md            
```

---

## Setup Commands

### Step 1: Open Terminal on Your Mac

1. Press `Cmd + Space` on your keyboard
2. Type "Terminal"
3. Press Enter

### Step 2: Navigate to Your Project Folder

```bash
# Go to your Documents folder
cd ~/Documents

# Create a new folder for your project
mkdir genesi-project

# Go into that folder
cd genesi-project
```

### Step 3: Extract the Zip File

Double-click the `genesi-project.zip` file to extract it, or use:
```bash
unzip genesi-project.zip
```

### Step 4: Install Dependencies

```bash
# Install all the tools the project needs
npm install
```

---

## Running the App Locally

### Start the Development Server

```bash
npm run dev
```

After running this, you'll see:
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Open in Browser

1. Open your web browser (Chrome, Safari, Firefox)
2. Type: `http://localhost:5173/`
3. Press Enter

### Stop the Server

Press `Ctrl + C` in the terminal, then type `y` and press Enter.

---

## Setting Up Supabase

### Step 1: Create a Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with your email or GitHub
4. Verify your email

### Step 2: Create a New Project

1. Click "New Project"
2. Give it a name: `genesi`
3. Choose a region close to you
4. Create a strong database password (save this!)
5. Click "Create new project"

Wait 2-3 minutes for your project to be created.

### Step 3: Get Your API Keys

1. Once your project is ready, click on the project name
2. On the left sidebar, click "Project Settings" (gear icon)
3. Click "API" in the submenu
4. Copy these TWO values:
   - **Project URL** (looks like: `https://xxxxxxxx.supabase.co`)
   - **anon/public** key (long string)

### Step 4: Run the Schema SQL

1. In Supabase, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Open the `supabase/schema.sql` file from your project
4. Copy ALL the content
5. Paste it into the SQL Editor
6. Click "Run"

This creates tables for:
- User profiles
- Fertility check results
- Daily fertility logs
- Ovulation logs
- Meal plans
- Educational articles
- Cycle predictions

### Step 5: Connect Your App to Supabase

Create a file called `.env` in your project root:

```bash
touch .env
```

Open `.env` and add:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual values from Step 3.

---

## Deployment

### Building for Production

```bash
npm run build
```

This creates a `dist/` folder with all the files needed for your website.

### Deploy to Netlify

**Option A: Drag and Drop**
1. Go to https://netlify.com
2. Sign up for a free account
3. Drag your `dist/` folder to the Netlify dashboard
4. Your site is live!

**Option B: Connect to GitHub**
1. Push your code to GitHub
2. In Netlify, click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select your genesi repository
5. Click "Deploy site"

---

## Data Deletion (GDPR Compliance)

Users can delete their account and all associated data:

1. Go to Profile page
2. Scroll to "Account Actions"
3. Click "Delete Account"
4. Type "DELETE" to confirm
5. All data is permanently removed

---

## Common Issues

### "npm: command not found"

Install Node.js:
1. Go to https://nodejs.org
2. Download the LTS version
3. Install it
4. Restart your terminal

### "Port 5173 is already in use"

```bash
npm run dev -- --port 3000
```

### "Cannot find module"

```bash
npm install
```

---

## Need Help?

- **React docs**: https://react.dev
- **Tailwind docs**: https://tailwindcss.com
- **Supabase docs**: https://supabase.com/docs
- **Vite docs**: https://vitejs.dev

---

Made with love for Zimbabwean women on their fertility journey.
