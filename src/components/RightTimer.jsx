import { useState, useEffect } from 'react';
import { useTimer } from '../context/TimerContext';
import { HiCheck, HiX } from 'react-icons/hi';

export default function RightTimer({ isOpen, onClose, timerType, setTimeLeft }) {
  const {
    studyTime,
    setStudyTime,
    breakTime,
    setBreakTime,
    longBreakTime,
    setLongBreakTime,
    isRunning
  } = useTimer();

  // Temporary input values
  const [tempStudyTime, setTempStudyTime] = useState(studyTime);
  const [tempBreakTime, setTempBreakTime] = useState(breakTime);
  const [tempLongBreakTime, setTempLongBreakTime] = useState(longBreakTime);

  // Update temporary values when props change
  useEffect(() => {
    setTempStudyTime(studyTime);
    setTempBreakTime(breakTime);
    setTempLongBreakTime(longBreakTime);
  }, [studyTime, breakTime, longBreakTime]);

  const saveSettings = () => {
    // Set default values if input is empty
    const newStudyTime = tempStudyTime || 25;
    const newBreakTime = tempBreakTime || 5;
    const newLongBreakTime = tempLongBreakTime || 15;

    // Update timer settings
    setStudyTime(newStudyTime);
    setBreakTime(newBreakTime);
    setLongBreakTime(newLongBreakTime);

    // Update current timer if not running
    if (!isRunning) {
      switch(timerType) {
        case 'STUDY':
          setTimeLeft(newStudyTime * 60);
          break;
        case 'BREAK':
          setTimeLeft(newBreakTime * 60);
          break;
        case 'LONG BREAK':
          setTimeLeft(newLongBreakTime * 60);
          break;
        default:
          break;
      }
    }

    onClose();
  };

  const closePanel = () => {
    // Reset temporary values to current values
    setTempStudyTime(studyTime);
    setTempBreakTime(breakTime);
    setTempLongBreakTime(longBreakTime);
    onClose();
  };

  const handleTimeChange = (e, setter) => {
    const value = e.target.value;
    if (!isRunning) {
      setter(value === '' ? '' : parseInt(value));
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-[400px] bg-[#1E1F21] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white text-2xl font-semibold">Timer Settings</h2>
          <div className="flex gap-4">
            <button onClick={saveSettings} className="text-white hover:text-green-500">
              <HiCheck size={24} />
            </button>
            <button onClick={closePanel} className="text-white hover:text-red-500">
              <HiX size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white mb-2">Study Time (minutes)</label>
            <input
              type="number"
              value={tempStudyTime}
              onChange={(e) => handleTimeChange(e, setTempStudyTime)}
              className="w-full bg-[#2E2F31] text-white p-2 rounded"
              min="1"
              disabled={isRunning}
            />
          </div>

          <div>
            <label className="block text-white mb-2">Break Time (minutes)</label>
            <input
              type="number"
              value={tempBreakTime}
              onChange={(e) => handleTimeChange(e, setTempBreakTime)}
              className="w-full bg-[#2E2F31] text-white p-2 rounded"
              min="1"
              disabled={isRunning}
            />
          </div>

          <div>
            <label className="block text-white mb-2">Long Break Time (minutes)</label>
            <input
              type="number"
              value={tempLongBreakTime}
              onChange={(e) => handleTimeChange(e, setTempLongBreakTime)}
              className="w-full bg-[#2E2F31] text-white p-2 rounded"
              min="1"
              disabled={isRunning}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 