/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import { DUMMY_TRACKS } from './constants.ts';
import { motion } from 'motion/react';
import { Music, Gamepad2, Github } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans p-4 lg:p-8 flex flex-col gap-6 selection:bg-neon-cyan selection:text-black">
      {/* Header Section */}
      <header className="flex justify-between items-center border-b border-neon-cyan/20 pb-6 relative z-10">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-neon-cyan drop-shadow-[0_0_8px_#00f3ff] uppercase italic">
            Neon<span className="text-neon-magenta">Rhythm</span> <span className="text-xs font-mono font-normal opacity-50 ml-2">v1.0.4</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1">Cybernetic Entertainment System // Ready</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="px-4 py-2 bg-[#1a1a1a] border border-neon-green/50 rounded-sm shadow-[0_0_10px_rgba(57,255,20,0.1)]">
            <span className="text-[9px] block text-neon-green leading-none mb-1 font-mono uppercase tracking-widest">SYSTEM STATUS</span>
            <span className="text-xs font-mono font-bold">ENCRYPTED / ACTIVE</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <button className="p-2 text-white/40 hover:text-white transition-colors">
            <Github size={20} />
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 relative z-10">
        {/* Left Column - Music Player Card */}
        <section className="md:col-span-4 lg:col-span-3 flex flex-col items-stretch">
          <MusicPlayer tracks={DUMMY_TRACKS} />
        </section>

        {/* Center Column - Snake Game Card */}
        <section className="md:col-span-8 lg:col-span-6 flex items-stretch">
          <div className="w-full h-full">
            <SnakeGame />
          </div>
        </section>

        {/* Right Column - Secondary Data Bento Section */}
        <section className="md:col-span-12 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {/* Top Scoreboard */}
          <div className="bg-[#111] border border-white/10 rounded-xl p-5 flex flex-col">
            <h2 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-4 flex items-center gap-2">
              <Gamepad2 size={14} />
              Session Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[10px] text-white/40 uppercase font-mono">Real-time Score</span>
                <span className="text-2xl font-black text-neon-green font-mono tracking-tighter" id="pts-display">
                  {localStorage.getItem('snake-high-score')?.padStart(6, '0') || '000,000'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-white/40 font-mono">01. CYBER_PUNK</span>
                  <span className="font-mono text-neon-green italic">12,450</span>
                </div>
                <div className="flex justify-between text-xs items-center opacity-50">
                  <span className="text-white/40 font-mono">02. NEON_GHOST</span>
                  <span className="font-mono">09,820</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls / Info */}
          <div className="bg-[#111] border border-white/10 rounded-xl p-5 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-magenta/5 blur-2xl rounded-full" />
            <div>
              <h2 className="text-xs font-bold text-neon-cyan uppercase tracking-widest mb-4">Input Protocol</h2>
              <div className="grid grid-cols-2 gap-2">
                {['↑', '↓', '←', '→'].map(key => (
                  <div key={key} className="p-2 border border-white/5 bg-white/5 rounded text-center font-mono text-xs text-white/40">
                    {key} DRIVE
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-end justify-between h-12">
               {[20, 40, 90, 60, 30, 75, 45].map((h, i) => (
                 <motion.div 
                   key={i}
                   animate={{ height: [`${h}%`, `${Math.min(100, h + 20)}%`, `${h}%`] }}
                   transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                   className="w-1.5 bg-neon-magenta rounded-t-sm shadow-[0_0_10px_#ff00ff]"
                 />
               ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex justify-between items-center text-[10px] text-white/20 font-mono border-t border-white/5 pt-4">
        <div>CONNECTION: STABLE // LATENCY: 2ms</div>
        <div className="uppercase tracking-[0.3em]">&copy; 2026 NEON_SYNTH_PRODUCTIONS</div>
      </footer>
    </div>
  );
}
