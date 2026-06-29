# BuildCore-OS

Welcome to the project repository. Follow this step-by-step handover guide to get the project set up and running under your own account.

## Project Handover Guide

### What You'll Need to Set Up (Once Off)
* **A Google account (free)** — for Google AI Studio
* **A GitHub account (free)** — for accessing and owning the code
* **A Gemini API key (free)** — so the app runs under your account

All three are free. This setup will take about 15–20 minutes total.

---

### Step 1 — Create a GitHub Account
1. Go to [github.com](https://github.com)
2. Click **Sign up**.
3. Enter your email, create a password, and choose a username.
4. Verify your email address using the confirmation code sent by GitHub.
5. On the plan selection screen, choose **Free**.
6. You now have a working GitHub account.

### Step 2 — Fork the Repository
Forking creates your own personal copy of the project that you fully own, host, and can edit.
1. Make sure you are logged into your new GitHub account.
2. Go to this link: `https://github.com/mabznjozela/BuildCore-OS`
3. In the top-right corner of the page, click the **Fork** button.
4. On the next screen, leave everything as-is and click **Create fork**.
5. GitHub will copy the project into your account. The URL will now look like: `https://github.com/YOUR-USERNAME/BuildCore-OS`

### Step 3 — Create a Google Account (If needed)
*If you already have a Gmail address, you can skip this step.*
1. Go to [accounts.google.com/signup](https://accounts.google.com/signup)
2. Fill in your name, choose a Gmail address, and set a password.
3. Verify your details with your phone number or recovery email.

### Step 4 — Sign Into Google AI Studio
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in using your Google or Gmail account.
3. Accept the terms of service if prompted to reach the main dashboard.

### Step 5 — Get Your Free Gemini API Key
This ensures the app runs under your own resource allocation going forward.
1. While in AI Studio, click the **Get API key** button in the top-left/top-right area.
2. Click **Create API key**.
3. Select **Create API key in new project**.
4. Copy the long string of text generated and save it somewhere safe (like a notes app) for the next steps.

### Step 6 — Import Your Forked Project into AI Studio
1. On the AI Studio dashboard, click the **+** or **New project** button.
2. Select **Import from GitHub**.
3. AI Studio will ask to connect to your GitHub account—click **Authorize** and sign in with your GitHub credentials.
4. Once connected, look for your repository or paste your forked URL: `https://github.com/YOUR-USERNAME/BuildCore-OS`
5. Select it and confirm the import. AI Studio will pull the code directly into your workspace.

### Step 7 — Add Your API Key to the Project
The project requires your key to communicate with the AI models.
1. Inside your AI Studio project workspace, look for the **Project Settings** or **Environment Variables** panel (indicated by a gear icon or a sidebar tab).
2. Look for the variable named `GEMINI_API_KEY`.
3. Paste the key you copied in **Step 5** into the value input box and click **Save**.

---

## You're Done!
The project now completely lives in your personal GitHub account and your Google AI Studio workspace. You can edit it, run it, and build on it independently.
