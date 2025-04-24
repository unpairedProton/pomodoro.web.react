import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTimer } from '../context/TimerContext';

export default function StudyData() {
  const navigate = useNavigate();
  const { totalStudySeconds, studyData } = useTimer();
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    return months[now.getMonth()];
  });
  
  // Format total study time to HH:MM
  const formatStudyTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Format hours to HH:MM
  const formatHoursToHHMM = (hours) => {
    const totalMinutes = Math.round(hours * 60);
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;
    return `${hh.toString().padStart(2, '0')} hrs : ${mm.toString().padStart(2, '0')} mints`;
  };

  // Save study data to localStorage
  const saveStudyData = (data) => {
    localStorage.setItem('studyData', JSON.stringify(data));
  };

  // Load study data from localStorage
  const loadStudyData = () => {
    const savedData = localStorage.getItem('studyData');
    return savedData ? JSON.parse(savedData) : {};
  };

  // Update today's study time
  useEffect(() => {
    const updateTodayStudyTime = () => {
      const now = new Date();
      const today = now.getDate().toString();
      const currentMonth = selectedMonth;
      
      const studyData = loadStudyData();
      if (!studyData[currentMonth]) {
        studyData[currentMonth] = {};
      }
      
      // Update today's study time
      studyData[currentMonth][today] = totalStudySeconds / 3600; // Convert seconds to hours
      
      saveStudyData(studyData);
    };

    // Update whenever totalStudySeconds changes
    updateTodayStudyTime();
  }, [totalStudySeconds, selectedMonth]);

  // Prepare chart data
  useEffect(() => {
    const selectedMonthData = studyData[selectedMonth] || {};
    
    // Get current date and number of days in the month
    const now = new Date();
    const currentYear = now.getFullYear();
    const monthIndex = new Date(`${selectedMonth} 1, ${currentYear}`).getMonth();
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    
    // Create array with all days of the month
    const formattedData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      return {
        day: parseInt(day),
        date: `${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)} ${day}`,
        hours: selectedMonthData[day] || 0
      };
    });

    setChartData(formattedData);
  }, [selectedMonth, studyData]); // Update when studyData changes

  // Calculate total monthly time from the actual data
  const totalMonthlyHours = chartData.reduce((sum, item) => sum + item.hours, 0);
  
  // Calculate average study time (only counting days with study time)
  const daysWithStudy = chartData.filter(day => day.hours > 0).length;
  const averageStudyHours = daysWithStudy > 0 ? totalMonthlyHours / daysWithStudy : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-teal-300 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-md"
        >
          Back to Timer
        </button>
        <h1 className="text-3xl font-bold">Study Statistics</h1>
        <div className="w-[100px]"></div>
      </div>

      {/* Total Study Time Summary */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Study Time Overview</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-4xl font-bold text-teal-400">
              {formatStudyTime(totalStudySeconds)}
            </p>
            <p className="text-sm text-teal-300 opacity-75">
              Current Session
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-4xl font-bold text-teal-400">
              {formatHoursToHHMM(totalMonthlyHours)}
            </p>
            <p className="text-sm text-teal-300 opacity-75">
              Total for {selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-4xl font-bold text-teal-400">
              {formatHoursToHHMM(averageStudyHours)}
            </p>
            <p className="text-sm text-teal-300 opacity-75">
              Average Study Time
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 rounded-lg p-6 h-[600px]">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Daily Progress</h3>
          <p className="text-sm opacity-75">Study time per day</p>
        </div>
        
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={60}
              stroke="#5eead4"
              interval={2}
            />
            <YAxis
              label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#5eead4' }}
              stroke="#5eead4"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #5eead4',
                borderRadius: '4px'
              }}
              formatter={(value) => [`${formatHoursToHHMM(value)}`, 'Study Time']}
            />
            <Legend />
            <Bar dataKey="hours" fill="#5eead4" name="Study Time" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 