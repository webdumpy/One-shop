import React from 'react';
import { useNavigate } from 'react-router-dom';

const OLogout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem('ownuser');

        // Redirect to login page
        navigate('/ologin');
    };

    return (
        <div className='loginForm'>
        <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default OLogout;
