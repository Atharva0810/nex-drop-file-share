# NexDrop - Fast File Sharing Platform

A production-ready, real-time file-sharing platform built for the IIT Bombay Hackathon. Share files instantly with your team with zero authentication friction and lightning-fast synchronization.

## Features

- **Instant Room Creation**: Create rooms with a single click - no signup required
- **Real-time Synchronization**: Live updates as files are uploaded/downloaded using Socket.IO
- **Drag & Drop Upload**: Intuitive file upload with progress tracking
- **Member Tracking**: See who's in your room in real-time
- **Share Links**: Generate and share invite links with team members
- **Modern UI**: Dark theme with smooth animations and responsive design
- **Zero Auth (MVP)**: Perfect for hackathons - join any room instantly

## Tech Stack

### Frontend
- **Next.js 16** with React 19 and Turbopack
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Socket.IO Client** for real-time updates
- **Lucide Icons** for UI elements

### Backend
- **Fastify** (lightweight, high-performance Node.js framework)
- **Socket.IO** for WebSocket connections
- **In-Memory Storage** (perfect for MVP/demo)
- **Joi** for request validation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone/setup the project
cd nexdrop

# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend && npm install
cd ..

# Start backend server
cd backend && npm start

# In a new terminal, start frontend dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

### Backend (.env)
```
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Project Structure

```
nexdrop/
├── app/                           # Next.js app directory
│   ├── page.tsx                  # Landing page
│   ├── dashboard/                # Dashboard page
│   ├── room/[id]/                # Room detail page
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css               # Global styles & design tokens
│
├── components/                    # Reusable React components
│   ├── Header.tsx                # Navigation header
│   ├── RoomCard.tsx              # Room listing card
│   ├── CreateRoomModal.tsx       # Create room form
│   ├── JoinRoomModal.tsx         # Join room form
│   ├── FileUploader.tsx          # Drag-drop file upload
│   └── FileList.tsx              # File list with actions
│
├── lib/                           # Utilities and services
│   ├── services/
│   │   ├── api.ts               # API client setup
│   │   └── socket-client.ts     # Socket.IO initialization
│   ├── hooks/
│   │   └── useSocket.ts         # Custom Socket hook
│   └── context/
│       └── RoomContext.tsx       # Shared room state
│
└── backend/                       # Fastify backend
    ├── src/
    │   ├── server.js            # Main Fastify server
    │   ├── utils/
    │   │   ├── storage.js       # In-memory storage manager
    │   │   └── validators.js    # Request validators
    │   └── .env                 # Backend config
    └── package.json
```

## API Endpoints

### Rooms
- `POST /api/rooms` - Create a new room
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room details
- `PUT /api/rooms/:id` - Update room settings
- `DELETE /api/rooms/:id` - Delete room

### Files
- `POST /api/rooms/:id/files` - Upload file
- `GET /api/rooms/:id/files` - List files
- `GET /api/rooms/:id/files/:fileId` - Download file
- `DELETE /api/rooms/:id/files/:fileId` - Delete file

### Members
- `GET /api/rooms/:id/members` - Get room members
- `POST /api/rooms/:id/members` - Add member
- `DELETE /api/rooms/:id/members/:memberId` - Remove member

## Socket.IO Events

### Client → Server
- `room:join` - Join a room
- `room:leave` - Leave a room
- `file:uploaded` - Notify file upload
- `file:deleted` - Notify file deletion

### Server → Client
- `member:joined` - New member joined
- `member:left` - Member left
- `file:added` - File added to room
- `file:removed` - File removed
- `room:updated` - Room settings changed

## Design System

### Colors
- **Primary**: Vivid Cyan (from primary token)
- **Accent**: Warm Orange (from accent token)
- **Background**: Deep Navy (#1a1a2e)
- **Card**: Slightly lighter navy (#252d42)
- **Text**: Bright white for contrast

### Typography
- **Headings**: Geist (Sans-serif)
- **Body**: Geist (Sans-serif)
- **Monospace**: Geist Mono

## Performance Optimizations

- **Next.js Turbopack**: 10x faster builds
- **React Compiler** (stable in Next.js 16)
- **Socket.IO namespaces** for efficient message routing
- **Motion components** for smooth animations with GPU acceleration
- **In-memory storage** for instant file operations

## Deployment

### Frontend (Vercel)
```bash
# Deploy with Vercel CLI
vercel deploy
```

### Backend (Render/Railway)
1. Push backend folder to GitHub
2. Connect to Render.com or Railway
3. Set environment variables
4. Deploy Node.js service

### Docker (Optional)
```dockerfile
# Backend Dockerfile
FROM node:18
WORKDIR /app
COPY backend .
RUN npm install
EXPOSE 4000
CMD ["npm", "start"]
```

## Known Limitations (MVP)

- **In-Memory Storage**: Files lost on server restart
- **No Authentication**: Great for MVP, add JWT later
- **No File Size Limits**: Handle with nginx/load balancer in production
- **Single Server**: No clustering/horizontal scaling yet
- **No Database**: Upgrade to MongoDB/PostgreSQL for persistence

## Future Enhancements

- User authentication (JWT + OAuth)
- Database persistence (MongoDB/PostgreSQL)
- S3/Cloud storage integration
- File compression
- Batch download as ZIP
- QR code room sharing
- Mobile app (React Native)
- Rate limiting & abuse prevention
- Room expiration & cleanup
- File previews & thumbnails

## Testing

### Manual Testing Checklist
- [x] Landing page loads correctly
- [x] Dashboard shows rooms
- [x] Create room modal works
- [x] Room join flow with name input
- [x] Members list updates in real-time
- [ ] File upload with progress
- [ ] File download
- [ ] File deletion
- [ ] Share link copy
- [ ] Mobile responsive

## Troubleshooting

### Backend won't start
```bash
# Check if port 4000 is in use
lsof -i :4000

# Kill existing process
kill -9 <PID>
```

### Socket.IO connection issues
- Ensure backend is running on port 4000
- Check NEXT_PUBLIC_BACKEND_URL in .env.local
- Clear browser cache and restart dev server

### File upload not working
- Check backend is accepting POST requests
- Verify file size doesn't exceed limits
- Check network tab in DevTools

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

MIT - Built for IIT Bombay Hackathon 2024

## Support

For issues or questions:
1. Check GitHub Issues
2. Review troubleshooting section
3. Open new issue with reproduction steps

---

**Built with ❤️ for the IIT Bombay Hackathon**
