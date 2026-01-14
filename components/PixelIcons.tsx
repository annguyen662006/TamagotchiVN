
import React from 'react';

const IconImage = ({ src, alt }: { src: string, alt: string }) => (
  <img 
    src={src} 
    alt={alt} 
    className="w-full h-full object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" 
    style={{ imageRendering: 'pixelated' }} 
  />
);

export const IconFood = () => (
  <IconImage 
    src="https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/food.png" 
    alt="Food" 
  />
);

export const IconSleep = () => (
  <IconImage 
    src="https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/sleep.png" 
    alt="Sleep" 
  />
);

export const IconClean = () => (
  <IconImage 
    src="https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/broom.png" 
    alt="Clean" 
  />
);

export const IconPlay = () => (
  <IconImage 
    src="https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/play.png" 
    alt="Play" 
  />
);

export const IconChat = () => (
  <IconImage 
    src="https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/chat.png" 
    alt="Chat" 
  />
);

export const IconMeds = () => (
  <IconImage 
    src="https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/medicine.png" 
    alt="Medicine" 
  />
);
