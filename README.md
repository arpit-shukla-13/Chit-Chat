Chit-Chat: Real-Time Messaging Application 💬
Chit-Chat is a modern, full-stack, real-time messaging web application built with the MERN stack (MongoDB, Express, React, Node.js) and WebSockets. This application provides a smooth and interactive user experience, similar to the modern chat platforms we use daily.

Live Demo Links:

Frontend (Netlify): https://chitchatttt.netlify.app/

Backend (Render): https://chit-chat-2dgp.onrender.com/

✨ Features
Real-Time Messaging: Instant message sending and receiving using Socket.IO.

Private One-to-One Chat: Secure, private conversations between users.

User Authentication: Secure Register and Login system with JWT (JSON Web Tokens).

"Seen" Status Indicator: "Sent" (✓) and "Seen" (✓✓) receipts for messages.

Live Typing Indicator: Shows a real-time "...is typing" status to the recipient.

Online Status: A green dot indicator in the sidebar for users who are currently online.

Conversation List: The sidebar displays a list of recent chats, with the newest on top.

Start New Chat: Search for any registered user to begin a new conversation.

Modern & Responsive UI: A clean, dark-themed, and responsive design built with Tailwind CSS.


🛠️ Tech Stack
Frontend:

React.js

Tailwind CSS

React Router

Socket.IO Client

Axios

Backend:

Node.js

Express.js

MongoDB (with Mongoose)

Socket.IO

JSON Web Tokens (JWT)

bcryptjs (for password hashing)

🚀 Getting Started (Local Setup)
To run this project on your local machine, follow the steps below.

Prerequisites
Node.js (v18 or higher)

A MONGO_URI from a MongoDB Atlas account.

Backend Setup
Clone or download the project repository.

Navigate to the backend directory: cd chit-chat/backend

Install dependencies:

npm install

Create a file named .env inside the backend folder and add the following variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

Start the server:

npm start

The server will start on http://localhost:3001.

Frontend Setup
Navigate to the frontend directory: cd chit-chat/frontend

Install dependencies:

npm install

Create a file named .env inside the frontend folder and add the following variable:

VITE_API_BASE_URL=http://localhost:3001

Start the development server:

npm run dev

The application will open on http://localhost:5173.

🌐 Deployment
This application is deployed live using the following services:

Backend: Deployed as a "Web Service" on Render.

Frontend: Deployed on Netlify.
