import React from 'react';

interface AnimalIllustrationProps {
  className?: string;
  variant?: 'koala' | 'orangutan' | 'lion' | 'turtle' | 'elephant';
}

const AnimalIllustration: React.FC<AnimalIllustrationProps> = ({ 
  className = "", 
  variant = 'koala' 
}) => {
  const illustrations = {
    koala: (
      <svg viewBox="0 0 400 400" className={className} fill="none">
        {/* Koala illustration */}
        <defs>
          <linearGradient id="koalaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a67c52" />
            <stop offset="100%" stopColor="#8B6914" />
          </linearGradient>
        </defs>
        
        {/* Background elements - eucalyptus leaves */}
        <path d="M50 100 Q70 80 90 100 Q110 120 90 140 Q70 160 50 140 Q30 120 50 100 Z" 
              fill="#5F7161" opacity="0.3" />
        <path d="M320 80 Q340 60 360 80 Q380 100 360 120 Q340 140 320 120 Q300 100 320 80 Z" 
              fill="#5F7161" opacity="0.2" />
        
        {/* Koala body */}
        <ellipse cx="200" cy="280" rx="80" ry="60" fill="url(#koalaGradient)" />
        
        {/* Koala head */}
        <circle cx="200" cy="180" r="70" fill="url(#koalaGradient)" />
        
        {/* Ears */}
        <ellipse cx="150" cy="130" rx="25" ry="35" fill="url(#koalaGradient)" />
        <ellipse cx="250" cy="130" rx="25" ry="35" fill="url(#koalaGradient)" />
        <ellipse cx="150" cy="135" rx="15" ry="20" fill="#E28743" opacity="0.8" />
        <ellipse cx="250" cy="135" rx="15" ry="20" fill="#E28743" opacity="0.8" />
        
        {/* Eyes */}
        <circle cx="180" cy="170" r="12" fill="#2c392c" />
        <circle cx="220" cy="170" r="12" fill="#2c392c" />
        <circle cx="183" cy="167" r="4" fill="white" />
        <circle cx="223" cy="167" r="4" fill="white" />
        
        {/* Nose */}
        <ellipse cx="200" cy="190" rx="8" ry="6" fill="#2c392c" />
        
        {/* Arms */}
        <ellipse cx="140" cy="240" rx="20" ry="40" fill="url(#koalaGradient)" transform="rotate(-20 140 240)" />
        <ellipse cx="260" cy="240" rx="20" ry="40" fill="url(#koalaGradient)" transform="rotate(20 260 240)" />
        
        {/* Decorative elements */}
        <circle cx="100" cy="200" r="3" fill="#E28743" opacity="0.6" />
        <circle cx="320" cy="220" r="2" fill="#5F7161" opacity="0.5" />
        <circle cx="80" cy="300" r="2" fill="#E28743" opacity="0.4" />
      </svg>
    ),
    
    orangutan: (
      <svg viewBox="0 0 400 400" className={className} fill="none">
        <defs>
          <linearGradient id="orangutanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E28743" />
            <stop offset="100%" stopColor="#a67c52" />
          </linearGradient>
        </defs>
        
        {/* Background jungle elements */}
        <path d="M40 350 Q60 320 80 350 Q100 380 80 400 L40 400 Z" fill="#5F7161" opacity="0.3" />
        <path d="M320 350 Q340 320 360 350 Q380 380 360 400 L320 400 Z" fill="#5F7161" opacity="0.3" />
        <path d="M180 50 Q200 30 220 50 Q240 70 220 90 Q200 110 180 90 Q160 70 180 50 Z" 
              fill="#5F7161" opacity="0.2" />
        
        {/* Orangutan body */}
        <ellipse cx="200" cy="280" rx="70" ry="55" fill="url(#orangutanGradient)" />
        
        {/* Long arms */}
        <ellipse cx="120" cy="220" rx="18" ry="80" fill="url(#orangutanGradient)" transform="rotate(-25 120 220)" />
        <ellipse cx="280" cy="220" rx="18" ry="80" fill="url(#orangutanGradient)" transform="rotate(25 280 220)" />
        
        {/* Head */}
        <ellipse cx="200" cy="170" rx="60" ry="55" fill="url(#orangutanGradient)" />
        
        {/* Face cheeks */}
        <ellipse cx="155" cy="165" rx="25" ry="20" fill="#a67c52" opacity="0.8" />
        <ellipse cx="245" cy="165" rx="25" ry="20" fill="#a67c52" opacity="0.8" />
        
        {/* Eyes */}
        <circle cx="180" cy="155" r="10" fill="#2c392c" />
        <circle cx="220" cy="155" r="10" fill="#2c392c" />
        <circle cx="183" cy="152" r="3" fill="white" />
        <circle cx="223" cy="152" r="3" fill="white" />
        
        {/* Nose and mouth area */}
        <ellipse cx="200" cy="175" rx="12" ry="8" fill="#a67c52" />
        <ellipse cx="200" cy="175" rx="4" ry="3" fill="#2c392c" />
        
        {/* Hands */}
        <circle cx="90" cy="290" r="15" fill="url(#orangutanGradient)" />
        <circle cx="310" cy="290" r="15" fill="url(#orangutanGradient)" />
        
        {/* Decorative leaves */}
        <path d="M60 120 Q80 100 100 120 Q120 140 100 160 Q80 180 60 160 Q40 140 60 120 Z" 
              fill="#5F7161" opacity="0.4" />
      </svg>
    ),

    lion: (
      <svg viewBox="0 0 400 400" className={className} fill="none">
        <defs>
          <linearGradient id="lionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E28743" />
            <stop offset="100%" stopColor="#D4952C" />
          </linearGradient>
          <linearGradient id="maneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4952C" />
            <stop offset="100%" stopColor="#AA7823" />
          </linearGradient>
        </defs>
        
        {/* Savanna background */}
        <path d="M0 350 Q50 330 100 350 Q150 370 200 350 Q250 330 300 350 Q350 370 400 350 L400 400 L0 400 Z" 
              fill="#a67c52" opacity="0.3" />
        
        {/* Mane */}
        <circle cx="200" cy="180" r="90" fill="url(#maneGradient)" />
        <circle cx="150" cy="150" r="30" fill="url(#maneGradient)" opacity="0.8" />
        <circle cx="250" cy="150" r="30" fill="url(#maneGradient)" opacity="0.8" />
        <circle cx="140" cy="200" r="25" fill="url(#maneGradient)" opacity="0.7" />
        <circle cx="260" cy="200" r="25" fill="url(#maneGradient)" opacity="0.7" />
        
        {/* Lion head */}
        <circle cx="200" cy="180" r="60" fill="url(#lionGradient)" />
        
        {/* Lion body */}
        <ellipse cx="200" cy="300" rx="80" ry="60" fill="url(#lionGradient)" />
        
        {/* Eyes */}
        <circle cx="180" cy="165" r="12" fill="#2c392c" />
        <circle cx="220" cy="165" r="12" fill="#2c392c" />
        <circle cx="183" cy="162" r="4" fill="white" />
        <circle cx="223" cy="162" r="4" fill="white" />
        
        {/* Nose */}
        <path d="M190 185 Q200 180 210 185 Q205 195 200 190 Q195 195 190 185 Z" fill="#2c392c" />
        
        {/* Mouth */}
        <path d="M185 200 Q200 210 215 200" stroke="#2c392c" strokeWidth="2" fill="none" />
        
        {/* Legs */}
        <rect x="160" y="340" width="20" height="40" rx="10" fill="url(#lionGradient)" />
        <rect x="220" y="340" width="20" height="40" rx="10" fill="url(#lionGradient)" />
        
        {/* Tail */}
        <path d="M280 310 Q320 300 340 320 Q350 340 340 350" stroke="url(#lionGradient)" strokeWidth="8" fill="none" />
        <circle cx="340" cy="350" r="8" fill="url(#maneGradient)" />
        
        {/* Grass elements */}
        <path d="M80 380 L85 360 L90 380" stroke="#5F7161" strokeWidth="2" fill="none" />
        <path d="M320 385 L325 365 L330 385" stroke="#5F7161" strokeWidth="2" fill="none" />
      </svg>
    ),

    turtle: (
      <svg viewBox="0 0 400 400" className={className} fill="none">
        <defs>
          <linearGradient id="shellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5F7161" />
            <stop offset="100%" stopColor="#51574C" />
          </linearGradient>
          <linearGradient id="turtleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#87917E" />
            <stop offset="100%" stopColor="#6C7465" />
          </linearGradient>
        </defs>
        
        {/* Ocean waves */}
        <path d="M0 300 Q50 280 100 300 Q150 320 200 300 Q250 280 300 300 Q350 320 400 300 L400 400 L0 400 Z" 
              fill="#E28743" opacity="0.2" />
        <path d="M0 320 Q40 310 80 320 Q120 330 160 320 Q200 310 240 320 Q280 330 320 320 Q360 310 400 320 L400 400 L0 400 Z" 
              fill="#E28743" opacity="0.3" />
        
        {/* Turtle shell */}
        <ellipse cx="200" cy="220" rx="90" ry="70" fill="url(#shellGradient)" />
        
        {/* Shell pattern */}
        <ellipse cx="200" cy="220" rx="70" ry="50" fill="none" stroke="#a67c52" strokeWidth="2" />
        <line x1="140" y1="200" x2="260" y2="200" stroke="#a67c52" strokeWidth="2" />
        <line x1="140" y1="240" x2="260" y2="240" stroke="#a67c52" strokeWidth="2" />
        <line x1="170" y1="180" x2="170" y2="260" stroke="#a67c52" strokeWidth="2" />
        <line x1="200" y1="180" x2="200" y2="260" stroke="#a67c52" strokeWidth="2" />
        <line x1="230" y1="180" x2="230" y2="260" stroke="#a67c52" strokeWidth="2" />
        
        {/* Head */}
        <ellipse cx="200" cy="140" rx="25" ry="30" fill="url(#turtleGradient)" />
        
        {/* Eyes */}
        <circle cx="190" cy="135" r="6" fill="#2c392c" />
        <circle cx="210" cy="135" r="6" fill="#2c392c" />
        <circle cx="192" cy="133" r="2" fill="white" />
        <circle cx="212" cy="133" r="2" fill="white" />
        
        {/* Flippers */}
        <ellipse cx="120" cy="200" rx="30" ry="15" fill="url(#turtleGradient)" transform="rotate(-30 120 200)" />
        <ellipse cx="280" cy="200" rx="30" ry="15" fill="url(#turtleGradient)" transform="rotate(30 280 200)" />
        <ellipse cx="130" cy="250" rx="30" ry="15" fill="url(#turtleGradient)" transform="rotate(-20 130 250)" />
        <ellipse cx="270" cy="250" rx="30" ry="15" fill="url(#turtleGradient)" transform="rotate(20 270 250)" />
        
        {/* Bubbles */}
        <circle cx="100" cy="150" r="4" fill="#E28743" opacity="0.6" />
        <circle cx="320" cy="180" r="3" fill="#E28743" opacity="0.5" />
        <circle cx="80" cy="120" r="2" fill="#E28743" opacity="0.4" />
        <circle cx="340" cy="140" r="2" fill="#E28743" opacity="0.4" />
      </svg>
    ),

    elephant: (
      <svg viewBox="0 0 400 400" className={className} fill="none">
        <defs>
          <linearGradient id="elephantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#87917E" />
            <stop offset="100%" stopColor="#6C7465" />
          </linearGradient>
        </defs>
        
        {/* Savanna background */}
        <path d="M0 350 Q50 330 100 350 Q150 370 200 350 Q250 330 300 350 Q350 370 400 350 L400 400 L0 400 Z" 
              fill="#a67c52" opacity="0.3" />
        
        {/* Elephant body */}
        <ellipse cx="200" cy="280" rx="100" ry="80" fill="url(#elephantGradient)" />
        
        {/* Elephant head */}
        <ellipse cx="200" cy="180" rx="70" ry="60" fill="url(#elephantGradient)" />
        
        {/* Ears */}
        <ellipse cx="140" cy="160" rx="40" ry="50" fill="url(#elephantGradient)" transform="rotate(-20 140 160)" />
        <ellipse cx="260" cy="160" rx="40" ry="50" fill="url(#elephantGradient)" transform="rotate(20 260 160)" />
        <ellipse cx="145" cy="165" rx="25" ry="30" fill="#a67c52" opacity="0.6" transform="rotate(-20 145 165)" />
        <ellipse cx="255" cy="165" rx="25" ry="30" fill="#a67c52" opacity="0.6" transform="rotate(20 255 165)" />
        
        {/* Trunk */}
        <path d="M200 210 Q180 240 160 270 Q140 300 120 320 Q110 340 120 350 Q130 360 140 350 Q160 330 180 310 Q200 290 210 250 Q205 230 200 210 Z" 
              fill="url(#elephantGradient)" />
        
        {/* Eyes */}
        <circle cx="180" cy="165" r="8" fill="#2c392c" />
        <circle cx="220" cy="165" r="8" fill="#2c392c" />
        <circle cx="182" cy="163" r="3" fill="white" />
        <circle cx="222" cy="163" r="3" fill="white" />
        
        {/* Legs */}
        <rect x="140" y="340" width="25" height="50" rx="12" fill="url(#elephantGradient)" />
        <rect x="180" y="340" width="25" height="50" rx="12" fill="url(#elephantGradient)" />
        <rect x="195" y="340" width="25" height="50" rx="12" fill="url(#elephantGradient)" />
        <rect x="235" y="340" width="25" height="50" rx="12" fill="url(#elephantGradient)" />
        
        {/* Tail */}
        <path d="M300 290 Q320 295 330 310 Q335 320 330 325" stroke="url(#elephantGradient)" strokeWidth="6" fill="none" />
        
        {/* Tusks */}
        <ellipse cx="175" cy="190" rx="3" ry="15" fill="#F5E8D4" />
        <ellipse cx="225" cy="190" rx="3" ry="15" fill="#F5E8D4" />
        
        {/* Trees in background */}
        <rect x="60" y="200" width="8" height="40" fill="#5F7161" opacity="0.4" />
        <circle cx="64" cy="190" r="15" fill="#5F7161" opacity="0.4" />
        <rect x="340" y="180" width="6" height="30" fill="#5F7161" opacity="0.3" />
        <circle cx="343" cy="170" r="12" fill="#5F7161" opacity="0.3" />
      </svg>
    )
  };

  return illustrations[variant];
};

export default AnimalIllustration;
