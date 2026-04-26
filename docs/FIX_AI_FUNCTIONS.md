# Fix AI Functions - Step by Step Guide

## Current Issue
The AI functions are returning 404 errors from Google Gemini API. This means either:
1. The API key is invalid
2. The model name is wrong
3. The API endpoint is incorrect

## Step 1: Verify Your Google API Key

### Get a Fresh API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

### Test the API Key
1. Open `test-gemini-api.js`
2. Replace `YOUR_API_KEY_HERE` with your actual API key
3. Run: `node test-gemini-api.js`
4. This will show you:
   - If your API key works
   - What models are available
   - The correct model names to use

## Step 2: Update Supabase Secrets

1. Go to [Supabase Dashboard](https://app.supabase.com/project/ssrrrtcjeztpwskntjvr)
2. Navigate to: **Project Settings** → **Edge Functions**
3. Scroll to **Secrets** section
4. Update or add:
   - Name: `GOOGLE_API_KEY`
   - Value: Your API key from Step 1
5. Click **Save**

## Step 3: Deploy Updated Functions

I've updated both functions with:
- Better error handling
- Correct API endpoints
- Detailed logging
- Fallback model names

### Deploy ai-assistant:
1. Go to Supabase Dashboard → **Edge Functions** → **ai-assistant**
2. Click **Deploy new version**
3. Copy ALL code from `vastu-vision-main/supabase/functions/ai-assistant/index.ts`
4. Paste and click **Deploy**

### Deploy vastu-analyze:
1. Go to Supabase Dashboard → **Edge Functions** → **vastu-analyze**
2. Click **Deploy new version**
3. Copy ALL code from `vastu-vision-main/supabase/functions/vastu-analyze/index.ts`
4. Paste and click **Deploy**

## Step 4: Test the Functions

### Test AI Assistant:
1. Open your app: http://localhost:5174
2. Go to AI Assistant page
3. Send a message: "What is Vastu Shastra?"
4. Check Supabase logs for detailed error messages

### Test Floor Plan Analysis:
1. Go to Dashboard
2. Upload a floor plan image
3. Click "Analyze Floor Plan"
4. Check Supabase logs

## Step 5: Check Logs

If it still doesn't work:
1. Go to Supabase Dashboard → **Edge Functions**
2. Click on the function (ai-assistant or vastu-analyze)
3. Click **Logs** tab
4. Look for detailed error messages
5. Share the error with me

## Common Issues & Solutions

### Issue: "API key not valid"
**Solution:** Get a fresh API key from Google AI Studio

### Issue: "Model not found"
**Solution:** Run test-gemini-api.js to see available models

### Issue: "Quota exceeded"
**Solution:** Check your Google AI Studio quota limits

### Issue: "CORS error"
**Solution:** This shouldn't happen with Edge Functions, but check Supabase CORS settings

## Expected Behavior

### When Working:
- AI Assistant responds to messages
- Floor plan analysis generates reports
- Logs show "Got response, length: XXX"

### When Not Working:
- Error messages in UI
- Detailed errors in Supabase logs
- 404, 400, or 500 status codes

## Need Help?

If you're still stuck after following these steps:
1. Run `node test-gemini-api.js` and share the output
2. Share the Supabase function logs
3. Verify your API key is active in Google AI Studio
