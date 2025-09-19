import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
// Corrected import paths to remove file extension for bundler compatibility
import ChatListSidebar from './ChatListSidebar';
import NewMessageModal from './NewMessageModal';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Using inline SVGs to avoid extra dependencies or build issues
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);
const WelcomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);
const CheckIcon = () => ( // Sent
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const DoubleCheckIcon = () => ( // Seen
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 17l5-5-5-5"></path><path d="M6 17l5-5-5-5"></path></svg>
);


const ChatPage = () => {
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messageList, setMessageList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [onlineUserIds, setOnlineUserIds] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const messagesEndRef = useRef(null);
    
    const loggedInUsername = localStorage.getItem('username');
    const loggedInUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // Effect for initializing socket and all real-time listeners
    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }
        const newSocket = io(API_BASE_URL, { auth: { token } });
        setSocket(newSocket);
        
        newSocket.on('online_users_update', (userIds) => setOnlineUserIds(userIds));
        
        newSocket.on('receive_private_message', (newMessage) => {
            const partnerId = selectedUser?._id;

            // ## START: FIX for real-time message display ##
            // Check if the message belongs to the currently active conversation
            const isRelevant = 
                (newMessage.sender._id === loggedInUserId && newMessage.recipient === partnerId) ||
                (newMessage.sender._id === partnerId && newMessage.recipient === loggedInUserId);

            if (isRelevant) {
                setMessageList((list) => [...list, newMessage]);
                // If the incoming message is from the other user, mark it as seen
                if (newMessage.sender._id === partnerId) {
                    newSocket.emit('mark_messages_as_seen', { senderId: partnerId });
                }
            }
            // ## END: FIX for real-time message display ##

            setConversations(prev => {
                // Determine the other user in the conversation for sidebar update
                const otherUserId = newMessage.sender._id === loggedInUserId ? newMessage.recipient : newMessage.sender._id;
                const convoIndex = prev.findIndex(c => c.otherUser._id === otherUserId);
                
                if (convoIndex > -1) {
                    const updatedConvo = { ...prev[convoIndex], lastMessage: newMessage };
                    const otherConvos = prev.filter(c => c.otherUser._id !== otherUserId);
                    return [updatedConvo, ...otherConvos];
                }
                // If it's a new conversation, it will appear on next refresh/fetch.
                // A more advanced implementation would fetch the new conversation details here.
                return prev;
            });
        });
        
        newSocket.on('user_typing', ({ senderId }) => {
            if (selectedUser && selectedUser._id === senderId) {
                setTypingUser(selectedUser.username);
                setTimeout(() => setTypingUser(null), 3000);
            }
        });
        
        newSocket.on('messages_seen_by_recipient', ({ conversationPartnerId }) => {
            if (selectedUser && selectedUser._id === conversationPartnerId) {
                setMessageList(prev => prev.map(msg => ({ ...msg, isSeen: true })));
            }
            setConversations(prev => prev.map(c => 
                c.otherUser._id === conversationPartnerId ? { ...c, lastMessage: { ...c.lastMessage, isSeen: true } } : c
            ));
        });

        return () => {
            newSocket.off('online_users_update');
            newSocket.off('receive_private_message');
            newSocket.off('user_typing');
            newSocket.off('messages_seen_by_recipient');
            newSocket.disconnect();
        };
    }, [token, navigate, selectedUser, loggedInUserId]); // Added loggedInUserId to dependency array

    // Effect for fetching initial conversations
    useEffect(() => {
        if (token) {
            axios.get(`${API_BASE_URL}/api/conversations`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setConversations(res.data))
                .catch(err => console.error('Failed to fetch conversations:', err));
        }
    }, [token]);

    // Effect for auto-scrolling
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messageList]);
    
    const handleSelectConversation = async (conversation) => {
        const user = conversation.otherUser;
        setSelectedUser(user);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/messages/${user._id}`, { headers: { Authorization: `Bearer ${token}` } });
            setMessageList(res.data);

            const hasUnread = res.data.some(msg => !msg.isSeen && msg.sender._id === user._id);
            if (hasUnread && socket) {
                socket.emit('mark_messages_as_seen', { senderId: user._id });
                setConversations(prev => prev.map(c => 
                    c.otherUser._id === user._id ? { ...c, lastMessage: { ...c.lastMessage, isSeen: true } } : c
                ));
            }
        } catch (err) {
            setMessageList([]);
        }
    };
    
    const sendMessage = async () => {
        if (currentMessage.trim() === "" || !socket || !selectedUser) return;
        
        await socket.emit("private_message", { recipientId: selectedUser._id, text: currentMessage });
        setCurrentMessage("");
    };

    const handleTyping = (e) => {
        setCurrentMessage(e.target.value);
        if (socket && selectedUser) {
            socket.emit('typing', { recipientId: selectedUser._id });
        }
    };
    
    const handleLogout = () => {
        if (socket) socket.disconnect();
        localStorage.clear();
        navigate('/auth');
    };
    
    return (
        <div className="h-screen w-screen flex bg-gray-900 text-gray-100 font-sans">
            <ChatListSidebar 
                conversations={conversations} 
                onlineUserIds={onlineUserIds}
                selectedUserId={selectedUser?._id}
                loggedInUserId={loggedInUserId}
                onSelectConversation={handleSelectConversation}
                onNewMessageClick={() => setIsModalOpen(true)}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="flex items-center p-4 border-b border-gray-700 shadow-md">
                            <div className="relative mr-4 shrink-0">
                                <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center font-bold">
                                    {selectedUser.username.charAt(0).toUpperCase()}
                                </div>
                                {onlineUserIds.includes(selectedUser._id) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>}
                            </div>
                            <h2 className="text-xl font-semibold">{selectedUser.username}</h2>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {messageList.map((msg) => (
                                <div key={msg._id} className={`flex flex-col ${msg.sender.username === loggedInUsername ? 'items-end' : 'items-start'}`}>
                                    <div className={`py-2 px-4 rounded-2xl max-w-lg shadow ${msg.sender.username === loggedInUsername ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                                        <p className="break-words">{msg.text}</p>
                                    </div>
                                    {msg.sender.username === loggedInUsername && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                            {msg.isSeen ? <DoubleCheckIcon /> : <CheckIcon />}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        {typingUser && <div className="px-6 pb-2 text-sm text-gray-400 animate-pulse">{typingUser} is typing...</div>}

                        <div className="p-4 border-t border-gray-700">
                            <div className="flex items-center bg-gray-700 rounded-lg">
                                <input
                                    type="text"
                                    value={currentMessage}
                                    onChange={handleTyping}
                                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent p-3 text-white placeholder-gray-400 focus:outline-none"
                                />
                                <button onClick={sendMessage} className="p-3 text-gray-400 hover:text-blue-400 transition">
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                        <WelcomeIcon />
                        <h2 className="mt-4 text-2xl font-semibold">Welcome to Chit-Chat</h2>
                        <p>Select a conversation from the left to start messaging.</p>
                    </div>
                )}
            </div>
            <NewMessageModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectUser={handleSelectConversation}
            />
        </div>
    );
};

export default ChatPage;

