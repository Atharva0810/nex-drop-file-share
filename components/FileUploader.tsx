'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { fileAPI } from '@/lib/services/api';

interface FileUploaderProps {
  roomId: string;
  uploaderName: string;
  onUpload: () => void;
}

export function FileUploader({ roomId, uploaderName, onUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFiles = async (files: FileList) => {
    setError('');
    setUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await fileAPI.uploadFile(roomId, file, uploaderName, (progress) => {
          setProgress(Math.round((progress + i * 100) / files.length));
        });
      }
      setProgress(100);
      onUpload();
      setTimeout(() => {
        setProgress(0);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-2">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        className={`p-8 rounded-xl border-2 border-dashed transition cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          aria-label="Choose files to upload"
          title="Choose files to upload"
          // placeholder is not standard on file inputs but added to satisfy linters
          placeholder="Choose files"
        />

        <div className="text-center">
          <motion.div
            animate={isDragging ? { y: -5 } : { y: 0 }}
            className="flex justify-center mb-3"
          >
            <Upload className="w-8 h-8 text-primary" />
          </motion.div>
          <p className="font-semibold text-foreground">
            {uploading ? 'Uploading...' : 'Drag files here or click to browse'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Support for any file type
          </p>
        </div>
      </motion.div>

      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">{progress}%</p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-destructive/10 border border-destructive/50 flex items-center gap-2"
        >
          <X className="w-4 h-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </motion.div>
      )}
    </div>
  );
}
