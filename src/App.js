import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Sign from './pages/Sign';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Games from './pages/Games';
import Learn from './pages/Learn';
import Notfound from './pages/Notfound';
import ViewGames from './pages/ViewGames';
import ViewLearn from './pages/ViewLearn';
import ResetPassword from './pages/ResetPassword';
import Community from './pages/Community';
import ResetCommunity from './pages/ResetCommunity';
import Verify from './pages/Verify';

function App() {
  return (
    <Router>
      <Navbar />
      <br />
      <br />
      <br />
      <div>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/Community/login' element={<Sign />} />
          <Route path='/reset' element={<ResetPassword />} />
          <Route path='/new_password/__/auth/action' element={<Verify />} />
          <Route path='/community/reset' element={<ResetCommunity />} />
          <Route path="/games" element={<Games />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:id" element={<ViewLearn />} />
          <Route path="/games/:id" element={<ViewGames />} />
          <Route path='/community' element={<Community />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
      <hr />
      <Footer />
    </Router>
  );
}

export default App;
