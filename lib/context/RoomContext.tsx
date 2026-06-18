'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface RoomMember {
  id: string;
  name: string;
  joinedAt: string;
}

interface RoomFile {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  uploaderName: string;
  uploadedAt: string;
}

interface Room {
  id: string;
  name: string;
  isPublic: boolean;
  createdAt: string;
  members: RoomMember[];
  fileCount: number;
}

interface RoomContextType {
  currentRoom: Room | null;
  roomMembers: RoomMember[];
  roomFiles: RoomFile[];
  setCurrentRoom: (room: Room | null) => void;
  setRoomMembers: (members: RoomMember[]) => void;
  setRoomFiles: (files: RoomFile[]) => void;
  addMember: (member: RoomMember) => void;
  removeMember: (memberId: string) => void;
  addFile: (file: RoomFile) => void;
  removeFile: (fileId: string) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);
  const [roomFiles, setRoomFiles] = useState<RoomFile[]>([]);

  const addMember = useCallback((member: RoomMember) => {
    setRoomMembers(prev => {
      const exists = prev.find(m => m.id === member.id);
      if (exists) return prev;
      return [...prev, member];
    });
  }, []);

  const removeMember = useCallback((memberId: string) => {
    setRoomMembers(prev => prev.filter(m => m.id !== memberId));
  }, []);

  const addFile = useCallback((file: RoomFile) => {
    setRoomFiles(prev => {
      const exists = prev.find(f => f.id === file.id);
      if (exists) return prev;
      return [...prev, file];
    });
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setRoomFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  return (
    <RoomContext.Provider
      value={{
        currentRoom,
        roomMembers,
        roomFiles,
        setCurrentRoom,
        setRoomMembers,
        setRoomFiles,
        addMember,
        removeMember,
        addFile,
        removeFile,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within RoomProvider');
  }
  return context;
}
