<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# BuildCore-OS

This repository contains everything you need to run your app locally.

## Setup Instructions

### Step 1: Get a Google AI Studio Account & API Key
Before running the code, you need access to Google's AI platform:
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in using any standard Google or Google Workspace account.
3. Click the **Get API key** button in the top left corner.
4. Click **Create API key** and copy the generated key.

### Step 2: Run Locally

**Prerequisites:** Node.js

1. **Install dependencies:**
   Run `npm install` in your terminal.
2. **Set your API Key:**
   Create a file named `.env.local` in the main folder and add your Gemini API key inside it like this:
   ```text
   GEMINI_API_KEY=your_actual_api_key_here
