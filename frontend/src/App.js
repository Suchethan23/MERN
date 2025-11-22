import logo from './logo.svg';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import Login from './pages/login.js';
import Signin from './pages/signin.js';
import Home from './pages/homepage.js';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>



    </div>
  );
}

export default App;
