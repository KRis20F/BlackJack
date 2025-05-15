import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            alert('Passwords must have at least 6 characters');
            return;
        }

        try {
            const response = await fetch('http://alvarfs-001-site1.qtempurl.com/User/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userId', data.id);
                navigate('/');
            } else {
                alert('Error creating account. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Network error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#301d79] font-['Press_Start_2P'] text-white">
            <div className="bg-[#301d79] border-4 border-white p-8 w-full max-w-md">
                <h2 className="text-xl text-[#e4e42c]  text-center mb-4">REGISTER</h2>

                <form onSubmit={handleSubmit} className="space-y-8">
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

                    <div>
                        <label className="block text-xs mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white text-black text-xs border border-white focus:outline-none"
                            placeholder="********"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#46e446] text-[#301d79] hover:bg-[#e4e42c] transition-colors text-xs font-['Press_Start_2P'] cursor-pointer"
                    >
                        CREATE ACCOUNT
                    </button>


                    <p className="text-center text-xs">
                        You have an account?{' '}
                        <Link to="/login" className="underline hover:text-[#e4e42c]">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
