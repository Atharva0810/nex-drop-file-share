'use client';

import { Header } from '@/components/Header';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, Share2, Zap, Users } from 'lucide-react';

export default function Page() {
  const features = [
    {
      icon: Upload,
      title: 'Fast Upload',
      description: 'Share files instantly with real-time progress tracking',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Create rooms and share with anyone via unique links',
    },
    {
      icon: Zap,
      title: 'Real-time',
      description: 'Live updates as files are added or removed from rooms',
    },
    {
      icon: Users,
      title: 'Collaborate',
      description: 'See who&apos;s online and collaborate in real-time',
    },
  ];

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
      transition: { duration: 0.5 },
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent opacity-30" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance leading-tight">
              Share Files at
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
                Lightning Speed
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Create rooms, invite friends, and share files instantly with real-time synchronization. No limits, no login required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="px-8 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition transform hover:scale-105"
              >
                Start Sharing Now
              </Link>
              <button className="px-8 py-3 rounded-lg border border-primary/50 hover:border-primary text-foreground font-semibold transition">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need to share files securely and efficiently</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group p-6 rounded-xl bg-card/50 border border-border hover:border-primary/50 transition"
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center p-8 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <h3 className="text-3xl font-bold mb-4">Ready to Share?</h3>
            <p className="text-muted-foreground mb-6">
              Create a room and start sharing files with your team instantly.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; 2024 NexDrop. Built for IIT Bombay Hackathon.</p>
        </div>
      </footer>
    </main>
  );
}
