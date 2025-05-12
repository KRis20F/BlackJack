import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import googleIcon from '../assets/svg/google.svg';
import twitterIcon from '../assets/svg/twitter.svg';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implementar la lógica de login
        console.log('Login data:', formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-indigo-700">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-['Press_Start_2P'] text-center mb-2">Sign In</h2>
                <p className="text-gray-600 text-center mb-8">Enter your email and password to sign in</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                            placeholder="name@mail.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                            placeholder="********"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">Remember Me</label>
                        </div>
                        <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                            Forgot password
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-['Press_Start_2P'] text-sm"
                    >
                        SIGN IN
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="w-full py-3 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center space-x-2 mb-3"
                        onClick={() => console.log('Google login')}
                    >
                        <img src={googleIcon} alt="Google" className="w-5 h-5" />
                        <span>SIGN IN WITH GOOGLE</span>
                    </button>

                    <button
                        type="button"
                        className="w-full py-3 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center space-x-2"
                        onClick={() => console.log('Twitter login')}
                    >
                        <img src={twitterIcon} alt="Twitter" className="w-5 h-5" />
                        <span>SIGN IN WITH TWITTER</span>
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Not registered?{' '}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                            Create account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
