import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import {routes} from './routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/home" element={<MainLayout />}>
            {routes}
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;