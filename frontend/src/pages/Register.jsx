import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: ''});
    const [error, setErrror] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrror('');
        setLoading(True);
        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.detail;
            setErrror(msg || 'Erro ao cadastrar. Tente novamente');
        } finally{
            setLoading(false)
        }
    };

    return (
        <div style={StyleS.container}>

            {/* Painel Azul - Esquerda */}
            <div style={styleS.panel}>
                <div style={styleS.panelContent}>
                    <h1 style={styles.panelTitle}>AcousticBuild</h1>
                    <p style={styles.panelSubtitle}>
                        Gerencie seus projetos com eficiência e estilo
                    </p>
                    <div style={styles.panelDecoration} />
                </div>
            </div>
        

        {/* Painel registro - direita */}
            <div style={styles.formSide}>
                <div style={styles.formBox}>
                    <h2 style={styles.formTitle}>Criar Conta</h2>
                    <p style={styles.formSubtitle}>Preencha os dados para começar</p>

                    {error && <div style={styles.errorBox}>{error}</div>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nome Completo</label>
                            <input 
                            style={styles.input}
                            type="text"
                            name='name'
                            placeholder='Seu Nome'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.lable}>E-mail</label>
                            <input
                            style={styles.input} 
                            type="email" 
                            name='email'
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Senha</label>
                            <input
                            style={styles.input} 
                            type="password"
                            name="password"
                            placeholder="Mínimo de 6 caracteres"
                            value={formData.password}
                            onChange={handleChange}
                            required 
                            />
                        </div>

                        <button
                            type="submit"
                            style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
                            disabled={loading}
                        >
                            {loading ? 'Cadastrando...' : 'Criar conta'}
                        </button>
                    </form>

                    <p style={styles.switchText}>
                        Já tem uma conta?{' '}
                        <Link to="/login" style={styles.link}>Entrar</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
    },

    // Painel azul
    panel: {
        flex: 1,
        background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
    },

    panelContent: {
        color: 'white',
        maxWhidth: '360px',
    },

    panelTitle:{
        fontSize: '2.8rem',
        fontWeight: '800',
        marginBottom: '16px',
        letterSpacing: '-1px',
    },
    panelSubtitle: {
        fontSize: '1.1rem',
        opacity: 0.85,
        lineHeight: '1.6',
        marginBottom: '40px',
    },
    panelDecoration: {
        width: '60px',
        height: '4px',
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '2px',
    },

    // Formulário
    formSide: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        padding: '40px',
    },
    formBox: {
        width: '100%',
        maxWhidth: '400px',
    },
    formTitle: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '8px',
    },
    formSubtitle:{
        color: '#64748b',
        marginBottom: '32px',
        fontSize: '0.95rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection:'column',
        gap: '6px',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight:'600',
        color: '#374151'
    },
    input: {
        padding: '12px 16px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '0.95rem',
        outline: 'none',
        background: 'white',
    },
    button:{
        padding: '13px',
        background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
    },
    buttonDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed',
    },
    errorbox: {
        background: '#fef2f2',
        border: '1px solid #fca5a5',
        color: '#dc2626',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '0.875em',
        marginBottom: '20px',
    },
    switchText:{
        textAlign: 'center',
        marginTop: '24px',
        color: '64748b',
        fontSize: '0.9rem',
    },
    link:{
        color:'1a73e8',
        fontWeight: '600',
        textDecoration: 'none'
    },
};