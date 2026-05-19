import { useState } from 'react';
import { Link, useNaviagte } from 'react-router-dom';
import api from '.../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNaviagte();
    const { Login } = useAuth();
    const [formData, setFormData] = useState({email: '', password: ''});
    const [error, setError]
}