// App.js (or wherever you define your routes)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lesson from './Lesson';
import Home from './Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tooti/" element={<Home />} />
        <Route path="/tooti/practice/languages/*" element={<Lesson />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;