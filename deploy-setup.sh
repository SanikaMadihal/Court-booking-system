#!/bin/bash

# Vercel Deployment Helper Script
# Run this before deploying to generate required secrets

echo "==================================="
echo "Vercel Deployment Setup Helper"
echo "==================================="
echo ""

# Generate NEXTAUTH_SECRET
echo "🔐 Generating NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo ""

echo "📋 Copy these environment variables to Vercel:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Go to Settings > Environment Variables"
echo "4. Add the following variables:"
echo ""
echo "-----------------------------------"
echo "DATABASE_URL"
echo "  → Get from your database provider (Vercel Postgres, Neon, etc.)"
echo ""
echo "NEXTAUTH_URL"
echo "  → https://your-project-name.vercel.app"
echo "  → (You'll get this after first deployment)"
echo ""
echo "NEXTAUTH_SECRET"
echo "  → $NEXTAUTH_SECRET"
echo ""
echo "NODE_ENV"
echo "  → production"
echo "-----------------------------------"
echo ""

echo "💡 Tips:"
echo "  • For DATABASE_URL, see DEPLOYMENT.md for database setup"
echo "  • Save NEXTAUTH_SECRET securely - you'll need it"
echo "  • Update NEXTAUTH_URL after getting your Vercel domain"
echo ""

# Create a temp env file for reference
echo "# Generated $(date)" > .env.vercel.example
echo "DATABASE_URL=\"your_postgresql_connection_string\"" >> .env.vercel.example
echo "NEXTAUTH_URL=\"https://your-project.vercel.app\"" >> .env.vercel.example
echo "NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\"" >> .env.vercel.example
echo "NODE_ENV=\"production\"" >> .env.vercel.example

echo "✅ Created .env.vercel.example with generated secret"
echo "   (This file is gitignored - keep it safe!)"
echo ""
echo "Ready to deploy! 🚀"
