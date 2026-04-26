# AI API Migration Guide

## Current Situation

Your Supabase Edge Functions currently use Lovable's AI Gateway API:
- `supabase/functions/vastu-analyze/index.ts` - Uses Lovable AI for floor plan analysis
- `supabase/functions/ai-assistant/index.ts` - Uses Lovable AI for chat assistant

These functions require a `LOVABLE_API_KEY` environment variable.

## Migration Options

You have several options to replace the Lovable AI Gateway:

### Option 1: Use OpenAI Directly (Recommended)

Replace Lovable's gateway with OpenAI's API:

```typescript
// Replace this:
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  headers: { Authorization: `Bearer ${LOVABLE_API_KEY}` }
});

// With this:
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
  headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
});
```

**Model changes:**
- Replace `"google/gemini-2.5-pro"` with `"gpt-4o"` or `"gpt-4-vision-preview"` for image analysis
- OpenAI supports the same chat completions API format

**Setup:**
1. Get an API key from https://platform.openai.com/api-keys
2. Add to Supabase: Dashboard > Edge Functions > Secrets
3. Set `OPENAI_API_KEY` environment variable

### Option 2: Use Google Gemini Directly

Since you're using Gemini models, connect directly to Google AI:

```typescript
const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
const aiResponse = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [/* your messages */],
      generationConfig: { /* config */ }
    })
  }
);
```

**Setup:**
1. Get API key from https://aistudio.google.com/app/apikey
2. Add to Supabase Edge Functions secrets
3. Update request/response format (Gemini uses different format than OpenAI)

### Option 3: Use Anthropic Claude

For high-quality analysis with vision capabilities:

```typescript
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [/* your messages */]
  })
});
```

**Setup:**
1. Get API key from https://console.anthropic.com/
2. Add to Supabase Edge Functions secrets
3. Update request format (Anthropic uses different API structure)

### Option 4: Use OpenRouter (Multi-Model Gateway)

Access multiple AI providers through one API:

```typescript
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "HTTP-Referer": "https://your-domain.com",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "google/gemini-2.0-flash-exp:free", // or any other model
    messages: [/* your messages */]
  })
});
```

**Benefits:**
- Access to 100+ models from different providers
- Fallback options if one provider is down
- Competitive pricing
- OpenAI-compatible API format (minimal code changes)

**Setup:**
1. Sign up at https://openrouter.ai/
2. Get API key from https://openrouter.ai/keys
3. Add credits to your account
4. Update environment variable to `OPENROUTER_API_KEY`

## Step-by-Step Migration (OpenAI Example)

### 1. Update Environment Variables

In Supabase Dashboard > Project Settings > Edge Functions:

```bash
# Remove
LOVABLE_API_KEY=xxx

# Add
OPENAI_API_KEY=sk-proj-xxx
```

### 2. Update vastu-analyze function

```typescript
// Line 28-29: Replace
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

// With
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

// Line 70: Replace model
model: "gpt-4o", // or "gpt-4-vision-preview"

// Line 125-128: Replace endpoint
const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});
```

### 3. Update ai-assistant function

Apply similar changes to `supabase/functions/ai-assistant/index.ts`:
- Replace `LOVABLE_API_KEY` with `OPENAI_API_KEY`
- Update API endpoint
- Update model name

### 4. Test the Functions

```bash
# Test locally with Supabase CLI
supabase functions serve vastu-analyze --env-file .env.local

# Or deploy and test
supabase functions deploy vastu-analyze
```

### 5. Update Frontend (if needed)

Check if any frontend code references Lovable:

```bash
# Search for Lovable references
grep -r "lovable" src/
```

## Cost Comparison

| Provider | Model | Input (per 1M tokens) | Output (per 1M tokens) | Vision |
|----------|-------|----------------------|------------------------|--------|
| OpenAI | GPT-4o | $2.50 | $10.00 | ✅ |
| OpenAI | GPT-4o-mini | $0.15 | $0.60 | ✅ |
| Google | Gemini 2.0 Flash | Free tier available | Free tier available | ✅ |
| Anthropic | Claude 3.5 Sonnet | $3.00 | $15.00 | ✅ |
| OpenRouter | Various | Varies by model | Varies by model | ✅ |

## Recommended Approach

For your Vastu Vision app, I recommend:

1. **Start with OpenRouter** - Easiest migration, minimal code changes, access to multiple models
2. **Use Gemini 2.0 Flash** through OpenRouter - Good quality, low cost, fast
3. **Keep OpenAI as fallback** - For when you need highest quality analysis

## Testing Checklist

After migration:
- [ ] Floor plan upload and analysis works
- [ ] AI assistant chat works
- [ ] Image analysis produces accurate results
- [ ] Error handling works (rate limits, API errors)
- [ ] Cost monitoring is set up
- [ ] API keys are secured in Supabase secrets

## Need Help?

- OpenAI Docs: https://platform.openai.com/docs
- Google AI Docs: https://ai.google.dev/docs
- Anthropic Docs: https://docs.anthropic.com
- OpenRouter Docs: https://openrouter.ai/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions

## Current Files to Update

1. `supabase/functions/vastu-analyze/index.ts` - Main analysis function
2. `supabase/functions/ai-assistant/index.ts` - Chat assistant function
3. Supabase Edge Functions environment variables

Both files are ready to migrate - just update the API key variable name, endpoint URL, and optionally the model name.
