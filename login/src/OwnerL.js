// LoginForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory
// const { fetchStores } = require('./storesDb');

const OwnerLogin = () => {
    const navigate = useNavigate(); // Initialize useHistory
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    });
    const [message, setMessage] = useState(''); // Initialize message state
    // const [errorMessage, setErrorMessage] = useState(''); // Initialize error message state

    const { name, password } = formData;

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/ologin', formData);
            setMessage(res.data.message);
            console.log(res.data);
            if (res && res.data && res.data.message === "Login successful") {
                const user=res.data.user;
                localStorage.setItem('ownuser', JSON.stringify(user));
                navigate('/preitems');
            }
        } catch (err) {
            console.error(err.response.data.message);
        }
    };
    
    return (
        <div className='loginForm'>   
            <form onSubmit={handleSubmit}>
                <input className="signUp" type="text" placeholder="Name" name="name" value={name} onChange={handleChange} required /><br></br>
                <input className="signUp" type="password" placeholder="Password" name="password" value={password} onChange={handleChange} required /><br/>
                <button className="signUpBtn" type="submit">Login</button>
                {message && <p>{message}</p>}
                <p>Don't have an account? <a href="/csignup">SignUp Here</a></p>
            </form>
        </div>
    );
};

export default OwnerLogin;
