# IQES Low Voltage - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended) or email

### Step 2: Prepare Repository
1. Create a new GitHub repository
2. Push this code to the repository

### Step 3: Deploy to Vercel
1. In Vercel dashboard, click "Add New Project"
2. Import your GitHub repository
3. Configure environment variables (see below)
4. Click "Deploy"

### Step 4: Configure Environment Variables
In Vercel project settings → Environment Variables, add:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Random secret for auth | Yes |
| `NEXTAUTH_URL` | Your domain (https://iqeslowvoltage.com) | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | Yes |
| `RESEND_API_KEY` | Resend API key | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | Optional |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Optional |

### Step 5: Connect Domain
1. In Vercel project → Settings → Domains
2. Add `iqeslowvoltage.com`
3. Update DNS records in ClickPanda as instructed

---

## 📊 Database Setup

### Option A: Vercel Postgres (Recommended)
1. In Vercel dashboard → Storage → Create Database
2. Select "Postgres"
3. Copy the connection string to `DATABASE_URL`

### Option B: Supabase (Free tier available)
1. Create account at supabase.com
2. Create new project
3. Copy connection string from Settings → Database

---

## 🔧 Local Development

```bash
# Install dependencies
yarn install

# Run database migrations
npx prisma migrate dev

# Start development server
yarn dev
```

---

## 📁 Project Structure

```
/app                 # Next.js App Router pages
  /api              # API routes
  /admin            # Admin dashboard
  /locations        # City SEO pages
  /services         # Service SEO pages
/components         # React components
/lib                # Utilities and configurations
/prisma             # Database schema
/public             # Static assets
```

---

## 🎯 SEO Features

- Dynamic city + service pages (Jacksonville, Miami, Tampa, etc.)
- Bilingual content (English/Spanish)
- Schema.org structured data
- Dynamic sitemap.xml
- Optimized meta tags

---

## 📞 Voice Agent Integration

The site is configured to work with Retell.ai voice agent.
Update the agent ID in environment variables after setup.

---

## 📧 Contact

For support: info@iqeslowvoltage.com
