# Troubleshooting AI Functions

## Error: "Unable to connect to AI service"

This error means the Gemini API call is failing. Let's diagnose the issue.

### Step 1: Check Supabase Logs

1. Go to Supabase Dashboard
2. Click "Edge Functions"
3. Click on "ai-assistant" function
4. Click "Logs" tab
5. Look for the most recent error

**What to look for:**
- "404" error = Wrong model name
- "401" or "403" error = API key problem
- "429" error = Rate limit exceeded
- Other errors = Copy the full error message

### Step 2: Verify API Key

1. Go to https://aistudio.google.com/app/apikey
2. Check if your API key is still valid
3. Copy the API key

4. In Supabase Dashboard:
   - Go to Edge Functions
   - Click "Manage Secrets" or "Settings"
   - Find `GOOGLE_API_KEY`
   - Click "Edit" or "Update"
   - Paste your API key
   - Click "Save"

5. Redeploy both functions after updating the key

### Step 3: Test API Key Directly

Run this test to verify your API key works:

```bash
cd vastu-vision-main
node test-gemini-models.js
```

**Before running:**
1. Open `test-gemini-models.js` in Notepad
2. Replace `YOUR_API_KEY_HERE` with your actual API key
3. Save the file
4. Run the command above

This will test which model names work with your API key.

### Step 4: Try Different API Version

The issue might be with the API version (v1beta vs v1).

**Option A: Try v1 API**
1. Use the file: `FUNCTION_1_ai-assistant_v1.txt`
2. This uses v1 API with `gemini-1.5-flash` model
3. Copy and paste to Supabase Dashboard
4. Deploy and test

**Option B: Check Google AI Studio**
1. Go to https://aistudio.google.com
2. Try creating a chat with Gemini
3. Check which models are available in your region
4. Some models might not be available in all regions

### Step 5: Common Issues

**Issue: API Key Not Set**
- Error: "GOOGLE_API_KEY is not configured"
- Solution: Add the secret in Supabase Dashboard

**Issue: Wrong Model Name**
- Error: "404" or "model not found"
- Solution: Try different model names (see test script)

**Issue: API Key Invalid**
- Error: "401" or "403"
- Solution: Generate new API key from Google AI Studio

**Issue: Rate Limit**
- Error: "429"
- Solution: Wait a few minutes and try again

**Issue: Region Restriction**
- Error: "Model not available"
- Solution: Some models are region-specific, try different models

### Step 6: Alternative Models to Try

If `gemini-pro` doesn't work, try these in order:

1. `gemini-1.5-flash` (v1 API)
2. `gemini-1.5-pro` (v1 API)
3. `gemini-pro` (v1beta API)
4. `models/gemini-pro` (with models/ prefix)

### Step 7: Get Help

If still not working, please provide:
1. Full error message from Supabase logs
2. Your region/country
3. Result from running `test-gemini-models.js`
4. Screenshot of the error

## Quick Fixes

### Fix 1: Regenerate API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the new key
4. Update in Supabase secrets
5. Redeploy functions

### Fix 2: Use v1 API Instead
1. Deploy `FUNCTION_1_ai-assistant_v1.txt`
2. This uses the newer v1 API
3. Might work better in some regions

### Fix 3: Check Billing
1. Go to Google Cloud Console
2. Check if Gemini API is enabled
3. Some features require billing enabled
4. Free tier should work for testing

## Still Not Working?

Copy the EXACT error message from Supabase logs and share it.
The error message will tell us exactly what's wrong!
