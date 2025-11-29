# Deployment Instructions

This guide provides step-by-step instructions for deploying your application based on your selected technology stack.

## Platform Setup

### Deploying to Vercel

**Prerequisites:**
- Vercel account
- GitHub repository connected to Vercel

**Steps:**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy your application:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

**Configuration:**
- Vercel automatically detects Next.js projects
- Environment variables should be set in the Vercel dashboard under Settings → Environment Variables
- Build command: `npm run build`
- Output directory: `.next`
- Install command: `npm install`

**Custom Domain:**
1. Go to your project settings in Vercel dashboard
2. Navigate to Domains
3. Add your custom domain
4. Update your DNS records as instructed

**Continuous Deployment:**
- Vercel automatically deploys on push to your main branch
- Pull requests create preview deployments
- Configure branch deployments in Settings → Git

### Deploying to Railway

**Prerequisites:**
- Railway account
- GitHub repository

**Steps:**

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize your project:
```bash
railway init
```

4. Link to your Railway project:
```bash
railway link
```

5. Deploy your application:
```bash
railway up
```

**Configuration:**

Create a `railway.json` file in your project root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Environment Variables:**
- Set in Railway dashboard under Variables tab
- Or use CLI: `railway variables set KEY=value`

**Health Checks:**
Railway automatically monitors your application. Configure health check endpoint in your application:
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
```

**Custom Domain:**
1. Go to Settings in Railway dashboard
2. Navigate to Domains
3. Add custom domain
4. Update DNS records with provided values

**Scaling:**
- Railway supports horizontal and vertical scaling
- Configure in Settings → Resources
- Adjust memory and CPU allocation as needed

## Database Deployment

### No Database Deployment

Your application is configured without a database backend. No additional database setup is required.

**Static Content:**
- All data is client-side only
- Consider using environment variables for configuration
- Perfect for static sites and applications without persistent data

### NeonDB Deployment

**Prerequisites:**
- NeonDB account (sign up at [neon.tech](https://neon.tech))

**Steps:**

1. Create a new project in NeonDB dashboard
2. Copy your connection string from the dashboard
3. Set environment variable in your deployment platform:
   - `DATABASE_URL=your-neondb-connection-string`

**Database Schema Setup:**

1. Generate Prisma client:
```bash
npx prisma generate
```

2. Push schema to database:
```bash
npx prisma db push
```

3. Or use migrations:
```bash
npx prisma migrate deploy
```

**Connection Pooling:**
NeonDB provides built-in connection pooling. Use the pooled connection string for serverless environments.

**Branching:**
NeonDB supports database branching:
- Create branches for preview deployments
- Automatically create database branches per pull request
- Configure in your CI/CD pipeline

**Monitoring:**
- Access database metrics in NeonDB dashboard
- Set up alerts for connection limits
- Monitor query performance

### Supabase Deployment

**Prerequisites:**
- Supabase account (sign up at [supabase.com](https://supabase.com))

**Steps:**

1. Create a new project in Supabase dashboard
2. Note your project URL and anon key
3. Set environment variables in your deployment platform:
   - `VITE_SUPABASE_URL=your-project-url`
   - `VITE_SUPABASE_ANON_KEY=your-anon-key`
   - `DATABASE_URL=your-connection-string` (for Prisma)

**Database Schema Setup:**

1. Generate Prisma client:
```bash
npx prisma generate
```

2. Push schema to database:
```bash
npx prisma db push
```

**Row Level Security (RLS):**
Enable RLS policies through Supabase dashboard:
1. Navigate to Authentication → Policies
2. Create policies for each table
3. Test policies using the SQL editor

**Storage Setup:**
If using Supabase Storage:
1. Create storage buckets in dashboard
2. Configure bucket policies
3. Set CORS policies if needed

**Realtime Setup:**
Enable realtime for tables:
1. Go to Database → Replication
2. Enable replication for tables
3. Configure realtime listeners in your application

**Edge Functions (Optional):**
Deploy edge functions for server-side logic:
```bash
supabase functions deploy function-name
```

**Monitoring:**
- Access logs in Supabase dashboard
- Monitor API usage and database performance
- Set up error tracking

## Environment Variables

### Core Environment Variables

Required for all deployments:

```env
NODE_ENV=production
VITE_APP_URL=https://your-domain.com
```

### Database Environment Variables

**For NeonDB:**
```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname
```

**For Supabase:**
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### Better Auth Environment Variables

```env
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=https://your-domain.com
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### Email Service (Resend)

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
VITE_FROM_EMAIL=noreply@yourdomain.com
```

Get your API key from [resend.com/api-keys](https://resend.com/api-keys)

### Stripe Payment Variables

```env
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

**Setup:**
1. Get keys from Stripe Dashboard
2. Set up webhook endpoint at `/api/webhooks/stripe`
3. Configure webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### PayPal Payment Variables

```env
PAYPAL_CLIENT_ID=xxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=xxxxxxxxxxxx
PAYPAL_MODE=live
```

**Setup:**
1. Create app in PayPal Developer Dashboard
2. Get credentials from app settings
3. Use `sandbox` mode for testing, `live` for production

### OpenRouter AI Variables

```env
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxx
```

Get your API key from [openrouter.ai/keys](https://openrouter.ai/keys)

### OAuth Provider Variables (Google)

```env
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxx
```

**Setup:**
1. Create project in Google Cloud Console
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`

### OAuth Provider Variables (GitHub)

```env
GITHUB_CLIENT_ID=xxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxx
```

**Setup:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set callback URL: `https://your-domain.com/api/auth/callback/github`

### OAuth Provider Variables (Apple)

```env
APPLE_CLIENT_ID=com.yourapp.service
APPLE_TEAM_ID=xxxxxxxxxxxx
APPLE_KEY_ID=xxxxxxxxxxxx
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----"
```

**Setup:**
1. Create Service ID in Apple Developer Account
2. Configure Sign in with Apple
3. Generate private key
4. Set return URL: `https://your-domain.com/api/auth/callback/apple`

## Authentication Setup

### Authentication Setup (Better Auth)

**Database Schema:**
Better Auth creates necessary tables automatically on first run. Ensure your database is accessible.

**Email Provider Setup:**
Configure Resend for email authentication:
1. Verify your domain in Resend dashboard
2. Add SPF and DKIM records to your DNS
3. Test email delivery

**Magic Link Setup:**
Magic links are automatically configured if enabled. Ensure:
- `BETTER_AUTH_URL` is set to your production domain
- Email provider is configured correctly

**Two-Factor Authentication:**
2FA tables are created automatically. Users can enable in their account settings.

**Session Management:**
- Sessions are stored in database
- Default expiration: 30 days
- Refresh tokens enabled by default

**Passkey Setup:**
Passkeys require HTTPS:
- Ensure your domain has valid SSL certificate
- Passkeys stored securely in database
- Works with biometric authentication

### Authentication Setup (Supabase Auth)

**Email Templates:**
Customize email templates in Supabase dashboard:
1. Navigate to Authentication → Email Templates
2. Customize confirmation, magic link, and password reset emails
3. Add your branding and domain

**OAuth Providers:**
Configure in Supabase dashboard under Authentication → Providers:
- Add client IDs and secrets
- Set redirect URLs
- Enable providers

**Email Confirmation:**
Configure email confirmation settings:
- Require email confirmation for new signups
- Set confirmation token expiration
- Configure redirect URLs

**Password Requirements:**
Set password policies:
- Minimum length
- Require special characters
- Password history

**Session Management:**
- Sessions managed by Supabase
- Configure JWT expiry
- Set up refresh token rotation

### Organization Setup (Better Auth)

**Super Admin Creation:**
Create your first super admin using the CLI:

```bash
npm run create-super-admin
```

Or manually insert into database:
```sql
INSERT INTO users (email, role)
VALUES ('admin@yourdomain.com', 'super_admin');
```

**Organization Creation:**
Super admins can create organizations through the admin panel or API.

**Role Assignment:**
- Super admins: Full system access
- Org admins: Manage their organization and members
- Org members: Read access to organization data

**RLS Policies:**
Ensure Row Level Security policies are enabled for organization tables:
- Users can only see their organization data
- Org admins can manage org members
- Super admins have full access

## Post-Deployment Tasks

### Stripe Webhook Configuration

**Create Webhook Endpoint:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

4. Copy the webhook signing secret
5. Add to environment variables as `STRIPE_WEBHOOK_SECRET`

**Test Webhook:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Webhook Handler:**
Verify webhook signatures in your handler to ensure security.

### PayPal Webhook Configuration

**Create Webhook:**
1. Go to PayPal Developer Dashboard
2. Select your app
3. Add webhook URL: `https://your-domain.com/api/webhooks/paypal`
4. Select events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`

**Verify Webhooks:**
PayPal provides webhook signature verification. Implement in your handler.

### Health Checks (Railway)

**Configure Health Check Endpoint:**
Create endpoint at `/health` or `/api/health`:

```typescript
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
```

**Railway Configuration:**
Railway automatically detects health checks. Configure in `railway.json`:

```json
{
  "deploy": {
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

### Domain and SSL Setup (Vercel)

**Add Custom Domain:**
1. Go to project settings in Vercel
2. Navigate to Domains tab
3. Add your domain

**DNS Configuration:**
Add these records to your DNS provider:
- A record: `76.76.21.21`
- AAAA record: `2606:4700:4700::1111`

Or use CNAME:
- CNAME: `cname.vercel-dns.com`

**SSL Certificate:**
- Vercel automatically provisions SSL certificates
- Certificates auto-renew
- HTTPS enforced by default

**Redirect www to apex:**
Configure in Vercel dashboard or use redirect in `vercel.json`

### Domain and SSL Setup (Railway)

**Add Custom Domain:**
1. Go to your project settings
2. Click on Domains
3. Add custom domain

**DNS Configuration:**
Point your domain to Railway:
- CNAME record: `your-app.up.railway.app`
- Or use A records provided by Railway

**SSL Certificate:**
- Railway automatically provisions Let's Encrypt certificates
- Auto-renewal enabled
- HTTPS enforced

**Domain Verification:**
May require TXT record verification for some domains

### Email Deliverability (Resend)

**Domain Verification:**
1. Add domain in Resend dashboard
2. Add DNS records:
   - SPF: `v=spf1 include:resend.com ~all`
   - DKIM: Provided by Resend
   - DMARC: `v=DMARC1; p=none;`

**Verification:**
- Verify domain in Resend dashboard
- Test email delivery
- Monitor bounce rates

**Best Practices:**
- Use verified domain for production
- Set up DMARC policy to `quarantine` or `reject` after testing
- Monitor email reputation

### Monitoring and Logging

**Application Monitoring:**
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track user analytics

**Database Monitoring:**
- Monitor connection pool usage
- Set up slow query alerts
- Track database size and growth

**Platform Monitoring:**
- Use platform-provided metrics
- Set up uptime monitoring
- Configure alerts for downtime

**Log Aggregation:**
Consider log aggregation service:
- Logtail
- Datadog
- New Relic

### File Storage Setup (Supabase)

**Create Storage Buckets:**
1. Go to Supabase dashboard → Storage
2. Create new bucket
3. Configure bucket as public or private

**Bucket Policies:**
Set up access policies:
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-bucket');

CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-uploads');
```

**CORS Configuration:**
Configure CORS if accessing from different domain:
1. Go to Storage → Configuration
2. Add allowed origins
3. Set allowed methods

**CDN:**
Supabase Storage includes CDN. Use transformation parameters for images:
```
https://xxx.supabase.co/storage/v1/object/public/bucket/image.jpg?width=500
```

### Realtime Setup (Supabase)

**Enable Replication:**
1. Go to Database → Replication
2. Enable for tables you want realtime updates
3. Configure publication settings

**Security:**
Set up RLS policies for realtime:
```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their messages"
ON messages FOR SELECT
USING (auth.uid() = user_id);
```

**Client Configuration:**
Realtime subscriptions are automatic with Supabase client. Ensure proper channel naming and filtering.

**Monitoring:**
- Monitor connection count
- Check message delivery latency
- Set up alerts for connection issues

### Post-Deployment Verification

**Checklist:**
- [ ] Application loads correctly at production URL
- [ ] Database migrations applied successfully
- [ ] All environment variables set correctly
- [ ] Authentication flow works (sign up, login, logout)
- [ ] Email delivery working
- [ ] Payment processing functional (if applicable)
- [ ] File uploads working (if applicable)
- [ ] API endpoints responding correctly
- [ ] SSL certificate valid and auto-renewing
- [ ] Monitoring and logging configured
- [ ] Error tracking set up
- [ ] Backups configured
- [ ] Domain DNS propagated

**Load Testing:**
Test your application under load:
```bash
npm install -g artillery
artillery quick --count 100 --num 10 https://your-domain.com
```

**Security Scan:**
- Run security audit: `npm audit`
- Check for exposed secrets
- Verify CORS settings
- Test rate limiting
- Verify CSP headers
