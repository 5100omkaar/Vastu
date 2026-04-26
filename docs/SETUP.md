# Independent Development Setup Guide

This guide will help you transition from Lovable AI to independent development.

## What Changed?

1. ✅ Removed hardcoded Supabase credentials from code
2. ✅ Updated Supabase client to use environment variables
3. ✅ Removed Lovable-specific dependencies (lovable-tagger)
4. ✅ Created `.env.example` template
5. ✅ Updated `.gitignore` to protect environment files
6. ✅ Rewrote README for independent development

## Next Steps

### 1. Secure Your Credentials

Your Supabase credentials are currently in `.env`. Make sure this file is:
- ✅ Already in `.gitignore` (done)
- ⚠️ **NEVER committed to Git**
- 🔒 Kept private and secure

### 2. Install Dependencies

Remove the old `node_modules` and reinstall without Lovable dependencies:

```sh
cd vastu-vision-main
rm -rf node_modules package-lock.json
npm install
```

### 3. Verify Environment Variables

Check that your `.env` file has the correct values:

```env
VITE_SUPABASE_URL=https://ssrrrtcjeztpwskntjvr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_key_here
VITE_SUPABASE_PROJECT_ID=ssrrrtcjeztpwskntjvr
```

### 4. Test the Application

```sh
npm run dev
```

Visit `http://localhost:5173` and verify:
- ✅ App loads without errors
- ✅ Authentication works
- ✅ Database queries work
- ✅ All features function properly

### 5. Set Up Version Control

If you haven't already, initialize Git and make your first independent commit:

```sh
git init
git add .
git commit -m "Initial commit: Independent development setup"
```

**Important**: Before pushing to any remote repository, verify `.env` is NOT included:

```sh
git status
# .env should NOT appear in the list
```

### 6. Set Up Remote Repository

Create a new repository on GitHub/GitLab/Bitbucket and push:

```sh
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

### 7. Configure Deployment

When deploying to Vercel, Netlify, or other platforms:

1. Add environment variables in the platform's dashboard
2. Use the same keys from your `.env` file
3. Never commit production credentials to Git

## Development Workflow

### Local Development

```sh
npm run dev          # Start dev server
npm run lint         # Check code quality
npm test             # Run tests
```

### Building for Production

```sh
npm run build        # Creates optimized build in /dist
npm run preview      # Preview production build locally
```

### Code Quality

```sh
npm run lint         # Run ESLint
npm run test         # Run test suite
```

## Supabase Management

### Access Your Supabase Dashboard

Visit: https://app.supabase.com/project/ssrrrtcjeztpwskntjvr

Here you can:
- View and edit database tables
- Manage authentication settings
- Monitor API usage
- Set up storage buckets
- View logs and analytics

### Database Migrations

To make database changes:

1. Go to Supabase Dashboard > SQL Editor
2. Write your SQL migrations
3. Save them in a `supabase/migrations` folder locally
4. Document changes for team members

### Backup Your Database

Regularly backup your Supabase data:
- Use Supabase Dashboard > Database > Backups
- Export tables as CSV/JSON
- Consider setting up automated backups

## Common Issues

### "Missing Supabase environment variables" Error

**Solution**: Make sure your `.env` file exists and contains all required variables.

### Authentication Not Working

**Solution**: Check Supabase Dashboard > Authentication > URL Configuration. Add your local and production URLs.

### CORS Errors

**Solution**: In Supabase Dashboard > Settings > API, add your domain to allowed origins.

### Build Fails

**Solution**: 
```sh
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Getting Help

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **shadcn/ui**: https://ui.shadcn.com

## Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] No credentials in source code
- [ ] Environment variables set in deployment platform
- [ ] Supabase RLS (Row Level Security) policies configured
- [ ] API keys rotated if previously exposed
- [ ] HTTPS enabled in production
- [ ] Authentication properly configured

## Next Features to Consider

- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add error tracking (Sentry)
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Add automated testing
- [ ] Set up staging environment
- [ ] Configure custom domain
- [ ] Add monitoring and alerts

---

You're now ready for independent development! 🚀
