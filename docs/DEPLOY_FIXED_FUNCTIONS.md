# Deploy Fixed AI Functions

## What Was Fixed

Both Edge Functions now use the correct model name `gemini-pro` for Google's v1beta API:
- ✅ `ai-assistant` - Chat functionality 
- ✅ `vastu-analyze` - Floor plan analysis (uses `gemini-pro-vision` for image support)

The previous error was caused by using incorrect model names like `gemini-1.5-flash-latest` and `gemini-1.0-pro` which don't exist in the v1beta API.

## Deploy Commands

Run these commands from the `vastu-vision-main` directory:

```bash
# Deploy AI Assistant (chat)
supabase functions deploy ai-assistant

# Deploy Vastu Analyze (floor plan analysis)
supabase functions deploy vastu-analyze
```

## Verify Deployment

After deploying, test the functions:

### 1. Test AI Chat
- Open your app at http://localhost:5174
- Click "AI Assistant" in the navigation
- Send a message like "What is Vastu Shastra?"
- You should get a response from Gemini

### 2. Test Floor Plan Analysis
- Go to Dashboard
- Click "Analyze Floor Plan"
- Upload a floor plan image
- Click "Analyze"
- You should get a Vastu analysis report

## Check Logs

View function logs in Supabase Dashboard:
1. Go to Edge Functions section
2. Click on the function name
3. View logs tab
4. Look for "✅ Success! Gemini API responded"

## Expected Log Output

### Successful ai-assistant call:
```
=== AI Assistant Request Started ===
Mode: chat
Messages count: 1
API key found (length: 39)
Prepared 3 content parts
Calling Gemini API with model: gemini-pro
✅ Success! Gemini API responded
Got response, length: 245
```

### Successful vastu-analyze call:
```
Starting Vastu analysis for user: [user-id]
Image URL: [url]
Fetching image...
Image fetched and converted to base64
Calling Gemini API with model: gemini-pro-vision
✅ Success! Gemini API responded
Gemini response received
Successfully parsed AI response
Saving report to database...
Report saved successfully: [report-id]
```

## Troubleshooting

If you still see errors:

1. **404 errors**: Model name is wrong (should be fixed now)
2. **401/403 errors**: API key issue - verify GOOGLE_API_KEY secret
3. **Image fetch errors**: Check Supabase storage permissions
4. **Parse errors**: Gemini returned invalid JSON format

## Next Steps

Once both functions are deployed and working:
1. ✅ AI Chat should work
2. ✅ Floor plan analysis should work
3. Test thoroughly with different queries
4. Monitor logs for any issues
