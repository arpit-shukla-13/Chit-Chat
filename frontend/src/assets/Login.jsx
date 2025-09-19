import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Using inline SVG for the loader to avoid extra dependencies
const LoaderIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:3001/api/auth/login', formData);
            
            // Save token, username, AND userId to localStorage
            localStorage.setItem('token', res.data.token); 
            localStorage.setItem('username', res.data.user.username); 
            localStorage.setItem('userId', res.data.user.id); // <-- IMPORTANT: Save User ID

            navigate('/chat'); 
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            console.error('Login failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="w-full max-w-md p-8 space-y-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-white">Welcome Back!</h2>
                    <p className="mt-2 text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/auth?mode=signup" className="font-medium text-blue-400 hover:text-blue-300">
                            Sign up
                        </Link>
                    </p>
                </div>

                {error && <div className="p-3 text-sm text-red-200 bg-red-800/50 rounded-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input id="email" name="email" type="email" autoComplete="email" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email address" />
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Password" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed">
                        {loading ? <LoaderIcon /> : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

