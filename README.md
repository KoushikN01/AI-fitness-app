🧠💪 AI Fitness Coach App

Your personal AI-powered fitness assistant built with Next.js — helping you get customized workout plans, diet plans, voice guidance, and AI-generated visuals.

🚀 Overview

AI Fitness Coach is a smart fitness companion that creates highly personalized fitness and diet plans using LLMs like OpenAI, Gemini, Claude, or HuggingFace.
With voice output and AI-generated images, the app provides a more immersive and interactive fitness experience.

✨ Features
🧍 User Profile Input

Users can enter important details to personalize their plan:

Name, Age, Gender

Height & Weight

Fitness Goal (Weight Loss, Muscle Gain, etc.)

Fitness Level (Beginner / Intermediate / Advanced)

Workout Location (Home / Gym / Outdoor)

Dietary Preference (Veg / Non-Veg / Vegan / Keto)

Optional: Medical history, stress level, sleep cycle, etc.

🧠 AI-Powered Plan Generation

The heart of the app uses an LLM to generate:

🏋️ Workout Plan

Daily routine with exercises

Sets, reps, rest time

Home / Gym–based variations

🥗 Diet Plan

Breakfast, lunch, dinner, snack suggestions

Balanced meal planning tailored to the user's preferences and goals

💬 AI Tips & Motivation

Posture correction tips

Lifestyle advice

Motivational quotes

🔧 Prompt Engineering:
All plans are generated dynamically using AI — no hardcoded templates.

🔊 Voice Features

Using ElevenLabs (or any TTS API):

Read My Plan: App reads the workout or diet plan aloud

Choose what to listen to: Workout or Diet

🖼️ AI Image Generation

When users click an exercise or food item, the app generates an AI image using Nano Banana, Replicate, OpenAI Images API, or other free image models.

Examples:

“Barbell Squat” → realistic workout image

“Grilled Chicken Salad” → appetizing food-style image

📦 Export & Extra Goodies

📄 Export plan as PDF

🌗 Dark & Light mode

💾 Save plan locally or using Supabase

🔁 One-click Regenerate Plan

⚡ Smooth animations via Framer Motion / GSAP

💬 Daily AI-powered Motivation Quote

🛠️ Tech Stack
Category	Tools
Frontend	Next.js (Latest) / React.js
Styling	Tailwind CSS, Shadcn UI, or Chakra UI
AI APIs	OpenAI, Gemini, Claude, XAi
Voice	ElevenLabs (TTS)
Image Generation	Gemini Nano Banana, OpenAI Images API, Replicate
Deployment	Vercel / Netlify
📁 Project Structure (Sample)
src/
 ├── app/
 │    ├── page.tsx        # Main form and UI
 │    ├── results/        # Workout & diet plan display
 │    ├── api/
 │         ├── generate/  # LLM generation endpoint
 │         ├── voice/     # TTS handling
 │         └── image/     # Image generation
 ├── components/
 │    ├── form/
 │    ├── cards/
 │    ├── layout/
 ├── utils/               # Prompt engineering & helpers

🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/your-username/ai-fitness-coach.git
cd ai-fitness-coach

2️⃣ Install dependencies
npm install

3️⃣ Add your environment variables

Create a .env.local file:

OPENAI_API_KEY=your_key
GEMINI_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
REPLICATE_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=optional
NEXT_PUBLIC_SUPABASE_KEY=optional

4️⃣ Run the app
npm run dev


Your app is now live at http://localhost:3000

🧩 Future Improvements

User account system (Auth)

Weekly progress tracking

AI form validation

Wearable device integration

🤝 Contributing

Contributions are welcome!
Feel free to open issues or submit PRs.

⭐ Support

If you like this project, don’t forget to star the repo on GitHub!



# Fitness Plan Generator

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/venkatkaushik1999-2140s-projects/v0-fitness-plan-generator)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/gI8KFfgdnA4)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/venkatkaushik1999-2140s-projects/v0-fitness-plan-generator](https://vercel.com/venkatkaushik1999-2140s-projects/v0-fitness-plan-generator)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/gI8KFfgdnA4](https://v0.app/chat/gI8KFfgdnA4)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
