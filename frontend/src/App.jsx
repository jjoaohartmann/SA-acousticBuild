import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import login from './pages/Login';
import Register from './pages/Register';
import dashboard from './pages/Dashboard'

//Rota protegida - redireciona para login se não estiver autenticado
function PrivateRoute({children}) {
    const { user, loading } = useAuth();
    if (loading) return <div>Carregando...</div>;
    return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
    const { user } = useAuth();
    return (
        <Routes>
            {/* se já estiver logado redireciona "/" para o dashboard */}
            <Route path="/" element={<navigate to={user ? "/dashboard" : "/login"} />} />
            <Router path="/login" element={<Login />} />
            <Router patch="/register" element={<Register />} />
            <Route patch="/dashboard" element={
                <PrivateRoute>
                    <dashboard />
                </PrivateRoute>
            } />
        </Routes>
    );
}

export default function App() {
    return(
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}