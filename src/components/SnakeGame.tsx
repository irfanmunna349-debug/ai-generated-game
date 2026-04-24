/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction, GameState } from '../types.ts';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants.ts';
import { RefreshCcw } from 'lucide-react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 5, y: 5 },
    direction: Direction.UP,
    isGameOver: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('snake-high-score') || '0'),
  });

  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      food: { x: 5, y: 5 },
      direction: Direction.UP,
      isGameOver: false,
      score: 0,
      highScore: parseInt(localStorage.getItem('snake-high-score') || '0'),
    });
    setSpeed(INITIAL_SPEED);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState((prev) => {
      const head = { ...prev.snake[0] };

      switch (prev.direction) {
        case Direction.UP: head.y -= 1; break;
        case Direction.DOWN: head.y += 1; break;
        case Direction.LEFT: head.x -= 1; break;
        case Direction.RIGHT: head.x += 1; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prev, isGameOver: true };
      }

      // Check self collision
      if (prev.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      
      // Check food collision
      if (head.x === prev.food.x && head.y === prev.food.y) {
        const newScore = prev.score + 10;
        const newHighScore = Math.max(newScore, prev.highScore);
        if (newHighScore > prev.highScore) {
          localStorage.setItem('snake-high-score', newHighScore.toString());
        }
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: newScore,
          highScore: newHighScore,
        };
      } else {
        newSnake.pop();
        return { ...prev, snake: newSnake };
      }
    });
  }, [gameState.isGameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (gameState.direction !== Direction.DOWN) setGameState(p => ({ ...p, direction: Direction.UP })); break;
        case 'ArrowDown': if (gameState.direction !== Direction.UP) setGameState(p => ({ ...p, direction: Direction.DOWN })); break;
        case 'ArrowLeft': if (gameState.direction !== Direction.RIGHT) setGameState(p => ({ ...p, direction: Direction.LEFT })); break;
        case 'ArrowRight': if (gameState.direction !== Direction.LEFT) setGameState(p => ({ ...p, direction: Direction.RIGHT })); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Bento style)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * scale, 0); ctx.lineTo(i * scale, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * scale); ctx.lineTo(canvas.width, i * scale); ctx.stroke();
    }

    // Draw Food (Magenta)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * scale + scale / 2,
      gameState.food.y * scale + scale / 2,
      scale / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake (Neon Green)
    gameState.snake.forEach((segment, index) => {
      ctx.fillStyle = '#39ff14';
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = '#39ff14';
      
      const padding = index === 0 ? 0 : 2;
      ctx.fillRect(
        segment.x * scale + padding,
        segment.y * scale + padding,
        scale - padding * 2,
        scale - padding * 2
      );
    });
    ctx.shadowBlur = 0;

  }, [gameState]);

  return (
    <div id="snake-game" className="relative group w-full h-full flex flex-col bg-black border-2 border-neon-cyan/50 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,243,255,0.1)]">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00f3ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative flex-1 flex flex-col p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Session Score</p>
            <p className="text-4xl font-black text-neon-green font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">
              {gameState.score.toString().padStart(6, '0')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Matrix Record</p>
            <p className="text-xl font-bold text-white/80 font-mono tracking-tighter">
              {gameState.highScore.toString().padStart(6, '0')}
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center pb-8">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="rounded border border-white/5 shadow-2xl max-w-full h-auto aspect-square"
          />
        </div>

        <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
          <p className="text-[9px] text-white/20 font-mono tracking-[0.4em] uppercase">Use Arrow Keys to Navigate Vector</p>
        </div>

        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20"
            >
              <div className="text-center p-8 border border-neon-magenta/20 bg-neon-magenta/5 rounded-2xl">
                <motion.h3 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-black text-neon-magenta mb-2 uppercase tracking-tighter drop-shadow-[0_0_15px_#ff00ff]"
                >
                  Link Terminated
                </motion.h3>
                <p className="text-xs text-white/40 font-mono mb-8 tracking-widest uppercase">Encryption Error // Sequence Failed</p>
                <button
                  onClick={resetGame}
                  className="w-full py-4 bg-neon-cyan text-black rounded font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                >
                  Restart Matrix
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
