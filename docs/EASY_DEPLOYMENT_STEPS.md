# Easy Deployment Steps - Copy & Paste

I've created 2 simple text files with the fixed code. Just copy and paste them!

## Files Created:
1. `FUNCTION_1_ai-assistant.txt` - Chat function code
2. `FUNCTION_2_vastu-analyze.txt` - Floor plan analysis code

## Step-by-Step Instructions:

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Login to your account
3. Select your VastuVista project
4. Click "Edge Functions" in the left sidebar

---

### Step 2: Deploy ai-assistant Function

1. In Supabase Dashboard, click on "ai-assistant" function
   - If it doesn't exist, click "Create a new function" and name it "ai-assistant"

2. Click "Edit" or "Deploy New Version"

3. Open the file: `FUNCTION_1_ai-assistant.txt` in Notepad
   - Location: `vastu-vision-main/FUNCTION_1_ai-assistant.txt`
   - Right-click → Open with → Notepad

4. Select ALL the code (Ctrl+A)

5. Copy it (Ctrl+C)

6. Go back to Supabase Dashboard

7. Delete all existing code in the editor

8. Paste the new code (Ctrl+V)

9. Click "Deploy" button

10. Wait for "Deployed successfully" message ✅

---

### Step 3: Deploy vastu-analyze Function

1. In Supabase Dashboard, click on "vastu-analyze" function
   - If it doesn't exist, click "Create a new function" and name it "vastu-analyze"

2. Click "Edit" or "Deploy New Version"

3. Open the file: `FUNCTION_2_vastu-analyze.txt` in Notepad
   - Location: `vastu-vision-main/FUNCTION_2_vastu-analyze.txt`
   - Right-click → Open with → Notepad

4. Select ALL the code (Ctrl+A)

5. Copy it (Ctrl+C)

6. Go back to Supabase Dashboard

7. Delete all existing code in the editor

8. Paste the new code (Ctrl+V)

9. Click "Deploy" button

10. Wait for "Deployed successfully" message ✅

---

### Step 4: Verify API Key (Important!)

1. In Edge Functions section, look for "Manage Secrets" or "Settings"

2. Check if `GOOGLE_API_KEY` exists

3. If it exists, you're good! ✅

4. If NOT, add it:
   - Click "Add Secret" or "New Secret"
   - Name: `GOOGLE_API_KEY`
   - Value: Your API key from Google AI Studio
   - Click "Save"

---

### Step 5: Test Your App

1. Make sure your app is running:
   ```
   cd vastu-vision-main
   npm run dev
   ```

2. Open: http://localhost:5174

3. Test AI Chat:
   - Click "AI Assistant" in the navigation bar
   - Type a message: "What is Vastu Shastra?"
   - Press Send
   - You should get a response! ✅

4. Test Floor Plan Analysis:
   - Go to "Dashboard"
   - Click "Analyze Floor Plan"
   - Upload any floor plan image
   - Click "Analyze"
   - You should get a Vastu report! ✅

---

### Step 6: Check Logs (If Something Goes Wrong)

1. In Supabase Dashboard → Edge Functions
2. Click on the function name (ai-assistant or vastu-analyze)
3. Click "Logs" tab
4. Look for:
   - ✅ "Success! Gemini API responded" = Working!
   - ❌ Any error messages = Something wrong

---

## That's It!

You've successfully deployed both AI functions with the correct Gemini model names!

## Need Help?

If you see errors:
1. Check the logs in Supabase Dashboard
2. Verify GOOGLE_API_KEY is set correctly
3. Make sure you copied ALL the code from the .txt files
4. Try redeploying the function
