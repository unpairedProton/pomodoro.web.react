import React, { useState } from 'react';

export default function LeftSide({ 
  setIsTimerPanelOpen, 
  setIsBackgroundPanelOpen,
  setIsTrackPanelOpen 
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleTimerClick = () => {
    setIsTimerPanelOpen(prev => !prev);
    setIsBackgroundPanelOpen(false);
    setIsTrackPanelOpen(false);
  };

  const handleBackgroundClick = () => {
    setIsBackgroundPanelOpen(prev => !prev);
    setIsTimerPanelOpen(false);
    setIsTrackPanelOpen(false);
  };

  const handleTrackClick = () => {
    setIsTrackPanelOpen(prev => !prev);
    setIsTimerPanelOpen(false);
    setIsBackgroundPanelOpen(false);
  };

  const menuItems = [
    { 
      icon: "⏱️", 
      text: "TIMERS", 
      onClick: handleTimerClick 
    },
    { 
      icon: "🖼️", 
      text: "BACKGROUNDS", 
      onClick: handleBackgroundClick 
    },
    { 
      icon: "🎵", 
      text: "TRACKS",
      onClick: handleTrackClick
    }
  ];

  return (
    <div
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        flex flex-col gap-4 bg-gray-800 p-3 rounded-r-lg
        transition-all duration-300 ease-in-out
        ${isHovered ? 'w-48' : 'w-14'}
        border-r border-t border-b border-teal-700
      `}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`
              flex items-center gap-3 text-teal-300 hover:text-teal-100
              p-2 rounded transition-all duration-300
              hover:bg-gray-700
              ${isHovered ? 'justify-start' : 'justify-center'}
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span 
              className={`
                whitespace-nowrap transition-all duration-300
                ${isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
              `}
            >
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 