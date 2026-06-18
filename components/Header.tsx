'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm font-bold text-primary-foreground">ND</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NexDrop
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition">
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
