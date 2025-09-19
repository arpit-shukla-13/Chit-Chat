import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSidebar = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/users', {
          headers: {
            Authorization: `Bearer ${token}`, // Token ko header me bhejna zaroori hai
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Contacts</h3>
      </div>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user._id} onClick={() => onSelectUser(user)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSidebar;