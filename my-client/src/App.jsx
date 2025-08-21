import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Users from './Users';

import Contact from './contacts';
import Resume from './Resume';
import Photo from './Photos';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/users" element={<Users />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/photo" element={<Photo />} />
    </Routes>
  );
}
