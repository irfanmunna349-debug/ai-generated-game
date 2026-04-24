/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from './types.ts';

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'AI Virtuoso',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&h=300&auto=format&fit=crop',
    duration: 184,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Neon Slither',
    artist: 'Glitch Master',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=300&auto=format&fit=crop',
    duration: 215,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Synth Dreams',
    artist: 'Neural Wave',
    coverUrl: 'https://images.unsplash.com/photo-1633545505437-01968ecf7596?q=80&w=300&h=300&auto=format&fit=crop',
    duration: 198,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 60;
export const SPEED_INCREMENT = 2;
