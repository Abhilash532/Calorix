import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface AmbientItem {
  id: string;
  emoji: string;
  name: string;
  color: 'red' | 'green' | 'orange' | 'emerald' | 'yellow' | 'blue' | 'slate' | 'rose' | 'amber';
  tip: string;
  scale: number;
  xPct: number;
  yPct: number;
  parallaxSpeed: number;
  floatDuration: number;
  blur: boolean;
}

const ITEMS: AmbientItem[] = [
  {
    id: 'apple',
    emoji: '🍎',
    name: 'Red Apple',
    color: 'red',
    tip: 'An apple is 85% water, rich in pectin fiber to satisfy sugar cravings with just ~95 kcal!',
    scale: 1.15,
    xPct: 8,
    yPct: 18,
    parallaxSpeed: 1.2,
    floatDuration: 7,
    blur: false,
  },
  {
    id: 'avocado',
    emoji: '🥑',
    name: 'Creamy Avocado',
    color: 'green',
    tip: 'Loaded with monounsaturated fats & potassium that support stable energy and metabolic balance.',
    scale: 1.25,
    xPct: 88,
    yPct: 15,
    parallaxSpeed: 1.4,
    floatDuration: 8.5,
    blur: false,
  },
  {
    id: 'flame',
    emoji: '🔥',
    name: 'Metabolic Fire',
    color: 'orange',
    tip: 'Burning calories! Muscle is high-density active tissue that consumes energy 24/7, even at rest.',
    scale: 1.3,
    xPct: 12,
    yPct: 62,
    parallaxSpeed: 1.6,
    floatDuration: 6.5,
    blur: false,
  },
  {
    id: 'broccoli',
    emoji: '🥦',
    name: 'Power Broccoli',
    color: 'emerald',
    tip: 'Brimming with immune-boosting Vitamin C, minerals, and digestive fiber. Only 35 calories per cup!',
    scale: 1.1,
    xPct: 84,
    yPct: 45,
    parallaxSpeed: 1.1,
    floatDuration: 9,
    blur: false,
  },
  {
    id: 'banana',
    emoji: '🍌',
    name: 'Golden Banana',
    color: 'yellow',
    tip: 'Packed with quick, digestible carbs and potassium to power up muscles before or after heavy workouts.',
    scale: 1.2,
    xPct: 18,
    yPct: 84,
    parallaxSpeed: 1.3,
    floatDuration: 7.8,
    blur: false,
  },
  {
    id: 'droplet',
    emoji: '💧',
    name: 'Pure Hydration',
    color: 'blue',
    tip: 'Drinking 500ml water can elevate your baseline metabolic rate by 30% for over an hour!',
    scale: 1.35,
    xPct: 45,
    yPct: 8,
    parallaxSpeed: 1.5,
    floatDuration: 6,
    blur: false,
  },
  {
    id: 'dumbbell',
    emoji: '🏋️',
    name: 'Muscle Tonus',
    color: 'slate',
    tip: 'Strength training boosts lean muscle mass, triggering continuous calorie burn throughout the day.',
    scale: 1.2,
    xPct: 76,
    yPct: 80,
    parallaxSpeed: 1.2,
    floatDuration: 8,
    blur: false,
  },
  {
    id: 'cherry',
    emoji: '🍒',
    name: 'Sweet Cherries',
    color: 'rose',
    tip: 'Full of sleep-inducing melatonin. High-quality restorative sleep is critical for dynamic lean muscle recovery.',
    scale: 0.95,
    xPct: 4,
    yPct: 44,
    parallaxSpeed: 0.9,
    floatDuration: 10,
    blur: true,
  },
  {
    id: 'oats',
    emoji: '🥣',
    name: 'Fiber Oats',
    color: 'amber',
    tip: 'Slow-digesting complex carbs that stabilize blood insulin & prevent sudden hunger spikes.',
    scale: 1.05,
    xPct: 42,
    yPct: 88,
    parallaxSpeed: 1.05,
    floatDuration: 9.5,
    blur: true,
  },
];

export const FloatingHealthAmbient: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTip, setActiveTip] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Range from -0.5 to 0.5
      setMousePos({
        x: (e.clientX / innerWidth) - 0.5,
        y: (e.clientY / innerHeight) - 0.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const colorClasses = {
    red: {
      bg: 'bg-red-500/10 border-red-500/30 shadow-red-500/10 text-red-500',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]',
      accent: 'border-red-400',
    },
    green: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/10 text-emerald-500',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
      accent: 'border-emerald-400',
    },
    orange: {
      bg: 'bg-orange-500/10 border-orange-500/30 shadow-orange-500/10 text-orange-500',
      glow: 'shadow-[0_0_30px_rgba(249,115,22,0.4)]',
      accent: 'border-orange-400',
    },
    emerald: {
      bg: 'bg-green-500/10 border-green-500/30 shadow-green-500/10 text-green-500',
      glow: 'shadow-[0_0_30px_rgba(34,197,94,0.4)]',
      accent: 'border-green-400',
    },
    yellow: {
      bg: 'bg-yellow-500/10 border-yellow-500/30 shadow-yellow-500/10 text-yellow-600',
      glow: 'shadow-[0_0_30px_rgba(234,179,8,0.4)]',
      accent: 'border-yellow-400',
    },
    blue: {
      bg: 'bg-sky-500/10 border-sky-500/30 shadow-sky-500/10 text-sky-500',
      glow: 'shadow-[0_0_30px_rgba(14,165,233,0.4)]',
      accent: 'border-sky-400',
    },
    slate: {
      bg: 'bg-slate-500/10 border-slate-500/30 shadow-slate-500/10 text-slate-600',
      glow: 'shadow-[0_0_30px_rgba(100,116,139,0.4)]',
      accent: 'border-slate-400',
    },
    rose: {
      bg: 'bg-rose-500/10 border-rose-500/30 shadow-rose-500/10 text-rose-500',
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.4)]',
      accent: 'border-rose-400',
    },
    amber: {
      bg: 'bg-amber-500/10 border-amber-500/30 shadow-amber-500/10 text-amber-600',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.4)]',
      accent: 'border-amber-400',
    },
  };

  return (
    <div 
      ref={containerRef}
      className="pointer-events-none absolute inset-0 w-full min-h-screen overflow-hidden z-0"
      id="floating-health-ambient-field"
    >
      {/* Decorative depth lights/ambience */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-300/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-orange-300/10 rounded-full blur-[120px] pointer-events-none" />

      {ITEMS.map((item) => {
        // Compute parallax displacement
        const posX = mousePos.x * item.parallaxSpeed * 40;
        const posY = mousePos.y * item.parallaxSpeed * 40;
        const isHovered = hoveredId === item.id;

        return (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: `${item.xPct}%`,
              top: `${item.yPct}%`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            <motion.div
              // Slow 3D translation & floating animation cycle
              animate={{
                y: [0, -12, 0],
                rotateX: isHovered ? [0, 15, -15, 0] : [0, 8, -8, 0],
                rotateY: isHovered ? [0, 15, -15, 0] : [0, 8, -8, 0],
                z: isHovered ? 50 : 0,
              }}
              transition={{
                y: {
                  duration: item.floatDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                rotateX: {
                  duration: item.floatDuration * 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                rotateY: {
                  duration: item.floatDuration * 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              // Interaction
              drag
              dragConstraints={containerRef}
              dragElastic={0.4}
              dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
              whileHover={{ 
                scale: item.scale * 1.12, 
                cursor: 'grab', 
                zIndex: 50,
              }}
              whileTap={{ scale: item.scale * 0.95, cursor: 'grabbing' }}
              onHoverStart={() => {
                setHoveredId(item.id);
                setActiveTip(item.tip);
              }}
              onHoverEnd={() => {
                setHoveredId(null);
                setActiveTip(null);
              }}
              style={{
                x: posX,
                y: posY,
                scale: item.scale,
              }}
              className="pointer-events-auto select-none"
            >
              {/* Premium 3D Circular Glassmorphic Bubble */}
              <div 
                className={`
                  relative flex items-center justify-center 
                  w-14 h-14 md:w-16 md:h-16 rounded-full 
                  border backdrop-blur-[6px] 
                  transition-shadow duration-300 ease-out
                  ${colorClasses[item.color].bg}
                  ${isHovered ? colorClasses[item.color].glow : 'shadow-lg shadow-black/5'}
                  ${item.blur && !isHovered ? 'blur-[0.5px] opacity-80' : 'opacity-100'}
                `}
                style={{
                  perspective: 1000,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Glossy Reflection overlay */}
                <span className="absolute inset-x-0 top-1 h-1/2 bg-white/20 rounded-t-full filter blur-[1px] opacity-70 pointer-events-none" />

                {/* 3D Inner shadow gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />

                {/* Main Emoji (3D Pop-out) */}
                <span 
                  className="text-2xl md:text-3xl selection:bg-transparent transform transition-transform duration-300 hover:rotate-12"
                  style={{
                    transform: 'translateZ(10px)',
                  }}
                >
                  {item.emoji}
                </span>

                {/* Sparkling dust on hover */}
                {isHovered && (
                  <span className="absolute -top-1 -right-1 text-yellow-400 animate-bounce pointer-events-none">
                    <Sparkles size={12} className="fill-yellow-400" />
                  </span>
                )}
              </div>

              {/* Dynamic Health Tip Overlay Balloon */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.8 }}
                    animate={{ opacity: 1, y: -8, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 md:w-56 p-3 bg-white/95 backdrop-blur-md border border-black/5 rounded-2xl shadow-xl z-50 pointer-events-none text-stone-800"
                  >
                    <div className="flex gap-1.5 items-center mb-1">
                      <span className="text-sm">{item.emoji}</span>
                      <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-stone-900">{item.name} Tip</h4>
                    </div>
                    <p className="text-[10px] leading-relaxed text-stone-600 font-semibold">{item.tip}</p>
                    
                    {/* Small speech bubble tick */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white/95" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
