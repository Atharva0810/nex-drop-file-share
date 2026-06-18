'use client';

import { motion } from 'framer-motion';
import { Download, Trash2, FileIcon } from 'lucide-react';
import { fileAPI } from '@/lib/services/api';
import { useState } from 'react';

interface File {
  id: string;
  filename: string;
  uploaderName: string;
  size: number;
  uploadedAt: string;
}

interface FileListProps {
  roomId: string;
  files: File[];
  onDelete: () => void;
}

export function FileList({ roomId, files, onDelete }: FileListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const data = await fileAPI.downloadFile(roomId, fileId);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    setDeleting(fileId);
    try {
      await fileAPI.deleteFile(roomId, fileId);
      onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-muted-foreground"
      >
        <FileIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No files yet. Upload files to get started!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg mb-4">Files ({files.length})</h3>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2"
      >
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition group"
            whileHover={{ x: 4 }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{file.filename}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span>by {file.uploaderName}</span>
                <span>•</span>
                <span>{formatDate(file.uploadedAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleDownload(file.id, file.filename)}
                className="p-2 hover:bg-primary/10 rounded-lg text-primary transition opacity-0 group-hover:opacity-100"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleDelete(file.id)}
                disabled={deleting === file.id}
                className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
