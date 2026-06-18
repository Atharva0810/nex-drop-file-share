# NexDrop - Quick Start Guide

Get NexDrop running in 2 minutes flat!

## Step 1: Install Dependencies

```bash
# Frontend dependencies
pnpm install

# Backend dependencies
cd backend
npm install
cd ..
```

## Step 2: Start Services

### Terminal 1 - Backend Server
```bash
cd backend
npm start
```
You should see: `Server running at http://0.0.0.0:4000`

### Terminal 2 - Frontend Dev Server
```bash
pnpm dev
```
You should see: `✓ Ready in XXXms`

## Step 3: Open in Browser

Navigate to: **http://localhost:3000**

## Quick Usage Flow

### 1. Landing Page
- Click "Get Started" or "Start Sharing Now"
- View features overview

### 2. Dashboard
- Click "Create Room" button
- Enter room name: "Test Room"
- Click "Create"

### 3. Room Page
- Click on your new room
- Enter your name: "Test User"
- Click "Join Room"

### 4. Share Files
- Drag files into the upload zone OR click to browse
- Files appear in the list
- Click download icon to download
- Click trash icon to delete

### 5. Share with Others
- Click "Share" button
- Copy the invite link
- Send to friends/teammates
- They can join from the same link

## Keyboard Shortcuts

- `Tab` - Navigate between elements
- `Enter` - Submit forms
- `Esc` - Close modals

## Tips & Tricks

1. **Multiple Users**: Open app in multiple browser tabs/windows to simulate multiple users
2. **Test Socket.IO**: Upload a file in one tab, watch it appear in another in real-time
3. **Performance**: Check DevTools Network tab to see Socket.IO messages
4. **Dark Theme**: Already applied by default

## Common Issues & Fixes

### "Cannot GET /api/rooms"
✗ Backend not running  
✓ Make sure backend is started in Terminal 1

### "Network Error" in modals
✗ NEXT_PUBLIC_BACKEND_URL might be wrong  
✓ Check .env.local has `NEXT_PUBLIC_BACKEND_URL=http://localhost:4000`

### Page keeps loading
✗ Socket.IO connection failed  
✓ Restart both servers (Ctrl+C in both terminals)

### Port already in use
```bash
# Kill process on port 4000
kill -9 $(lsof -t -i:4000)

# Kill process on port 3000  
kill -9 $(lsof -t -i:3000)
```

## Next Steps

1. **Test Real-time**: Open room in 2 tabs, upload file in one, see it appear in both
2. **Test Sharing**: Copy room link, open in private/incognito window
3. **Check Responsiveness**: Resize browser or open on phone (use `pnpm dev` with `--host`)
4. **Read Features**: Check main README.md for full feature list

## Deployment

### Deploy Frontend to Vercel
```bash
# Push to GitHub first
git add .
git commit -m "Initial NexDrop"
git push origin main

# Then deploy
vercel
```

### Deploy Backend to Railway/Render
1. Connect backend folder to Railway/Render
2. Set environment variables
3. Deploy!

## File Structure Quick Reference

```
nexdrop/
├── app/                  # Frontend pages
├── components/           # React components  
├── lib/                 # Services & hooks
├── backend/             # Fastify server
├── public/              # Static files
├── .env.local           # Frontend config
└── README.md            # Full documentation
```

## Performance Tips

- Check Network tab to see Socket.IO messages
- Use React DevTools to see component renders
- Monitor backend logs for API calls
- In-memory storage means data resets on backend restart

## Fun Things to Try

1. **Multi-user Upload**: Open 3 tabs, upload files from each
2. **Rapid Updates**: Upload/delete files quickly to test real-time
3. **Large Files**: Test progress bar with larger uploads
4. **Share Link**: Copy room link, try joining from different browser
5. **Mobile**: Use `pnpm dev --host` and open on phone

---

**Happy Hacking! 🚀**

For full docs, see [README.md](./README.md)
