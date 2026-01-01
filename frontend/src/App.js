import React from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Quiz from './pages/Quiz.jsx';
import Loading from './pages/Loading.jsx';
import EmailCapture from './pages/EmailCapture.jsx';
import Results from './pages/Results.jsx';
import Success from './pages/Success.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/email" element={<EmailCapture />} />
          <Route path="/results" element={<Results />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
