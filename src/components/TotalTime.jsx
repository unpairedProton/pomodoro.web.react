import React from 'react';

export default function TotalTime({ totalStudySeconds }) {
  // Format total study time to HH:MM
  const formatStudyTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-4 text-teal-400 font-medium text-center">
      Total Study Time: {formatStudyTime(totalStudySeconds)}
    </div>
  );
} 