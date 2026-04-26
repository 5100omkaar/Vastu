# Deploy Edge Functions via Supabase Dashboard

Since Supabase CLI is not installed, you can deploy directly through the dashboard.

## Step 1: Go to Supabase Dashboard

1. Open https://supabase.com/dashboard
2. Select your project
3. Go to "Edge Functions" in the left sidebar

## Step 2: Deploy ai-assistant Function

1. Click on "ai-assistant" function (or create new if it doesn't exist)
2. Click "Edit Function" or "Deploy New Version"
3. Copy the entire content from: `supabase/functions/ai-assistant/index.ts`
4. Paste it into the editor
5. Click "Deploy"

## Step 3: Deploy vastu-analyze Function

1. Click on "vastu-analyze" function (or create new if it doesn't exist)
2. Click "Edit Function" or "Deploy New Version"
3. Copy the entire content from: `supabase/functions/vastu-analyze/index.ts`
4. Paste it into the editor
5. Click "Deploy"

## Step 4: Verify GOOGLE_API_KEY Secret

1. In Edge Functions section, click "Manage Secrets"
2. Verify `GOOGLE_API_KEY` is set with your API key
3. If not, add it: Name: `GOOGLE_API_KEY`, Value: `[your-api-key]`

## Step 5: Test

1. Open http://localhost:5174
2. Test AI Chat - send a message
3. Test Floor Plan Analysis - upload an image
4. Check function logs in dashboard for "✅ Success!"

## Alternative: Install Supabase CLI (Optional)

If you want to use CLI in the future:

```powershell
# Install via npm
npm install -g supabase

# Or via Scoop (Windows package manager)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

Then login:
```powershell
supabase login
supabase link --project-ref [your-project-ref]
```

But for now, using the dashboard is the quickest way!
