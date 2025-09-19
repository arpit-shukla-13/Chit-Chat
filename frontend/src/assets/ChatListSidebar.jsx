import React from 'react';
// We are using inline SVGs to avoid any build issues with react-icons
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const ChatListSidebar = ({ conversations, onlineUserIds, selectedUserId, loggedInUserId, onSelectConversation, onNewMessageClick, onLogout }) => {
    const loggedInUsername = localStorage.getItem('username');

    return (
        <div className="w-1/3 max-w-sm bg-gray-800 flex flex-col border-r border-gray-700">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center shadow-md">
                <h2 className="text-2xl font-bold">Chats</h2>
                <button onClick={onNewMessageClick} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition">
                    <EditIcon />
                </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
                {conversations.map(convo => {
                    // Check if the last message is unread
                    const isUnread = !convo.lastMessage.isSeen && convo.lastMessage.sender !== loggedInUserId;
                    
                    return (
                        <div key={convo._id} onClick={() => onSelectConversation(convo)} className={`flex items-center p-4 cursor-pointer border-l-4 transition ${selectedUserId === convo.otherUser._id ? 'border-blue-500 bg-gray-700/50' : 'border-transparent hover:bg-gray-700/30'}`}>
                            <div className="relative mr-4 shrink-0">
                                <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center font-bold text-xl">
                                    {convo.otherUser.username.charAt(0).toUpperCase()}
                                </div>
                                {onlineUserIds.includes(convo.otherUser._id) && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800"></div>}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className={`font-semibold ${isUnread ? 'text-white' : 'text-gray-300'}`}>{convo.otherUser.username}</p>
                                <p className={`text-sm truncate ${isUnread ? 'font-bold text-white' : 'text-gray-400'}`}>{convo.lastMessage.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer with Logout */}
            <div className="p-4 border-t border-gray-700 flex justify-between items-center bg-gray-900">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold shrink-0">
                        {loggedInUsername?.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-semibold truncate">{loggedInUsername}</p>
                </div>
                <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-lg transition">
                    <LogoutIcon />
                </button>
            </div>
        </div>
    );
};

export default ChatListSidebar;

