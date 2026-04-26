# Migration Checklist

Use this checklist to track your transition from Lovable to independent development.

## Phase 1: Local Setup ✅

- [x] Removed hardcoded Supabase credentials
- [x] Updated Supabase client to use environment variables
- [x] Removed Lovable dependencies (lovable-tagger)
- [x] Updated vite.config.ts
- [x] Created .env.example
- [x] Updated .gitignore
- [ ] Clean install dependencies (`rm -rf node_modules package-lock.json && npm install`)
- [ ] Test app locally (`npm run dev`)
- [ ] Verify authentication works
- [ ] Verify database queries work
- [ ] Test all major features

## Phase 2: AI Migration ⚠️

Choose your AI provider:
- [ ] Option 1: OpenAI (GPT-4o)
- [ ] Option 2: Google Gemini
- [ ] Option 3: Anthropic Claude
- [ ] Option 4: OpenRouter (recommended)

Then:
- [ ] Get API key from chosen provider
- [ ] Add API key to Supabase Edge Functions secrets
- [ ] Update `supabase/functions/vastu-analyze/index.ts`
- [ ] Update `supabase/functions/ai-assistant/index.ts`
- [ ] Test functions locally
- [ ] Deploy updated functions
- [ ] Test floor plan analysis
- [ ] Test AI assistant chat

## Phase 3: Version Control

- [ ] Initialize Git repository (`git init`)
- [ ] Verify .env is NOT tracked (`git status` should not show .env)
- [ ] Create .gitignore (already done)
- [ ] Make initial commit
- [ ] Create GitHub/GitLab repository
- [ ] Add remote origin
- [ ] Push to remote
- [ ] Verify .env was NOT pushed

## Phase 4: Security Review

- [ ] Verify .env is in .gitignore
- [ ] Check no credentials in source code
- [ ] Review Supabase RLS policies
- [ ] Enable Supabase email confirmations
- [ ] Set up password requirements
- [ ] Configure CORS settings
- [ ] Review API rate limits
- [ ] Set up Supabase auth redirects

## Phase 5: Deployment

Choose your platform:
- [ ] Vercel
- [ ] Netlify
- [ ] Other: ___________

Then:
- [ ] Create account on platform
- [ ] Connect Git repository
- [ ] Configure build settings
  - Build command: `npm run build`
  - Output directory: `dist`
- [ ] Add environment variables
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_SUPABASE_PROJECT_ID`
- [ ] Deploy
- [ ] Test production deployment
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate (usually automatic)

## Phase 6: Supabase Configuration

- [ ] Update Supabase auth redirect URLs
  - Add production URL
  - Add staging URL (if applicable)
- [ ] Configure email templates
- [ ] Set up storage buckets
- [ ] Review database indexes
- [ ] Set up database backups
- [ ] Configure Edge Functions secrets
- [ ] Test Edge Functions in production

## Phase 7: Monitoring & Analytics

- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Add analytics (Google Analytics, Plausible, etc.)
- [ ] Monitor Supabase usage
- [ ] Monitor AI API usage and costs
- [ ] Set up uptime monitoring
- [ ] Configure alerts for errors
- [ ] Set up performance monitoring

## Phase 8: Documentation

- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document environment variables
- [ ] Create API documentation (if applicable)
- [ ] Document database schema
- [ ] Create user guide (if needed)

## Phase 9: Testing

- [ ] Test user registration
- [ ] Test user login
- [ ] Test password reset
- [ ] Test floor plan upload
- [ ] Test Vastu analysis
- [ ] Test AI assistant
- [ ] Test report generation
- [ ] Test report deletion
- [ ] Test profile updates
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Test dark mode
- [ ] Load testing (optional)

## Phase 10: Optimization

- [ ] Optimize images
- [ ] Enable caching
- [ ] Minimize bundle size
- [ ] Set up CDN (if needed)
- [ ] Optimize database queries
- [ ] Add loading states
- [ ] Improve error messages
- [ ] Add SEO meta tags
- [ ] Create sitemap
- [ ] Add robots.txt

## Phase 11: Backup & Recovery

- [ ] Export Supabase database
- [ ] Backup environment variables
- [ ] Document recovery procedures
- [ ] Test restore process
- [ ] Set up automated backups
- [ ] Create disaster recovery plan

## Phase 12: Legal & Compliance

- [ ] Add privacy policy
- [ ] Add terms of service
- [ ] Add cookie consent (if needed)
- [ ] Review data retention policies
- [ ] Ensure GDPR compliance (if applicable)
- [ ] Add contact information

## Optional Enhancements

- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add automated testing
- [ ] Set up staging environment
- [ ] Add feature flags
- [ ] Implement A/B testing
- [ ] Add user feedback system
- [ ] Create admin dashboard
- [ ] Add email notifications
- [ ] Implement webhooks
- [ ] Add API rate limiting

## Notes

Use this space to track issues, decisions, or important information:

```
Date: ___________
Notes:




```

---

## Quick Reference

**Current Status**: Phase 1 Complete ✅

**Next Action**: Clean install and test locally

**Blockers**: None

**Questions**: See AI_MIGRATION.md for AI provider options
