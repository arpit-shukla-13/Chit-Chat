import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiSearch, FiShield } from 'react-icons/fi';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8 fade-in">
            <div className="text-center max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Connect Instantly, Chat Seamlessly.
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8">
                    Welcome to Chit-Chat, a modern, real-time messaging application built with cutting-edge technology for a fluid and intuitive experience.
                </p>
                <Link to="/auth">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
                        Get Started
                    </button>
                </Link>
            </div>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                <div className="p-6 bg-gray-800 rounded-lg">
                    <FiMessageSquare className="mx-auto text-blue-400 mb-4" size={40} />
                    <h3 className="text-xl font-bold mb-2">Real-Time Chat</h3>
                    <p className="text-gray-400">Experience lag-free conversations with our WebSocket-powered architecture.</p>
                </div>
                <div className="p-6 bg-gray-800 rounded-lg">
                    <FiSearch className="mx-auto text-purple-400 mb-4" size={40} />
                    <h3 className="text-xl font-bold mb-2">Find Friends</h3>
                    <p className="text-gray-400">Easily search and connect with other users on the platform.</p>
                </div>
                 <div className="p-6 bg-gray-800 rounded-lg">
                    <FiShield className="mx-auto text-green-400 mb-4" size={40} />
                    <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                    <p className="text-gray-400">Your conversations are secure, ensuring your privacy is always protected.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

