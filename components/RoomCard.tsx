'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, FileStack, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  id: string;
  name: string;
  members: number;
  fileCount: number;
}

export function RoomCard({ id, name, members, fileCount }: RoomCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/room/${id}`}>
        <div className="h-full p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-balance line-clamp-2">
                {name}
              </h3>
            </div>
            <motion.div
              whileHover={{ x: 4 }}
              className="ml-2"
            >
              <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition" />
            </motion.div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{members} member{members !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileStack className="w-4 h-4" />
              <span>{fileCount} file{fileCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
