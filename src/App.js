import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Games from './pages/Games';
import Learn from './pages/Learn';
import Notfound from './pages/Notfound';
import ViewGames from './pages/ViewGames';
import ViewLearn from './pages/ViewLearn';

function App() {
  return (
    <Router>
      <Navbar />
      <br/>
      <br/>
      <br/>
      <Routes>
        <Route path="/admin" element={<Admin/>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/games" element={<Games />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:id" element={<ViewLearn />} />
        <Route path="/games/:id" element={<ViewGames />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
      <hr/>
      <Footer />
    </Router>
  );
}

export default App;
