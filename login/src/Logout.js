import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("cust")) {
                localStorage.removeItem(key);
            }
        }
        // localStorage.removeItem('cart'); 
        // Redirect to login page
        navigate('/clogin');
    };

    return (
        <div className='loginForm'>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
