
# Faso Agent

A React-based web application featuring various components for exploring Burkinabé culture, heritage, and services.

## Features

- Chat Interface with Voice Input
- Heritage Gallery and Region Explorer
- Radio Station Explorer
- Pharmacy Finder
- Weather Widget
- Fun Facts and Quizzes

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root with your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Build for Production

To create a production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Deployment

This project is configured for deployment on Netlify. Connect your GitHub repository to Netlify and use the following settings:
- Build command: `npm run build`
- Publish directory: `dist`

Remember to set the `GEMINI_API_KEY` environment variable in your Netlify dashboard.
