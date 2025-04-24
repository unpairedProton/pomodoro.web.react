import { useState } from 'react';

export default function RightBackground({ 
  isPanelOpen, 
  setIsPanelOpen,
  onVideoSelect,
  onPause,
  onStop,
  currentVideo,
  isPlaying
}) {
  const videos = [
    {
      id: 1,
      thumbnail: "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
      videoUrl: "/video/bg1.mp4",
      title: "Forest Scene"
    },
    {
      id: 2,
      thumbnail: "https://images.unsplash.com/photo-1626808642875-0aa545482dfb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
      videoUrl: "/video/bg2.mp4",
      title: "Rainy Day"
    },
    {
      id: 3,
      thumbnail: "https://images.unsplash.com/photo-1720884413532-59289875c3e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
      videoUrl: "/video/bg3.mp4",
      title: "Sunset Drive"
    },
    {
      id: 4,
      thumbnail: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
      videoUrl: "/video/bg4.mp4",
      title: "Space Journey"
    }
  ];

  return (
    <div 
      className={`absolute top-0 bottom-0 right-0 w-64 bg-gray-800 border-l border-teal-700 p-4 transition-transform duration-300 ease-in-out ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Panel Header */}
        <h2 className="text-xl font-bold mb-6 text-center text-teal-300">BACKGROUNDS</h2>
        
        {/* Video Thumbnails */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => onVideoSelect(video)}
              className={`
                relative aspect-video rounded-lg overflow-hidden border-2
                ${currentVideo?.id === video.id ? 'border-teal-400' : 'border-transparent'}
                hover:border-teal-300 transition-all duration-200
              `}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <span className="text-white text-xs">
                  {currentVideo?.id === video.id && isPlaying ? 'Playing' : 'Play'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="mt-auto flex justify-center space-x-4">
          <button
            onClick={onPause}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${isPlaying ? 'bg-teal-500 hover:bg-teal-400' : 'bg-gray-600 hover:bg-gray-500'}
              transition-colors duration-200
            `}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={onStop}
            className="w-12 h-12 bg-pink-500 hover:bg-pink-400 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            ⏹️
          </button>
        </div>
      </div>
    </div>
  );
} 