'use client';

import { useEffect, useCallback, useRef } from 'react';
import { getSocket, isSocketConnected } from '@/lib/services/socket-client';
import { Socket } from 'socket.io-client';

interface UseSocketOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;

    // Connection handlers
    if (options.onConnect) {
      socket.on('connect', options.onConnect);
    }

    if (options.onDisconnect) {
      socket.on('disconnect', options.onDisconnect);
    }

    if (options.onError) {
      socket.on('error', options.onError);
    }

    return () => {
      if (options.onConnect) socket.off('connect', options.onConnect);
      if (options.onDisconnect) socket.off('disconnect', options.onDisconnect);
      if (options.onError) socket.off('error', options.onError);
    };
  }, [options]);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback);
      } else {
        socketRef.current.off(event);
      }
    }
  }, []);

  const joinRoom = useCallback((roomId: string, memberId: string, memberName: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('room:join', { roomId, memberId, memberName });
    }
  }, []);

  const leaveRoom = useCallback((roomId: string, memberId: string, memberName: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('room:leave', { roomId, memberId, memberName });
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected: isSocketConnected(),
    emit,
    on,
    off,
    joinRoom,
    leaveRoom,
  };
}
