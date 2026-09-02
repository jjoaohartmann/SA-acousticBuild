import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Support from './pages/Support';
import UserProfile from './pages/UserProfile';
import Calculator from './pages/Calculator';
import MySimulations from './pages/MySimulations';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/profile" /> : <Register />} />
      <Route path="/suporte" element={<Support />} />
      <Route path="/profile" element={
        <PrivateRoute>
          <UserProfile />
        </PrivateRoute>
      } />
      {/* NOVAS ROTAS */}
      <Route path="/calculadora" element={<Calculator />} />
      <Route path="/minhas-simulacoes" element={
        <PrivateRoute>
          <MySimulations />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
