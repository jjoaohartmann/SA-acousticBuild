import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

export default function Dashboard(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const headleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.logo}>AcousticBuild</h1>
                <div style={styles.headerRight}>
                    <span style={styles.welcomeText}>Olá, {user?.name} </span>
                    <button onClick={handleLogout} style={styles.logoutbtn}> Sair </button>
                </div>
            </header>

            <main style={styles.main}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Login realizado com sucesso!</h2>
                    <p style={styles.cardText}>
                        Você está autenticado como <strong>{user?.email}</strong>
                    </p>
                    <p style={styles.cardText}>
                        O bac-end e o front estão se comunicando perfeitamento
                    </p>
                </div>
            </main>
        </div>
    )
}