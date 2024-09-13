import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/users/Login';
import Signup from './pages/users/Signup';
import {routes} from './routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<MainLayout />}>
            {routes}
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;