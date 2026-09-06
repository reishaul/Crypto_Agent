# Crypto Dashboard & AI Assistant

A full-stack, crypto-focused dashboard and AI assistant application designed to deliver real-time data, market insights, and interactive components.

## 🏗️ System Architecture

The application adopts a modern, decoupled architecture separating the client-side presentation layer from the server-side logic and static asset hosting:

* **Frontend:** Built with **React** and **TypeScript**, bundled via Vite, and deployed globally on **Vercel**. It provides a responsive UI featuring crypto analytics, live feeds, and dedicated interactive components (such as `CryptoMeme.tsx`).
* **Backend:** Developed using **Node.js** and **Express**, hosted on **Render**. It serves as a centralized API gateway exposing structured JSON endpoints (e.g., `/api/memes`) and securely serving static assets and media files.
* **Data Flow:** The frontend communicates with the backend via absolute URLs using environment variables (`VITE_API_URL`), ensuring robust error handling and asynchronous data fetching validation.

## 🚀 Key Features

* **Real-time Crypto Insights:** Dynamic dashboard displaying token metrics and analytics.
* **Interactive Crypto Meme Viewer:** Fetches and displays community memes dynamically from the backend with license attribution and robust error handling.
* **Decoupled Deployment:** Seamless separation between Vercel (Client) and Render (Server).

## 🤖 AI Tool Collaboration & Documentation

Throughout the development process, AI tools (such as ChatGPT and GitHub Copilot) were leveraged as interactive technical collaborators:
* **Architectural Design:** Structuring a clean client-server separation and resolving cross-origin/deployment routing challenges.
* **Debugging & Validation:** Tracing asynchronous API calls, fixing static asset path mappings, and resolving deployment routing errors.
* **Documentation:** Integrating GitHub Copilot for code completion, documentation writing, and maintaining clean TypeScript components.

## 🔮 Future Enhancement: Model Training & Feedback Pipeline (Conceptual)

To continuously improve the dashboard and tailor content to user preferences, a future MLOps pipeline is proposed:
* **Data Ingestion:** Store user interactions (such as likes, time spent, click counts, and content types) in structured database tables.
* **Dataset Export:** Export telemetry data into structured formats like CSV.
* **Machine Learning Modeling:** Train external models (starting with a baseline **Dummy Model** and scaling up to **Logistic Regression** or **CatBoost**) to predict user preferences and dynamically optimize content recommendations.