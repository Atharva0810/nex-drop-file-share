'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { RoomCard } from '@/components/RoomCard';
import { CreateRoomModal } from '@/components/CreateRoomModal';
import { JoinRoomModal } from '@/components/JoinRoomModal';
import { motion } from 'framer-motion';
import { Plus, LogIn, RefreshCw } from 'lucide-react';
import { roomAPI } from '@/lib/services/api';

interface Room {
  id: string;
  name: string;
  members: any[];
  fileCount: number;
}

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await roomAPI.getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold">Your Rooms</h1>
            <p className="text-muted-foreground mt-2">Create or join a room to start sharing files</p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setJoinOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/50 hover:border-primary hover:bg-primary/10 transition"
            >
              <LogIn className="w-5 h-5" />
              <span>Join</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition"
            >
              <Plus className="w-5 h-5" />
              <span>Create Room</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Refresh Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={loadRooms}
          disabled={loading}
          className="mb-6 flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </motion.button>

        {/* Rooms Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary"
              />
            </div>
          </div>
        ) : rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground mb-6">No rooms yet. Create one to get started!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition"
            >
              <Plus className="w-5 h-5" />
              Create Your First Room
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {rooms.map((room) => (
              <motion.div key={room.id} variants={itemVariants}>
                <RoomCard
                  id={room.id}
                  name={room.name}
                  members={room.members?.length || 0}
                  fileCount={room.fileCount || 0}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <CreateRoomModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={loadRooms}
      />
      <JoinRoomModal
        isOpen={joinOpen}
        onClose={() => setJoinOpen(false)}
      />
    </main>
  );
}
