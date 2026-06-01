# AnalystAI Dashboard

An end-to-end dashboard for uploading tabular datasets, exploring data, exporting results, and generating AI-driven analytics.

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [AI / Data Processing Flow](#ai--data-processing-flow)
- [Linting & Quality](#linting--quality)
- [Screens / Pages](#screens--pages)
- [Troubleshooting](#troubleshooting)

## Project Overview
**AnalystAI Dashboard** is a full-stack web application that:
1. Accepts dataset uploads (CSV/files).
2. Extracts and processes dataset metadata.
3. Lets users explore data, view analysis, group comparisons, and visualizations.
4. Uses AI services to generate insights/answers based on dataset context.

## Architecture

### Frontend
- React + Vite + Tailwind CSS
- UI components for:
  - Upload
  - Data exploration
  - Analytics views
  - AI query/analysis
  - Authentication (login/register)

### Backend
- Node.js + Express
- Responsibilities:
  - Authentication routes
  - Dataset upload handling
  - Dataset processing utilities
  - AI controller/services orchestration

## Features
- **User Authentication**: Login & Registration with cookie-based sessions.
- **Dataset Upload**: Upload datasets for analysis.
- **Data Exploration**: View dataset columns and basic data context.
- **AI Query / Analysis**: Ask questions and generate AI insights using dataset-derived context.
- **Visualization**: Chart components for common analytics needs.
- **Exporting**: Export analysis results (where supported by the backend implementation).

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, ESLint
- **Backend**: Express, Node.js
- **Charts**: React chart components (e.g., bar/line)
- **Auth**: cookie-based session handling

## Project Structure
```text
AI-analsyst-dashboard/
  README.md
  backend/
    src/
      app.js
      controllers/
      middlewares/
      models/
      routes/
      services/
      utils/
    uploads/
  frontend/
    src/
      components/
        Auth/
        Layout/
      services/
      main.jsx
      App.jsx
```

## Setup & Installation

### Prerequisites
- Node.js (LTS recommended)
- npm
- (Optional) A running AI provider/config depending on backend `aiService` implementation.

### Environment Variables
The frontend expects:
- `VITE_API_BASE` — base URL for backend API.

If your backend uses env vars (tokens/provider keys), add them according to `backend/package.json` and code in `backend/src/services/aiService.js`.

### Backend Setup
From the project root:
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
From the project root:
```bash
cd frontend
npm install
npm run dev
```

## Running the Application
1. Start backend (e.g., `npm run dev` in `backend/`).
2. Start frontend (e.g., `npm run dev` in `frontend/`).
3. Open the frontend URL shown by Vite.
4. Register/login if authentication is required.
5. Upload a dataset and begin exploration/AI queries.

## API Overview
Base paths (based on the current code structure):
- Auth:
  - `POST /auth/login`
  - `POST /auth/register`
- Upload:
  - Upload routes under `/upload/*`
- AI:
  - AI routes under `/ai/*`

> Exact request/response shapes may vary by controller implementation. Refer to:
- `backend/src/controllers/*.controller.js`
- `backend/src/routes/*.js`

## AI / Data Processing Flow
A typical end-to-end flow:
1. User uploads a dataset.
2. Backend processes the file, extracts metadata/columns, and stores derived context.
3. Frontend requests dataset info and renders exploration/analysis UI.
4. User submits an AI query.
5. Backend constructs an AI prompt using dataset/context and returns an AI response.
6. Frontend displays results and charts.

## Linting & Quality
Frontend linting:
```bash
cd frontend
npm run lint
```

## Screens / Pages
Common pages/components in the frontend:
- Dashboard (`/`)
- Upload (`/upload`)
- Login (`/login`)
- Register (`/register`)

## Troubleshooting
- **CORS / API connection issues**: ensure `VITE_API_BASE` is correct and backend allows cross-origin requests if needed.
- **Auth issues**: verify cookie domain/path configuration and backend auth middleware.
- **AI failures**: verify AI provider credentials/config inside `backend/src/services/aiService.js`.
- **Upload issues**: verify file size limits and multer configuration (`backend/src/utils/multer.js`).

