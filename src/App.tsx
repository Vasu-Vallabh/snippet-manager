import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '@/pages/Landing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import GetStarted from '@/pages/GetStarted';
import './index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/get-started" element={<GetStarted />} />
      </Routes>
    </Router>
  );
}
