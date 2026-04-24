/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types.ts';

interface MusicPlayerProps {
  tracks: Track[];
}

export default function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1));
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="music-player" className="w-full h-full bg-[#111] border border-white/10 rounded-xl p-5 flex flex-col items-stretch relative overflow-hidden group">
      {/* Indicator */}
      <h2 className="text-xs font-bold text-neon-magenta uppercase tracking-widest mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse shadow-[0_0_5px_#ff00ff]" />
        Stream Active
      </h2>
      
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="relative z-10 flex flex-col flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="aspect-square w-full bg-gradient-to-br from-[#1a1a1a] to-[#222] border border-white/5 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#ff00ff_0%,_transparent_70%)]" />
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover mix-blend-overlay opacity-30"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-28 h-28 border-4 border-neon-magenta/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,0,255,0.2)] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                 <div className="w-14 h-14 bg-neon-magenta rounded-full blur-[4px] opacity-60 animate-pulse" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-1 mb-6">
          <p className="font-bold text-lg leading-tight truncate text-white">{currentTrack.title}</p>
          <p className="text-white/40 text-xs italic font-mono uppercase tracking-wider">{currentTrack.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between text-white/40">
            <button onClick={handlePrev} className="hover:text-neon-cyan transition-colors cursor-pointer p-2"><SkipBack size={20} /></button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 bg-neon-cyan text-black rounded-full flex items-center justify-center shadow-[0_0_15px_#00f3ff] hover:scale-105 transition-transform cursor-pointer"
            >
              {isPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" className="ml-1" size={20} />}
            </button>
            <button onClick={handleNext} className="hover:text-neon-cyan transition-colors cursor-pointer p-2"><SkipForward size={20} /></button>
          </div>
          
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-neon-cyan shadow-[0_0_8px_#00f3ff]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-white/20 tracking-[0.2em] uppercase">
            <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '00:00'}</span>
            <span className="text-neon-cyan/50">{formatTime(currentTrack.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
