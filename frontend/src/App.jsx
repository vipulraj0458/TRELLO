import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BoardPage from './pages/BoardPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/board/:id" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
