import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/game";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        let response = null;
        let responseText = '';
        
        try {
            console.log('Intentando login con:', formData.username);
            
            response = await fetch(`http://alvarfs-001-site1.qtempurl.com/User/${formData.username}/${formData.password}`, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'application/json'
                }
            });

            responseText = await response.text();
            console.log('Respuesta del servidor:', responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = JSON.parse(responseText);
            console.log('Datos parseados:', data);
            
            if (data && data.id) {
                localStorage.setItem('userId', data.id);
                console.log('Login exitoso. ID:', data.id);
                navigate(from, { replace: true });
            } else {
                setErrorMessage('Error: Respuesta del servidor inválida');
            }
        } catch (error) {
            console.error('Error:', error);
            if (!response) {
                setErrorMessage('Error de conexión con el servidor');
            } else if (!response.ok) {
                setErrorMessage(responseText || 'Error en las credenciales');
            } else {
                setErrorMessage('Error al procesar la respuesta del servidor');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#301d79] font-['Press_Start_2P'] text-white">
            <div className="bg-[#301d79] border-4 border-white p-8 w-full max-w-md">
                <h2 className="text-xl text-center text-[#e4e42c] mb-6">LOGIN</h2>

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div>
                        <label htmlFor="username" className="block text-xs mb-2">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white text-black text-xs border border-white focus:outline-none"
                            placeholder="yourUsername"
                            required
                            autoComplete="username"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs mb-2">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white text-black text-xs border border-white focus:outline-none"
                            placeholder="********"
                            required
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-red-500 text-xs text-center break-words">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-3 ${
                            isLoading 
                                ? 'bg-gray-500 cursor-not-allowed' 
                                : 'bg-[#46e446] hover:bg-[#e4e42c]'
                        } text-[#301d79] transition-colors text-xs font-['Press_Start_2P']`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'LOADING...' : 'ENTER'}
                    </button>

                    <p className="text-center text-xs">
                        Not registered?{' '}
                        <Link to="/register" className="underline hover:text-[#e4e42c]">Create account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
