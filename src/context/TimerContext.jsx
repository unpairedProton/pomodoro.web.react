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
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState('STUDY');
  
  // Study time tracking
  const [totalStudySeconds, setTotalStudySeconds] = useState(() => {
    const saved = localStorage.getItem('totalStudySeconds');
    return saved ? parseInt(saved) : 0;
  });
  
  const [studyData, setStudyData] = useState(() => {
    const saved = localStorage.getItem('studyData');
    return saved ? JSON.parse(saved) : {};
  });

  // Save total seconds whenever it changes
  useEffect(() => {
    localStorage.setItem('totalStudySeconds', totalStudySeconds.toString());
  }, [totalStudySeconds]);

  // Update study data whenever timer is running
  useEffect(() => {
    let interval;
    if (isRunning && timerType === 'STUDY') {
      interval = setInterval(() => {
        setTotalStudySeconds(prev => prev + 1);
        
        // Update today's study data
        const now = new Date();
        const month = now.toLocaleString('default', { month: 'lowercase' });
        const day = now.getDate().toString().padStart(2, '0');
        
        setStudyData(prevData => {
          const newData = { ...prevData };
          if (!newData[month]) {
            newData[month] = {};
          }
          // Initialize or increment the day's study time
          const currentDaySeconds = (newData[month][day] || 0) * 3600; // Convert hours back to seconds
          newData[month][day] = (currentDaySeconds + 1) / 3600; // Add one second and convert back to hours
          
          // Save to localStorage
          localStorage.setItem('studyData', JSON.stringify(newData));
          return newData;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timerType]);

  // Timer update effect
  useEffect(() => {
    if (!isRunning && (timeLeft === 0 || timerType)) {
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
  }, [timerType, studyTime, breakTime, longBreakTime, isRunning]);

  // Timer countdown effect
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

  const getStudyData = () => {
    return studyData;
  };

  const value = {
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
    getStudyData,
    studyData // Add studyData to context
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