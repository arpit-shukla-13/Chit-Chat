import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewMessageModal = ({ isOpen, onClose, onSelectUser }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setSearchResults([]);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim() === '') return setSearchResults([]);
            const search = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`http://localhost:3001/api/users?search=${searchQuery}`, { headers: { Authorization: `Bearer ${token}` } });
                    setSearchResults(res.data);
                } catch (err) { console.error("Failed to search users:", err); }
            };
            search();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, isOpen]);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">New Message</h2>
                </div>
                <div className="p-4">
                    <input type="text" placeholder="Search for a user..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div className="max-h-64 overflow-y-auto">
                    {searchResults.map(user => (
                        <div key={user._id} onClick={() => { onSelectUser({ otherUser: user }); onClose(); }} className="flex items-center p-4 cursor-pointer hover:bg-gray-700/50 transition">
                            <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center font-bold mr-4">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <p className="font-semibold text-white">{user.username}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewMessageModal;
