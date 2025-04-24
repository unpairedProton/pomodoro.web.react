import { useState, useRef, useEffect } from 'react';

export default function RightTrack({ 
  isPanelOpen, 
  setIsPanelOpen,
  isPlaying,
  setIsPlaying,
  audioControlRef
}) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);

  // Expose pause function to parent through ref
  useEffect(() => {
    if (audioRef.current) {
      audioControlRef.current = {
        pause: () => {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      };
    }
  }, [audioRef, setIsPlaying]);

  const tracks = [
    {
      id: 1,
      name: "Future Car",
      audioUrl: "/audio/futurecar.mp3",
      icon: "🎵"
    },
    {
      id: 2,
      name: "Midnight Drive",
      audioUrl: "/audio/lofi.mp3",
      icon: "🎵"
    },
    {
      id: 3,
      name: "Welcome to the Jungle",
      audioUrl: "/audio/jungle.mp3",
      icon: "🎵"
    },
    {
      id: 4,
      name: "Lofi Music",
      audioUrl: "/audio/wave.mp3",
      icon: "🎵"
    },
    {
      id: 5,
      name: "Rain Wisper",
      audioUrl: "/audio/rain.mp3",
      icon: "🎵"
    }
  ];

  const handleTrackSelect = (track) => {
    if (currentTrack?.id === track.id) {
      handlePause();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.play();
      }
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className={`absolute top-0 bottom-0 right-0 w-64 bg-gray-800 border-l border-teal-700 p-4 transition-transform duration-300 ease-in-out ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Panel Header */}
        <h2 className="text-xl font-bold mb-6 text-center text-teal-300">TRACKS</h2>
        
        {/* Audio Element */}
        <audio ref={audioRef} />
        
        {/* Track List */}
        <div className="flex flex-col gap-3 mb-6">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => handleTrackSelect(track)}
              className={`
                flex items-center gap-3 p-3 rounded-lg
                ${currentTrack?.id === track.id ? 'bg-teal-900' : 'hover:bg-gray-700'}
                transition-all duration-200
              `}
            >
              <span 
                className={`
                  text-2xl
                  ${currentTrack?.id === track.id && isPlaying ? 'animate-spin' : ''}
                  ${currentTrack?.id === track.id ? 'text-teal-300' : 'text-gray-400'}
                `}
                style={{ 
                  animationDuration: '3s',
                  display: 'inline-block'
                }}
              >
                {track.icon}
              </span>
              <span className={`
                text-left flex-grow
                ${currentTrack?.id === track.id ? 'text-teal-300' : 'text-gray-300'}
              `}>
                {track.name}
              </span>
            </button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="mt-auto flex justify-center space-x-4">
          <button
            onClick={handlePause}
            disabled={!currentTrack}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${!currentTrack ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                isPlaying ? 'bg-teal-500 hover:bg-teal-400' : 'bg-gray-600 hover:bg-gray-500'}
              transition-colors duration-200
            `}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={handleStop}
            disabled={!currentTrack}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${!currentTrack ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 
                'bg-pink-500 hover:bg-pink-400'}
              transition-colors duration-200
            `}
          >
            ⏹️
          </button>
        </div>
      </div>
    </div>
  );
} 