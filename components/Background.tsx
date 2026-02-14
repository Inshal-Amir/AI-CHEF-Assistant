"use client";

import { motion } from "framer-motion";
import { 
  ChefHat, Utensils, UtensilsCrossed, Soup, Sandwich, Pizza, 
  Coffee, Carrot, Apple, Beef, Croissant, Grape, Banana, 
  Cherry, IceCream, Zap
} from "lucide-react";
import { useEffect, useState } from "react";

const FloatingIcon = ({ Icon, delay, initialX, initialY, duration }: { Icon: any, delay: number, initialX: number, initialY: number, duration: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: initialY + "vh", x: initialX + "vw" }}
      animate={{ 
        opacity: [0, 0.3, 0], 
        y: [(initialY) + "vh", (initialY - 30) + "vh"],
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity, 
        delay: delay,
        ease: "linear",
        repeatType: "loop"
      }}
      className="absolute text-emerald-500/10 pointer-events-none transform-gpu will-change-transform"
    >
      <Icon className="w-12 h-12 md:w-20 md:h-20" strokeWidth={1} />
    </motion.div>
  );
};

export default function Background() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Reduced count and simplified motion for performance
  const elements = [
    { icon: Pizza, delay: 0, x: 10, y: 110, duration: 35 },
    { icon: ChefHat, delay: 5, x: 80, y: 110, duration: 40 },
    { icon: Utensils, delay: 2, x: 50, y: 110, duration: 32 },
    { icon: Carrot, delay: 15, x: 20, y: 110, duration: 45 },
    { icon: Apple, delay: 8, x: 70, y: 110, duration: 38 },
    { icon: Coffee, delay: 20, x: 5, y: 110, duration: 36 },
    { icon: IceCream, delay: 12, x: 90, y: 110, duration: 42 },
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
        {/* Subtle Static Gradients - No heavy blur animation */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/5 via-black to-blue-900/5" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-screen"></div>

        {/* Floating Icons */}
        {elements.map((el, i) => (
             <FloatingIcon 
                key={i} 
                Icon={el.icon} 
                delay={el.delay} 
                initialX={el.x} 
                initialY={el.y}
                duration={el.duration}
             />
        ))}

        {/* Modern Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
        
        {/* Inshal AI Branding Watermark */}
        <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-10 grayscale hover:grayscale-0 hover:opacity-30 transition-all duration-700">
             <Zap className="w-8 h-8 text-white" />
             <span className="text-4xl font-black text-white tracking-tighter">Inshal AI</span>
        </div>
    </div>
  );
}
