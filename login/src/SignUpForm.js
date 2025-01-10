import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory

const SignupForm = () => {
    const navigate = useNavigate(); // Initialize useHistory

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        location: ''
    });

    const { name, phone, email, password, location } = formData;

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();

        console.log('Submitting form...');
        try {
            const res = await axios.post('http://localhost:5000/signup', formData);
            console.log('Response:', res.data);
            navigate('/clogin'); // Redirect to login page on successful signup
        } catch (err) {
            console.error('Error:', err.response && err.response.data ? err.response.data.message : err);
        }
    };

    return (
        <div className='signUpContainer'>
            <form className="signForm" onSubmit={handleSubmit}>
                <input className="signUp" type="text" placeholder="Name" name="name" value={name} onChange={handleChange} required />
                <br></br>
                <input className="signUp" type="text" placeholder="Phone" name="phone" value={phone} onChange={handleChange} required />
                <br></br>
                <input className="signUp" type="email" placeholder="Email" name="email" value={email} onChange={handleChange} required />
                <br></br>
                <input className="signUp" type="password" placeholder="Password" name="password" value={password} onChange={handleChange} required />
                <br></br>
                <input className="signUp" type="text" placeholder="Location" name="location" value={location} onChange={handleChange} required />
                <br></br>
                <button className="signUpBtn" type="submit">Sign Up</button>
                <br></br>
                <p>Already a Customer? <a href="/clogin">Login Here</a></p>
            </form>
        </div>
    );
};

export default SignupForm;
