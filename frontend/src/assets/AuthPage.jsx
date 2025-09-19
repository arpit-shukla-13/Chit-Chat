import React, { useState } from 'react';
import LoginPage from './Login';
import RegisterPage from './Register';
import { FiMessageSquare } from 'react-icons/fi';

const AuthPage = () => {
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 fade-in">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Left Side: Visuals */}
                <div className="hidden lg:block p-12 bg-gradient-to-br from-blue-900 to-purple-900">
                    <h2 className="text-4xl font-extrabold text-white mb-4">Join the Conversation</h2>
                    <p className="text-blue-200 text-lg">
                        Chit-Chat brings you closer to the people you care about. Sign up to start chatting today.
                    </p>
                    <div className="mt-12 h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
                        <FiMessageSquare size={80} className="text-blue-300 opacity-50" />
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:p-12">
                    <div className="flex mb-8">
                        <button onClick={() => setAuthMode('login')} className={`px-6 py-2 font-bold text-lg rounded-l-lg transition ${authMode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                            Login
                        </button>
                        <button onClick={() => setAuthMode('register')} className={`px-6 py-2 font-bold text-lg rounded-r-lg transition ${authMode === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                            Sign Up
                        </button>
                    </div>
                    {authMode === 'login' ? <LoginPage /> : <RegisterPage setAuthMode={setAuthMode} />}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

