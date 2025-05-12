import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
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
        // TODO: Implementar la lógica de registro
        console.log('Register data:', formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-indigo-700">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-['Press_Start_2P'] text-center mb-2">Create Account</h2>
                <p className="text-gray-600 text-center mb-8">Enter your details to register</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className='flex  gap-2'> 
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                            placeholder="John Doe"
                            required
                        />
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                            placeholder="********"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            required
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            I accept the{' '}
                            <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                                Terms and Conditions
                            </Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-['Press_Start_2P'] text-sm"
                    >
                        CREATE ACCOUNT
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                   

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
} 