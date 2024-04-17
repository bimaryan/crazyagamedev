import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
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
import ViewProfile from './pages/ViewProfil';
import Profil from './pages/Profil';
import Post from './pages/Post';
import Moodstrap from './pages/Moodstrap';
import Me from './pages/Me';
import Nulis from './pages/Code';

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
          <Route path='/Community/signup' element={<SignUp />} />
          <Route path='/Community/signin' element={<SignIn />} />
          <Route path='/reset' element={<ResetPassword />} />
          <Route path='/community/reset' element={<ResetCommunity />} />
          <Route path="/games" element={<Games />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:id" element={<ViewLearn />} />
          <Route path="/games/:id" element={<ViewGames />} />
          <Route path='/community' element={<Community />} />
          <Route path='/community/profil' element={<Profil />} />
          <Route path='/community/post' element={<Post />} />
          <Route path='/community/profil/:displayName' element={<ViewProfile/>}/>
          <Route path='/moodstrap' element={<Moodstrap/>}/>
          <Route path='/me' element={<Me/>}/>
          <Route path='/code' element={<Nulis/>}/>
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
      <hr />
      <Footer />
    </Router>
  );
}

export default App;
