import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PomodoroTimer from './components/MainTimer';
import StudyData from './components/StudyData';
import { TimerProvider } from './context/TimerContext';

export default function App() {
  return (
    <TimerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PomodoroTimer />} />
          <Route path="/data" element={<StudyData />} />
        </Routes>
      </BrowserRouter>
    </TimerProvider>
  );
}