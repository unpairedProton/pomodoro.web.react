import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PomodoroTimer from '../components/MainTimer';
import StudyData from '../components/StudyData';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PomodoroTimer />} />
        <Route path="/data" element={<StudyData />} />
      </Routes>
    </BrowserRouter>
  );
} 