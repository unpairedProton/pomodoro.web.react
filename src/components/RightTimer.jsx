import { useState } from 'react';

export default function RightTimer({ 
  studyTime, 
  setStudyTime, 
  breakTime, 
  setBreakTime, 
  longBreakTime, 
  setLongBreakTime,
  updateTimerValue,
  isPanelOpen,
  setIsPanelOpen,
  isRunning
}) {
  // Default values
  const DEFAULT_STUDY_TIME = 25;
  const DEFAULT_BREAK_TIME = 5;
  const DEFAULT_LONG_BREAK_TIME = 15;

  // Temporary state for input values
  const [tempStudyTime, setTempStudyTime] = useState(studyTime);
  const [tempBreakTime, setTempBreakTime] = useState(breakTime);
  const [tempLongBreakTime, setTempLongBreakTime] = useState(longBreakTime);

  // Save settings and close panel
  const saveSettings = () => {
    // Set default values if empty or invalid
    setStudyTime(tempStudyTime || DEFAULT_STUDY_TIME);
    setBreakTime(tempBreakTime || DEFAULT_BREAK_TIME);
    setLongBreakTime(tempLongBreakTime || DEFAULT_LONG_BREAK_TIME);
    
    // Update the temporary values to show the defaults if they were empty
    setTempStudyTime(tempStudyTime || DEFAULT_STUDY_TIME);
    setTempBreakTime(tempBreakTime || DEFAULT_BREAK_TIME);
    setTempLongBreakTime(tempLongBreakTime || DEFAULT_LONG_BREAK_TIME);
    
    updateTimerValue();
    setIsPanelOpen(false);
  };

  // Close panel without saving
  const closePanel = () => {
    // Reset temp values to current values
    setTempStudyTime(studyTime);
    setTempBreakTime(breakTime);
    setTempLongBreakTime(longBreakTime);
    setIsPanelOpen(false);
  };

  // Handle input changes
  const handleInputChange = (setValue, value) => {
    const numValue = value === '' ? '' : parseInt(value);
    setValue(numValue);
  };

  const handleTimeChange = (value, setter) => {
    if (!isRunning) {
      // If value is empty string or 0, don't set it yet (keep the input empty for UX)
      // The default values will be applied when saving
      setter(value === '' ? '' : parseInt(value) || '');
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
        <h2 className="text-xl font-bold mb-6 text-center">SETTINGS</h2>
        
        {/* Study Time Setting */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">STUDY</h3>
          <input
            type="number"
            value={tempStudyTime}
            onChange={(e) => handleTimeChange(e.target.value, setTempStudyTime)}
            min="1"
            placeholder={`Default: ${DEFAULT_STUDY_TIME} minutes`}
            className={`w-full p-2 rounded bg-teal-300 text-gray-900 text-center font-semibold placeholder-gray-600 ${
              isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isRunning}
          />
        </div>
        
        {/* Break Time Setting */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">BREAK</h3>
          <input
            type="number"
            value={tempBreakTime}
            onChange={(e) => handleTimeChange(e.target.value, setTempBreakTime)}
            min="1"
            placeholder={`Default: ${DEFAULT_BREAK_TIME} minutes`}
            className={`w-full p-2 rounded bg-teal-300 text-gray-900 text-center font-semibold placeholder-gray-600 ${
              isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isRunning}
          />
        </div>
        
        {/* Long Break Time Setting */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">LONG BREAK</h3>
          <input
            type="number"
            value={tempLongBreakTime}
            onChange={(e) => handleTimeChange(e.target.value, setTempLongBreakTime)}
            min="1"
            placeholder={`Default: ${DEFAULT_LONG_BREAK_TIME} minutes`}
            className={`w-full p-2 rounded bg-teal-300 text-gray-900 text-center font-semibold placeholder-gray-600 ${
              isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isRunning}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="mt-auto flex justify-center space-x-4">
          <button
            onClick={saveSettings}
            className="w-12 h-12 bg-teal-500 hover:bg-teal-400 rounded-full flex items-center justify-center"
          >
            ✓
          </button>
          <button
            onClick={closePanel}
            className="w-12 h-12 bg-pink-500 hover:bg-pink-400 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
} 