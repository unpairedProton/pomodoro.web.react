import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RightTimer from './RightTimer';
import LeftSide from './LeftSide';
import RightBackground from './RightBackground';
import RightTrack from './RightTrack';
import TotalTime from './TotalTime';
import { useTimer } from '../context/TimerContext';

export default function PomodoroTimer() {
  const navigate = useNavigate();
  const {
    studyTime,
    setStudyTime,
    breakTime,
    setBreakTime,
    longBreakTime,
    setLongBreakTime,
    timeLeft,
    setTimeLeft,
    isRunning,
    setIsRunning,
    timerType,
    setTimerType,
    totalStudySeconds,
    setTotalStudySeconds,
    updateTimerValue,
    saveStudyData
  } = useTimer();

  // Panel states
  const [isTimerPanelOpen, setIsTimerPanelOpen] = useState(false);
  const [isBackgroundPanelOpen, setIsBackgroundPanelOpen] = useState(false);
  const [isTrackPanelOpen, setIsTrackPanelOpen] = useState(false);

  // Background video state
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  // Audio state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioControlRef = useRef(null);

  // Load saved study time from localStorage on mount
  useEffect(() => {
    const savedTime = localStorage.getItem('totalStudySeconds');
    if (savedTime) {
      setTotalStudySeconds(parseInt(savedTime));
    }
  }, []);

  // Save study time to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('totalStudySeconds', totalStudySeconds.toString());
  }, [totalStudySeconds]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format total study time to HH:MM
  const formatStudyTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Handle timer type change
  const changeTimerType = (type) => {
    if (!isRunning) {
      setTimerType(type);
    }
  };

  // Time adjustment functions
  const addMinute = () => {
    if (!isRunning) {
      setTimeLeft(timeLeft + 60);
    }
  };
  
  const subtractMinute = () => {
    if (!isRunning) {
      if (timeLeft > 60) {
        setTimeLeft(timeLeft - 60);
      } else {
        setTimeLeft(0);
      }
    }
  };
  
  const addTenMinutes = () => {
    if (!isRunning) {
      setTimeLeft(timeLeft + 600);
    }
  };

  // Video controls
  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    setIsVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.src = video.videoUrl;
      videoRef.current.play();
    }
  };

  const handleVideoPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleVideoStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoPlaying(false);
    }
  };

  // Effect to pause video when timer ends
  useEffect(() => {
    if (timeLeft === 0 && videoRef.current && isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  }, [timeLeft]);

  // Function to close all panels
  const closeAllPanels = () => {
    setIsTimerPanelOpen(false);
    setIsBackgroundPanelOpen(false);
    setIsTrackPanelOpen(false);
  };

  // Check if any panel is open
  const isAnyPanelOpen = isTimerPanelOpen || isBackgroundPanelOpen || isTrackPanelOpen;

  // Update handleStop to save data and reset timer
  const handleStop = () => {
    setIsRunning(false);
    if (timerType === 'STUDY' && totalStudySeconds > 0) {
      saveStudyData();
    }
    // Reset timer to initial value based on current timer type
    let initialTime;
    switch(timerType) {
      case 'STUDY':
        initialTime = studyTime * 60;
        break;
      case 'BREAK':
        initialTime = breakTime * 60;
        break;
      case 'LONG BREAK':
        initialTime = longBreakTime * 60;
        break;
      default:
        initialTime = studyTime * 60;
    }
    setTimeLeft(initialTime);

    // Stop media playback
    if (videoRef.current && isVideoPlaying) {
      handleVideoStop();
    }
    if (audioControlRef.current?.pause) {
      audioControlRef.current.pause();
      setIsAudioPlaying(false);
    }
    setTotalStudySeconds(0);
  };

  const handlePause = () => {
    setIsRunning(false);
    // Only pause media, don't reset anything
    if (videoRef.current && isVideoPlaying) {
      handleVideoPause();
    }
    if (audioControlRef.current?.pause) {
      audioControlRef.current.pause();
      setIsAudioPlaying(false);
    }
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      updateTimerValue();
    }
    setIsRunning(true);
    if (videoRef.current && currentVideo) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
    if (audioControlRef.current && isAudioPlaying) {
      audioControlRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-teal-300 p-4 relative overflow-hidden">
      {/* Menu Button */}
      <button
        onClick={() => navigate('/data')}
        className="absolute top-4 left-4 bg-teal-600 hover:bg-teal-500 text-white p-2 rounded-md z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Background Video */}
      {currentVideo && (
        <video
          ref={videoRef}
          className="fixed inset-0 w-full h-full object-cover -z-10"
          loop
          muted
        />
      )}

      {/* Overlay for closing panels */}
      {isAnyPanelOpen && (
        <div 
          className="fixed inset-0 bg-transparent bg-opacity-20 z-30"
          onClick={closeAllPanels}
        />
      )}

      {/* Left Side Menu */}
      <LeftSide 
        setIsTimerPanelOpen={setIsTimerPanelOpen}
        setIsBackgroundPanelOpen={setIsBackgroundPanelOpen}
        setIsTrackPanelOpen={setIsTrackPanelOpen}
      />

      {/* Main Timer Interface */}
      <div className="flex flex-col items-center z-10">
        {/* Timer Type Selection */}
        <div className="flex space-x-4 mb-8">
          {['STUDY', 'BREAK', 'LONG BREAK'].map((type) => (
            <button
              key={type}
              onClick={() => changeTimerType(type)}
              className={`px-4 py-2 rounded-md ${
                timerType === type 
                  ? 'bg-teal-700 underline font-bold' 
                  : isRunning 
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-800'
              }`}
              disabled={isRunning}
            >
              {type}
            </button>
          ))}
        </div>
        
        {/* Timer Display */}
        <div className="text-8xl mb-8 font-bold" style={{ textShadow: '0 0 10px rgba(45, 212, 191, 0.7)' }}>
          {formatTime(timeLeft)}
        </div>
        
        {/* Timer Controls */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={addMinute}
            className={`bg-teal-800 hover:bg-teal-700 text-teal-300 w-12 h-12 flex items-center justify-center rounded-full text-2xl ${
              isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isRunning}
            style={{ boxShadow: '0 0 10px rgba(45, 212, 191, 0.5)' }}
          >
            +
          </button>
          
          <button 
            onClick={addTenMinutes}
            className={`bg-teal-800 hover:bg-teal-700 text-teal-300 px-4 py-2 rounded-full ${
              isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isRunning}
            style={{ boxShadow: '0 0 10px rgba(45, 212, 191, 0.5)' }}
          >
            ADD 10 MINUTES
          </button>
          
          <button 
            onClick={subtractMinute}
            className={`bg-teal-800 hover:bg-teal-700 text-teal-300 w-12 h-12 flex items-center justify-center rounded-full text-2xl ${
              isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isRunning}
            style={{ boxShadow: '0 0 10px rgba(45, 212, 191, 0.5)' }}
          >
            -
          </button>
        </div>
        
        {/* Timer Start/Pause/Stop Buttons */}
        <div className="flex flex-col items-center">
          <div className="flex gap-4">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 rounded-md text-lg font-semibold min-w-[120px] z-50"
              >
                START
              </button>
            ) : (
              <>
                <button
                  onClick={handlePause}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-md text-lg font-semibold z-50"
                >
                  PAUSE
                </button>
                <button
                  onClick={handleStop}
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-md text-lg font-semibold z-50"
                >
                  STOP
                </button>
              </>
            )}
          </div>
          
          {/* Total Study Time Display */}
          <TotalTime totalStudySeconds={totalStudySeconds} />
        </div>
      </div>

      {/* Right Panels - increase z-index to be above overlay */}
      <div className="z-40">
        <RightTimer
          studyTime={studyTime}
          setStudyTime={setStudyTime}
          breakTime={breakTime}
          setBreakTime={setBreakTime}
          longBreakTime={longBreakTime}
          setLongBreakTime={setLongBreakTime}
          updateTimerValue={updateTimerValue}
          isPanelOpen={isTimerPanelOpen}
          setIsPanelOpen={setIsTimerPanelOpen}
          isRunning={isRunning}
        />

        <RightBackground
          isPanelOpen={isBackgroundPanelOpen}
          setIsPanelOpen={setIsBackgroundPanelOpen}
          onVideoSelect={handleVideoSelect}
          onPause={handleVideoPause}
          onStop={handleVideoStop}
          currentVideo={currentVideo}
          isPlaying={isVideoPlaying}
        />

        <RightTrack
          isPanelOpen={isTrackPanelOpen}
          setIsPanelOpen={setIsTrackPanelOpen}
          isPlaying={isAudioPlaying}
          setIsPlaying={setIsAudioPlaying}
          audioControlRef={audioControlRef}
        />
      </div>
    </div>
  );
}