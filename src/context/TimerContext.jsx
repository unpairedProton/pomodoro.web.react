import { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

// Initial monthly study data
const initialMonthlyData = {
  april: {
    '01': 300,
    '02': 400,
    '03': 500,
    '04': 350,
    '05': 450,
    '06': 550,
    '07': 400,
    '08': 300,
    '09': 500,
    '10': 400,
    '11': 350,
    '12': 480,
    '13': 520,
    '14': 420,
    '15': 380,
    '16': 510,
    '17': 460,
    '18': 390,
    '19': 530,
    '20': 410,
    '21': 360,
    '22': 490,
    '23': 540,
    '24': 440,
    '25': 370,
    '26': 500,
    '27': 470,
    '28': 350,
    '29': 510,
    '30': 500
  }
};

export function TimerProvider({ children }) {
  // Timer settings
  const [studyTime, setStudyTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState('STUDY'); // STUDY, BREAK, LONG BREAK
  
  // Study time tracking
  const [totalStudySeconds, setTotalStudySeconds] = useState(0);
  const [monthlyData, setMonthlyData] = useState(initialMonthlyData);

  // Initialize monthly study data
  useEffect(() => {
    const existingData = localStorage.getItem('monthlyStudy');
    if (!existingData) {
      localStorage.setItem('monthlyStudy', JSON.stringify(initialMonthlyData));
      setMonthlyData(initialMonthlyData);
    } else {
      setMonthlyData(JSON.parse(existingData));
    }
  }, []);

  // Get monthly study data
  const getMonthlyStudyData = () => {
    return monthlyData;
  };

  // Update monthly study data
  const updateMonthlyStudyData = (month, day, hours) => {
    const updatedData = { ...monthlyData };
    if (!updatedData[month]) {
      updatedData[month] = {};
    }
    updatedData[month][day] = (updatedData[month][day] || 0) + hours;
    localStorage.setItem('monthlyStudy', JSON.stringify(updatedData));
    setMonthlyData(updatedData);
  };

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

  // Update timer based on current timer type
  const updateTimerValue = () => {
    // Only update if timer is not running
    if (!isRunning) {
      let newTime;
      switch(timerType) {
        case 'STUDY':
          newTime = studyTime * 60;
          break;
        case 'BREAK':
          newTime = breakTime * 60;
          break;
        case 'LONG BREAK':
          newTime = longBreakTime * 60;
          break;
        default:
          newTime = studyTime * 60;
      }
      setTimeLeft(newTime);
    }
  };

  // Effect to update timer when settings or timer type changes
  useEffect(() => {
    // Only update timer value if not running and if timer is at 0 or timer type changed
    if (!isRunning && (timeLeft === 0 || timerType)) {
      updateTimerValue();
    }
  }, [timerType, studyTime, breakTime, longBreakTime]);

  // Effect for timer countdown
  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Effect to track study time
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0 && timerType === 'STUDY') {
      interval = setInterval(() => {
        setTotalStudySeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerType]);

  // Save study data to localStorage
  const saveStudyData = () => {
    const today = new Date().toISOString().split('T')[0];
    const studyData = JSON.parse(localStorage.getItem('studyData') || '[]');
    
    // Find if there's already an entry for today
    const todayIndex = studyData.findIndex(item => item.date === today);
    const hoursStudied = totalStudySeconds / 3600; // Convert seconds to hours
    
    if (todayIndex !== -1) {
      // Update existing entry
      studyData[todayIndex].hours += hoursStudied;
    } else {
      // Add new entry
      studyData.push({
        date: today,
        hours: hoursStudied
      });
    }
    
    // Keep only last 30 days of data
    const sortedData = studyData
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30);
    
    localStorage.setItem('studyData', JSON.stringify(sortedData));
  };

  const value = {
    // Timer settings
    studyTime,
    setStudyTime,
    breakTime,
    setBreakTime,
    longBreakTime,
    setLongBreakTime,
    
    // Timer state
    timeLeft,
    setTimeLeft,
    isRunning,
    setIsRunning,
    timerType,
    setTimerType,
    
    // Study time
    totalStudySeconds,
    setTotalStudySeconds,
    
    // Monthly study data functions
    getMonthlyStudyData,
    updateMonthlyStudyData,
    
    // Functions
    updateTimerValue,
    saveStudyData
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
} 