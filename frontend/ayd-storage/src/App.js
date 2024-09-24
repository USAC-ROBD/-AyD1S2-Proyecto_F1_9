import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/users/Login';
import Signup from './pages/users/Signup';
import Confirmation from './pages/users/Confirmation';
import Recovery from './pages/users/Recovery';
import SetNewPassword from './pages/users/setNewPassword';
import MainLayout from './components/layout/MainLayout';
import DeleteAccuntMessage from './pages/users/deleteConfirmation';
import {routes} from './routes';

import './App.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirmation/:id" element={<Confirmation />} />
          <Route path="/" element={<MainLayout />}>
            {routes}
          </Route>
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/setNewPassword" element={<SetNewPassword />} />
          <Route path="/deleteAccount" element={<DeleteAccuntMessage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;