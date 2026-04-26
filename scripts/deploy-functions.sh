#!/bin/bash

# Deploy Fixed AI Functions Script
# This script deploys both Edge Functions with the corrected Gemini model names

echo "🚀 Deploying Fixed AI Functions..."
echo ""

# Check if we're in the right directory
if [ ! -d "supabase/functions" ]; then
    echo "❌ Error: supabase/functions directory not found"
    echo "Please run this script from the vastu-vision-main directory"
    exit 1
fi

# Deploy ai-assistant
echo "📦 Deploying ai-assistant function..."
supabase functions deploy ai-assistant

if [ $? -eq 0 ]; then
    echo "✅ ai-assistant deployed successfully"
else
    echo "❌ Failed to deploy ai-assistant"
    exit 1
fi

echo ""

# Deploy vastu-analyze
echo "📦 Deploying vastu-analyze function..."
supabase functions deploy vastu-analyze

if [ $? -eq 0 ]; then
    echo "✅ vastu-analyze deployed successfully"
else
    echo "❌ Failed to deploy vastu-analyze"
    exit 1
fi

echo ""
echo "🎉 All functions deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Test AI Chat at http://localhost:5174"
echo "2. Test Floor Plan Analysis in Dashboard"
echo "3. Check logs in Supabase Dashboard for '✅ Success!' messages"
