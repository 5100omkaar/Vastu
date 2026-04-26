# Vastu Vision

A modern web application for Vastu Shastra analysis and consultation, built with React, TypeScript, and Supabase.

## Features

- 🏠 Vastu analysis and reporting
- 👤 User authentication and profiles
- 📊 Interactive dashboard
- 💬 AI-powered Vastu assistant
- 📱 Responsive design with dark mode support

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **Animations**: Framer Motion

## Prerequisites

- Node.js 16+ and npm (or use [nvm](https://github.com/nvm-sh/nvm))
- A Supabase account and project ([sign up here](https://supabase.com))

## Getting Started

### 1. Clone the repository

```sh
git clone <YOUR_GIT_URL>
cd vastu-vision-main
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```sh
cp .env.example .env
```

Then edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

You can find these values in your [Supabase project settings](https://app.supabase.com) under Settings > API.

### 4. Set up Supabase

1. Create a new project in [Supabase](https://app.supabase.com)
2. Run the database migrations (if you have SQL files in a migrations folder)
3. Set up authentication providers in Supabase Dashboard > Authentication > Providers
4. Configure storage buckets if needed

### 5. Start the development server

```sh
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
vastu-vision-main/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # Third-party integrations (Supabase)
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify site settings
6. Deploy!

## Environment Variables

Make sure to set these environment variables in your deployment platform:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue in the GitHub repository.
