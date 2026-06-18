'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { FileUploader } from '@/components/FileUploader';
import { FileList } from '@/components/FileList';
import { useSocket } from '@/lib/hooks/useSocket';
import { roomAPI, fileAPI } from '@/lib/services/api';
import { Users, Share2, Copy, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface RoomFile {
  id: string;
  filename: string;
  uploaderName: string;
  size: number;
  uploadedAt: string;
}

interface RoomMember {
  id: string;
  name: string;
  joinedAt: string;
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;
  const [roomName, setRoomName] = useState('');
  const [files, setFiles] = useState<RoomFile[]>([]);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [memberId] = useState(() => uuidv4());
  const [memberName, setMemberName] = useState('Anonymous User');
  const [showNameInput, setShowNameInput] = useState(true);

  const { joinRoom, leaveRoom, on, off } = useSocket();

  // Load room data
  const loadRoomData = async () => {
    try {
      const room = await roomAPI.getRoom(roomId);
      setRoomName(room.name);
      setMembers(room.members || []);
      
      const filesList = await fileAPI.getFiles(roomId);
      setFiles(filesList);
    } catch (error) {
      console.error('Failed to load room:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoomData();
  }, [roomId]);

  // Socket.IO handlers
  useEffect(() => {
    if (!showNameInput) {
      joinRoom(roomId, memberId, memberName);

      on('member:joined', (data) => {
        setMembers(data.members);
      });

      on('file:added', (data) => {
        setFiles(data.files);
      });

      on('file:removed', (data) => {
        setFiles(data.files);
      });

      on('member:left', (data) => {
        setMembers(data.members);
      });

      return () => {
        off('member:joined');
        off('file:added');
        off('file:removed');
        off('member:left');
        leaveRoom(roomId, memberId, memberName);
      };
    }
  }, [showNameInput, roomId, memberId, memberName, joinRoom, leaveRoom, on, off]);

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowNameInput(false);
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary inline-block"
          />
        </div>
      </main>
    );
  }

  if (showNameInput) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Enter Your Name</h1>
            <p className="text-muted-foreground mb-8">What should others see you as in the room?</p>
            
            <form onSubmit={handleNameSubmit} className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Your name"
                autoFocus
                className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary outline-none transition text-center"
                minLength={2}
                maxLength={50}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition"
              >
                Join Room
              </motion.button>
            </form>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Room Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 pb-6 border-b border-border"
        >
          <div>
            <h1 className="text-3xl font-bold">{roomName}</h1>
            <p className="text-muted-foreground text-sm mt-1">Room ID: {roomId.slice(0, 8)}...</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={copyShareLink}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
              <FileUploader
                roomId={roomId}
                uploaderName={memberName}
                onUpload={loadRoomData}
              />
            </motion.div>

            {/* Files List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FileList
                roomId={roomId}
                files={files}
                onDelete={loadRoomData}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Members Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Members</h3>
              </div>
              <div className="space-y-2">
                {members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No members yet</p>
                ) : (
                  members.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-background/50"
                    >
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm truncate">
                        {member.name}
                        {member.id === memberId && ' (you)'}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                {members.length} member{members.length !== 1 ? 's' : ''}
              </p>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Quick Info</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Files:</strong> {files.length}
                </p>
                <p>
                  <strong>Total Size:</strong>{' '}
                  {(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
