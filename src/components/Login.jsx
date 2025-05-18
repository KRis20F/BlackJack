import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/game";
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch(
                `https://alvarfs-001-site1.qtempurl.com/User/${formData.username}/${formData.password}`
            );

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userId', data.id);
                console.log('Usuario logueado, ID:', data.id);

                navigate(from, { replace: true });
            } else {
                setErrorMessage('Credenciales incorrectas');
            }
        } catch (error) {
            setErrorMessage('Error al conectar con el servidor', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#301d79] font-['Press_Start_2P'] text-white">
            <div className="bg-[#301d79] border-4 border-white p-8 w-full max-w-md">
                <h2 className="text-xl text-center text-[#e4e42c] mb-6">LOGIN</h2>

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div>
                        <label className="block text-xs mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white text-black text-xs border border-white focus:outline-none"
                            placeholder="yourUsername"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white text-black text-xs border border-white focus:outline-none"
                            placeholder="********"
                            required
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-red-500 text-xs text-center">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#46e446] text-[#301d79] hover:bg-[#e4e42c] transition-colors text-xs font-['Press_Start_2P'] cursor-pointer"
                    >
                        ENTER
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
