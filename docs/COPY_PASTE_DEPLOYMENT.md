# Copy-Paste Deployment Guide

Since Supabase CLI is not installed, deploy by copying the code directly to Supabase Dashboard.

## Step-by-Step Instructions

### 1. Open Supabase Dashboard
- Go to: https://supabase.com/dashboard
- Select your project
- Click "Edge Functions" in left sidebar

### 2. Deploy ai-assistant Function

**Option A: Update Existing Function**
1. Click on "ai-assistant" function
2. Click "Edit" or "Deploy New Version"
3. Delete all existing code
4. Open file: `supabase/functions/ai-assistant/index.ts`
5. Copy ALL the code (Ctrl+A, Ctrl+C)
6. Paste into Supabase editor
7. Click "Deploy"

**Option B: Create New Function**
1. Click "Create a new function"
2. Name: `ai-assistant`
3. Copy code from `supabase/functions/ai-assistant/index.ts`
4. Paste and click "Deploy"

### 3. Deploy vastu-analyze Function

**Repeat same process:**
1. Click on "vastu-analyze" function (or create new)
2. Copy ALL code from: `supabase/functions/vastu-analyze/index.ts`
3. Paste into editor
4. Click "Deploy"

### 4. Verify API Key Secret

1. In Edge Functions, click "Manage Secrets" or "Settings"
2. Check if `GOOGLE_API_KEY` exists
3. If not, add it:
   - Name: `GOOGLE_API_KEY`
   - Value: Your API key from Google AI Studio

### 5. Test Your App

1. Open: http://localhost:5174
2. Test AI Chat:
   - Click "AI Assistant"
   - Send message: "What is Vastu Shastra?"
   - Should get response ✅

3. Test Floor Plan Analysis:
   - Go to Dashboard
   - Click "Analyze Floor Plan"
   - Upload image
   - Click "Analyze"
   - Should get report ✅

### 6. Check Logs

In Supabase Dashboard → Edge Functions → Select function → Logs tab

Look for:
```
✅ Success! Gemini API responded
```

## Files to Copy

Both files are in your project:
- `vastu-vision-main/supabase/functions/ai-assistant/index.ts`
- `vastu-vision-main/supabase/functions/vastu-analyze/index.ts`

## That's It!

No CLI installation needed. Just copy-paste the code through the dashboard!
