import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OwnerSignup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        shop: '',
        email: '',
        password: '',
        collection: '',
        back_img: '',
        location: ''
    });

    const { name, phone, shop, email, password, location, collect, back_img } = formData;

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();

        console.log('Submitting form...');
        try {
            const res = await axios.post('http://localhost:5000/osignup', formData);
            console.log('Response:', res.data);
            navigate('/ologin'); // Redirect to login page on successful signup
        } catch (err) {
            console.error('Error:', err.response && err.response.data ? err.response.data.message : err);
        }
    };

    return (
        <div className='signUpContainer'>
        <form onSubmit={handleSubmit}>
            <input className="signUp" type="text" placeholder="Name" name="name" value={name} onChange={handleChange} required />
            <br></br>
            <input className="signUp" type="text" placeholder="Phone" name="phone" value={phone} onChange={handleChange} required />
            <br></br>
            <input className="signUp" type="text" placeholder="Shop Name" name="shop" value={shop} onChange={handleChange} required />
            <br></br>
            <input className="signUp" type="email" placeholder="Email" name="email" value={email} onChange={handleChange} required />
            <br></br>
            <input className="signUp" type="password" placeholder="Password" name="password" value={password} onChange={handleChange} required />
            <br></br>
            <input className="signUp" type="text" placeholder="Location" name="location" value={location} onChange={handleChange} required />
            <br></br>
            <input className="signUp" type="text" placeholder="Collection" name="collect" value={collect} onChange={handleChange} required />
            <br></br>
            <input className="signUp" type="text" placeholder="Background Image URL" name="back_img" value={back_img} onChange={handleChange} required />
            <br></br>
            <div style={{display:"flex" , justifyContent:"center", marginTop:"1rem"}}><button  type="submit">Sign Up</button></div>
            <p>Already a Customer? <a href="/ologin">Login Here</a></p>
        </form>
    </div>
    );
};

export default OwnerSignup;
