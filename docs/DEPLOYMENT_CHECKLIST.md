# 🚀 Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Test API Key (5 minutes)
```bash
cd vastu-vision-main
node test-gemini-api.js
```
- [ ] Replace `YOUR_API_KEY_HERE` with your actual Google API key
- [ ] Run the script
- [ ] Verify it shows available models
- [ ] Verify it successfully generates text

### 2. Update Supabase Secrets (2 minutes)
- [ ] Go to https://app.supabase.com/project/ssrrrtcjeztpwskntjvr
- [ ] Navigate to: Project Settings → Edge Functions → Secrets
- [ ] Add/Update: `GOOGLE_API_KEY` = your_api_key
- [ ] Click Save

### 3. Deploy Edge Functions (10 minutes)

#### Deploy ai-assistant:
- [ ] Go to Edge Functions → ai-assistant
- [ ] Click "Deploy new version"
- [ ] Copy code from `supabase/functions/ai-assistant/index.ts`
- [ ] Paste and Deploy
- [ ] Wait for "Deployed successfully" message

#### Deploy vastu-analyze:
- [ ] Go to Edge Functions → vastu-analyze
- [ ] Click "Deploy new version"
- [ ] Copy code from `supabase/functions/vastu-analyze/index.ts`
- [ ] Paste and Deploy
- [ ] Wait for "Deployed successfully" message

### 4. Test Locally (10 minutes)

#### Test AI Assistant:
- [ ] Open http://localhost:5174
- [ ] Sign in to your account
- [ ] Go to AI Assistant page
- [ ] Send message: "What is Vastu Shastra?"
- [ ] Verify you get a response (not an error)

#### Test Floor Plan Analysis:
- [ ] Go to Dashboard
- [ ] Upload a floor plan image (any architectural drawing)
- [ ] Add optional question (e.g., "Is this layout good?")
- [ ] Click "Analyze Floor Plan"
- [ ] Wait for analysis to complete
- [ ] Verify report is generated with scores and recommendations

### 5. Check Logs (if errors occur)
- [ ] Go to Supabase Dashboard → Edge Functions
- [ ] Click on the function that failed
- [ ] Click "Logs" tab
- [ ] Look for error messages
- [ ] Share errors if you need help

---

## 🌐 Production Deployment

### 1. Choose Hosting Platform
- [ ] Vercel (recommended)
- [ ] Netlify
- [ ] Other: ___________

### 2. Deploy Frontend

#### For Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd vastu-vision-main
vercel
```

- [ ] Follow prompts
- [ ] Add environment variables in Vercel dashboard:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_SUPABASE_PROJECT_ID`
- [ ] Deploy to production

#### For Netlify:
```bash
# Build locally
npm run build

# Deploy dist folder via Netlify UI
```

- [ ] Add environment variables in Netlify dashboard
- [ ] Deploy

### 3. Update Supabase URLs
- [ ] Go to Supabase Dashboard → Authentication → URL Configuration
- [ ] Update Site URL to your production domain
- [ ] Add production domain to Redirect URLs
- [ ] Keep localhost URLs for development

### 4. Test Production
- [ ] Visit your production URL
- [ ] Test signup/login
- [ ] Test AI assistant
- [ ] Test floor plan analysis
- [ ] Test on mobile device
- [ ] Test in different browsers

---

## 🔍 Troubleshooting

### AI Functions Still Not Working?

1. **Check API Key:**
   ```bash
   node test-gemini-api.js
   ```
   - If this fails, your API key is invalid
   - Get a new key from https://aistudio.google.com/app/apikey

2. **Check Supabase Logs:**
   - Look for "Trying model: XXX" messages
   - Look for "✅ Success with model" or "❌ Model failed"
   - Share the error messages

3. **Check Model Availability:**
   - Some models may not be available in your region
   - The functions now try multiple models automatically
   - Check logs to see which models were attempted

4. **Check Quota:**
   - Go to https://aistudio.google.com/
   - Check if you've exceeded free tier limits
   - Add billing if needed

### Common Errors:

**"API key not valid"**
- Get a fresh API key
- Make sure you copied it correctly
- Check for extra spaces

**"Model not found"**
- The function now tries multiple models
- Check logs to see which models were tried
- Update the modelsToTry array if needed

**"Rate limit exceeded"**
- Wait a few minutes
- Check your Google AI Studio quota
- Consider upgrading to paid tier

---

## ✅ Success Criteria

Your deployment is successful when:
- [ ] Users can sign up and log in
- [ ] AI Assistant responds to messages
- [ ] Floor plan analysis generates reports
- [ ] Reports display correctly with charts
- [ ] No errors in browser console
- [ ] No errors in Supabase logs
- [ ] App works on mobile devices

---

## 📊 Post-Deployment

### Monitor Usage:
- [ ] Check Supabase Dashboard for user activity
- [ ] Monitor Edge Function invocations
- [ ] Check Google AI Studio for API usage
- [ ] Set up alerts for errors

### Optimize:
- [ ] Add caching if needed
- [ ] Optimize images
- [ ] Monitor performance
- [ ] Gather user feedback

---

## 🆘 Need Help?

If you're stuck:
1. Run `node test-gemini-api.js` and share output
2. Share Supabase function logs
3. Share browser console errors
4. Verify API key is active in Google AI Studio

---

**Good luck with your deployment! 🚀**
