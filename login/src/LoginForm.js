// LoginForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory
// const { fetchStores } = require('./storesDb');

const LoginForm = () => {
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
            const res = await axios.post('http://localhost:5000/login', formData);
            setMessage(res.data.message);
            console.log(res.data);
            if (res && res.data && res.data.message === "Login successful") {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith("cust")) {
                        localStorage.removeItem(key);
                    }
                }
                console.log("Hello");
                const user = res.data.user;
                console.log(user);
                console.log("Done");
                const storesRes = await axios.get('http://localhost:5000/stores');
                const stores=storesRes.data.store;
                console.log("done366");
                console.log(stores);
                stores.sort((a, b) => calculateDistance(user.coordinates, a.coordinates) - calculateDistance(user.coordinates, b.coordinates));
                // req.session.stores=stores;
                localStorage.setItem('custuser', JSON.stringify(user));
                localStorage.setItem('custstores', JSON.stringify(stores));
                navigate('/stores');
            }
        } catch (err) {
            console.error(err.response.data.message);
        }
    };

    const calculateDistance = (coords1, coords2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(coords2.latitude - coords1.latitude);
        const dLon = deg2rad(coords2.longitude - coords1.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(coords1.latitude)) * Math.cos(deg2rad(coords2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };
    
    return (
        <div className='loginForm'>
            <form onSubmit={handleSubmit}>
                <input className="signUp" type="text" placeholder="Name" name="name" value={name} onChange={handleChange} required /> <br />
                <input className="signUp" type="password" placeholder="Password" name="password" value={password} onChange={handleChange} required />
                <br />
                <button className="signUpBtn" type="submit">Login</button>
                {message && <p>{message}</p>}
                <p>Don't have an account? <a href="/csignup">SignUp Here</a></p>
            </form>
        </div>

    );
};

export default LoginForm;
