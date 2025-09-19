import React, { useState } from 'react';
import axios from 'axios';

// We've replaced the react-icon with an inline SVG to remove the dependency issue.
const LoaderIcon = () => (
    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const RegisterPage = ({ setAuthMode }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await axios.post('http://localhost:3001/api/auth/register', formData);
            setSuccess('Registration successful! Please login.');
            setTimeout(() => setAuthMode('login'), 2000);
        } catch (err) {
            setError('User already exists or invalid data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 fade-in">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400 mb-6">Start your journey with Chit-Chat today.</p>
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
            {success && <p className="text-green-400 bg-green-900/50 p-3 rounded-lg">{success}</p>}
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center min-h-[48px]">
                 {loading ? <LoaderIcon /> : 'Sign Up'}
            </button>
        </form>
    );
};

export default RegisterPage;

