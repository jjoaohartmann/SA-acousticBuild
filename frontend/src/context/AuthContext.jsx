import { createContext, useState, useContext, useEffect } from "react";

//cria o canal de comunicação global
const AuthContext = createContext(null);

//O provider "envolve" a aplicação e disponibiliza o estado
export function AuthProvider ({ children }) {
    const [user, setUser] = useState(null);
    const[loading, setLoading] = useState(true);

    //Ao carregar o app, verifica se já existe sessão salva
    useEffect(() => {
        const savedUser = localStorage.getItem('acousticbuild_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []); // [] = roda só uma vez, na montagem do componente
    const login = (userData, token) => {
        setUser(userData);
        localStorage.stItem('acousticbuild_user', JSON.stringify(userData));
        localStorage.setItem('acoustic_token, token')
    };

    return(
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook customizado - forma limpa de consumir o conteudo
export function useAuth(){
    return useContext(AuthContext)
}