import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, RotateCcw } from 'lucide-react';

export const GamePage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Game constants
    const GRAVITY = 0.15;
    const JUMP = -4;
    const PIPE_SPEED = 1.4;
    const PIPE_SPAWN_RATE = 160; // Frames between spawns
    const PIPE_GAP = 150;

    // Load Dave image
    const daveImgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = 'https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif';
        daveImgRef.current = img;

        const savedHighscore = localStorage.getItem('flappy-dave-highscore');
        if (savedHighscore) setHighScore(parseInt(savedHighscore));
    }, []);

    useEffect(() => {
        if (gameState === 'PLAYING' && score > highScore) {
            setHighScore(score);
            localStorage.setItem('flappy-dave-highscore', score.toString());
        }
    }, [score, gameState, highScore]);

    // Game Loop
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let frames = 0;

        // Player state
        const bird = {
            x: 50,
            y: canvas.height / 2,
            velocity: 0,
            radius: 20,
            width: 40,
            height: 40
        };

        // Pipes state
        let pipes: { x: number, topHeight: number, passed: boolean }[] = [];

        const jump = (e?: Event) => {
            if (e) e.preventDefault();
            bird.velocity = JUMP;
        };

        const handleInput = (e: MouseEvent | TouchEvent | KeyboardEvent) => {
            if (e.type === 'keydown' && (e as KeyboardEvent).code !== 'Space') return;
            jump(e);
        };

        window.addEventListener('mousedown', handleInput);
        window.addEventListener('touchstart', handleInput, { passive: false });
        window.addEventListener('keydown', handleInput);

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Background (Sky)
            ctx.fillStyle = '#fdf2f8'; // rose-50
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update & Draw Bird
            bird.velocity += GRAVITY;
            if (bird.velocity > 5) bird.velocity = 5; // Terminal velocity
            bird.y += bird.velocity;

            if (daveImgRef.current && daveImgRef.current.complete) {
                ctx.save();
                ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
                // Rotate based on velocity
                ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.velocity * 0.1))));
                ctx.beginPath();
                ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
                ctx.clip(); // Make it circular
                ctx.drawImage(daveImgRef.current, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
                ctx.restore();
                
                // Add yellow border to make it look like the profile pic
                ctx.save();
                ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
                ctx.beginPath();
                ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
                ctx.strokeStyle = '#fbbf24'; // yellow-400
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.restore();
            } else {
                // Fallback drawing
                ctx.fillStyle = '#fde047';
                ctx.beginPath();
                ctx.arc(bird.x + bird.width / 2, bird.y + bird.height / 2, bird.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Update & Draw Pipes
            if (frames % PIPE_SPAWN_RATE === 0) {
                const minHeight = 50;
                const maxHeight = canvas.height - PIPE_GAP - minHeight;
                const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
                pipes.push({ x: canvas.width, topHeight, passed: false });
            }

            ctx.fillStyle = '#f472b6'; // pink-400 (Pipes)
            
            for (let i = pipes.length - 1; i >= 0; i--) {
                const p = pipes[i];
                p.x -= PIPE_SPEED;

                // Draw Top Pipe
                ctx.fillRect(p.x, 0, 50, p.topHeight);
                // Draw Bottom Pipe
                ctx.fillRect(p.x, p.topHeight + PIPE_GAP, 50, canvas.height - p.topHeight - PIPE_GAP);

                // Collision Detection
                const birdLeft = bird.x;
                const birdRight = bird.x + bird.width;
                const birdTop = bird.y;
                const birdBottom = bird.y + bird.height;

                const pipeLeft = p.x;
                const pipeRight = p.x + 50;
                const topPipeBottom = p.topHeight;
                const bottomPipeTop = p.topHeight + PIPE_GAP;

                if (
                    birdRight > pipeLeft &&
                    birdLeft < pipeRight &&
                    (birdTop < topPipeBottom || birdBottom > bottomPipeTop)
                ) {
                    setGameState('GAMEOVER');
                    return; // Stop rendering
                }

                // Check out of bounds
                if (birdBottom >= canvas.height || birdTop <= 0) {
                    setGameState('GAMEOVER');
                    return;
                }

                // Score update
                if (p.x + 50 < bird.x && !p.passed) {
                    p.passed = true;
                    setScore(s => s + 1);
                }

                // Remove off-screen pipes
                if (p.x + 50 < 0) {
                    pipes.splice(i, 1);
                }
            }

            frames++;
            animationFrameId = requestAnimationFrame(render);
        };

        // Initial jump to prevent falling immediately before user realizes game started
        jump();
        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousedown', handleInput);
            window.removeEventListener('touchstart', handleInput);
            window.removeEventListener('keydown', handleInput);
        };
    }, [gameState]);

    const startGame = () => {
        setScore(0);
        setGameState('PLAYING');
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-rose-50 to-white overflow-hidden">
            <header className="pt-6 px-4 pb-2 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-script text-rose-600 flex items-center gap-2">
                        <Gamepad2 className="text-rose-400" /> Arcade
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-rose-400">Flappy Dave</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-rose-100">
                    <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-rose-300">Score</p>
                        <p className="text-2xl font-black text-rose-500 leading-none">{score}</p>
                    </div>
                    <div className="w-px h-8 bg-rose-100"></div>
                    <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-yellow-400 flex items-center gap-1 justify-center">
                            <Trophy size={10} /> Best
                        </p>
                        <p className="text-2xl font-black text-yellow-500 leading-none">{highScore}</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 w-full flex items-center justify-center p-4 relative pb-20">
                <div className="w-full max-w-sm aspect-[3/4] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-rose-50">
                    <canvas 
                        ref={canvasRef}
                        width={350}
                        height={500}
                        className="w-full h-full object-cover touch-none"
                    />

                    <AnimatePresence>
                        {gameState === 'START' && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
                            >
                                <img src="https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif" alt="Dave" className="w-24 h-24 rounded-full border-4 border-yellow-400 mb-4 shadow-lg" />
                                <h2 className="text-2xl font-black text-rose-800 mb-2">Flappy Dave</h2>
                                <p className="text-sm text-rose-600 mb-8 font-medium">¡Toca la pantalla para saltar y esquiva las tuberías rosas!</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={startGame}
                                    className="bg-rose-500 text-white font-bold text-xl px-10 py-4 rounded-full shadow-lg shadow-rose-300 w-full"
                                >
                                    ¡Jugar!
                                </motion.button>
                            </motion.div>
                        )}

                        {gameState === 'GAMEOVER' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-rose-900/40 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
                            >
                                <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xs">
                                    <h2 className="text-3xl font-black text-rose-600 mb-2 font-script">¡Ups!</h2>
                                    
                                    <div className="flex justify-center gap-6 my-6">
                                        <div className="text-center">
                                            <p className="text-xs uppercase font-bold text-gray-400 mb-1">Puntos</p>
                                            <p className="text-4xl font-black text-rose-500">{score}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs uppercase font-bold text-yellow-400 mb-1 flex items-center gap-1 justify-center"><Trophy size={12}/> Récord</p>
                                            <p className="text-4xl font-black text-yellow-500">{highScore}</p>
                                        </div>
                                    </div>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={startGame}
                                        className="bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg shadow-pink-200 w-full flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={20} /> Volver a intentar
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
