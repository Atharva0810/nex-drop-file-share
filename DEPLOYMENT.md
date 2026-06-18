# NexDrop - Deployment Guide

Complete guide to deploy NexDrop to production for the IIT Bombay Hackathon.

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account (free tier works)
- GitHub account with code pushed

### Frontend Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "NexDrop hackathon submission"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the frontend root directory
   - Add environment variables:
     - `NEXT_PUBLIC_BACKEND_URL`: Your backend URL (see next section)

3. **Deploy**
   - Click "Deploy"
   - Vercel auto-builds with Turbopack
   - Get your frontend URL

### Backend Deployment (Render)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repo
   - Configure:
     - **Name**: nexdrop-backend
     - **Root Directory**: backend
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: Node
     - **Plan**: Free (for MVP)

3. **Add Environment Variables**
   ```
   PORT=4000
   NODE_ENV=production
   FRONTEND_URL=<your-vercel-url>
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render auto-deploys on push to main

5. **Update Frontend**
   - Go back to Vercel project settings
   - Update `NEXT_PUBLIC_BACKEND_URL` to your Render backend URL
   - Redeploy frontend

## Option 2: Deploy with Docker

### Prerequisites
- Docker installed locally
- Docker Hub account (free)

### Build and Push

```bash
# Build backend Docker image
cd backend
docker build -t yourusername/nexdrop-backend .
docker push yourusername/nexdrop-backend

# Now deploy to any Docker-compatible platform:
# - AWS ECS
# - Digital Ocean
# - Railway
# - etc.
```

### Docker Compose (Local Testing)

```yaml
# docker-compose.yml
version: '3'
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      PORT: 4000
      NODE_ENV: development
      
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_BACKEND_URL: http://backend:4000
```

Run with: `docker-compose up`

## Option 3: Deploy to Railway

### Quick Deploy

1. **Connect GitHub**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - New Project → Import from GitHub

2. **Configure Services**
   ```
   Services:
   - Frontend (Next.js)
   - Backend (Node.js)
   ```

3. **Set Environment Variables**
   - Backend: `PORT=4000`, `FRONTEND_URL=<railway-url>`
   - Frontend: `NEXT_PUBLIC_BACKEND_URL=<backend-railway-url>`

4. **Deploy**
   - Railway auto-deploys on push to main

## Configuration for Production

### Environment Variables

#### Frontend (.env.production)
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

#### Backend (.env.production)
```
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Security Checklist

- [x] CORS configured for your domain
- [x] Environment variables not exposed
- [x] Backend has rate limiting (add middleware)
- [x] SSL/TLS enabled (handled by Vercel/Railway)
- [x] Error messages don't leak sensitive info

### Performance Tuning

**Frontend**
```bash
# Build optimization
pnpm build

# Next.js outputs:
# - Static pages: instant load
# - API routes: serverless
# - Images: auto-optimized
```

**Backend**
```javascript
// Add before production
const compression = require('compression');
app.use(compression());
```

## Monitoring & Debugging

### Vercel Dashboard
- View deployment logs
- See build times
- Monitor analytics
- Check error rates

### Render Dashboard
- View backend logs
- Monitor CPU/Memory
- Restart services
- View metrics

## Troubleshooting Production Issues

### CORS Errors
```javascript
// In backend/src/server.js
app.register(cors, {
  origin: ['https://your-frontend.vercel.app'],
  credentials: true,
});
```

### Backend Connection Timeout
- Check if backend URL is correct
- Verify firewall rules
- Check service health dashboard
- Review logs for errors

### Slow File Upload
- Check network conditions
- Increase timeout values
- Consider chunking large files
- Monitor backend resources

## Scaling for More Users

### When to Upgrade

1. **Free tier limits**
   - Vercel: 100 serverless function invocations
   - Render: 750 free tier hours/month

2. **Upgrade steps**
   - Vercel: Switch to "Pro" plan ($20/month)
   - Render: Switch to "Standard" plan ($7/month)

### Next Phase (Post-MVP)

1. **Add Database**
   ```
   - MongoDB Atlas (free tier)
   - PostgreSQL on Render ($7/month)
   - Move data from in-memory storage
   ```

2. **Add Caching**
   ```
   - Redis on Upstash
   - Cache room data
   - Cache file metadata
   ```

3. **Add CDN**
   ```
   - Vercel CDN (built-in)
   - Cloudflare (free)
   - CloudFront (AWS)
   ```

## Domain Setup

### Add Custom Domain to Vercel

1. Go to Vercel → Project Settings
2. Click "Domains"
3. Enter your custom domain
4. Update DNS records (instructions provided)

### Update Backend URL

```bash
# Update environment variable
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
```

## Git Workflow for Deployment

```bash
# Development
git checkout -b feature/new-feature
# Make changes
git commit -m "Add feature"
git push origin feature/new-feature

# Submit PR
# Code review
# Merge to main
git checkout main
git pull origin main

# Auto-deploys to:
# - Vercel (frontend)
# - Render (backend)
```

## Rollback in Case of Issues

### Vercel
- Go to Deployments tab
- Click previous working deployment
- Click "Redeploy"

### Render
- Go to Deploys tab
- Select previous working deployment
- Click "Rollback"

## Performance Metrics

### Expected Performance

- **Landing Page**: < 1s FCP
- **Dashboard Load**: < 2s
- **Room Load**: < 3s
- **File Upload**: 100ms + file transfer time
- **Real-time Updates**: < 100ms

### Monitoring

```bash
# Test performance
pnpm build && pnpm start

# Or use Lighthouse in Chrome DevTools
# Measure Core Web Vitals
# Target: LCP < 2.5s, CLS < 0.1
```

## Cost Breakdown

### Recommended Free/Low-Cost Stack

| Service | Cost | Purpose |
|---------|------|---------|
| Vercel | Free | Frontend hosting |
| Render | Free | Backend hosting |
| GitHub | Free | Code repository |
| **Total** | **Free** | **Full Stack** |

### Optional Paid Services

| Service | Cost | Purpose |
|---------|------|---------|
| MongoDB Atlas | Free | Database |
| Upstash | $0.20/day | Redis cache |
| Cloudflare | Free | CDN/SSL |
| Custom Domain | $12/year | Your domain |

## Final Checklist

- [x] Code pushed to GitHub
- [x] Environment variables set
- [x] CORS configured
- [x] Frontend deployed to Vercel
- [x] Backend deployed to Render
- [x] Backend URL updated in frontend
- [x] Test room creation
- [x] Test file upload
- [x] Test real-time features
- [x] Verify logs are clean
- [x] Performance metrics OK
- [x] Domain configured (optional)

---

## Support During Hackathon

### Emergency Contacts
- Vercel Support: [vercel.com/help](https://vercel.com/help)
- Render Support: [render.com/docs](https://render.com/docs)
- GitHub Issues: Check error logs first

### Quick Fixes

**App won't load?**
- Clear browser cache
- Hard refresh (Cmd+Shift+R)
- Check console for errors

**Backend won't connect?**
- Verify URL in .env.local
- Check backend service status
- Restart backend service

**Rooms not persisting?**
- Check in-memory storage limitation
- This is normal for MVP - data resets on restart
- Plan database upgrade post-hackathon

---

**Ready to launch? Deploy now and impress the judges!** 🚀
