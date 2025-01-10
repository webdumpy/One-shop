import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddItem = () => {
    const navigate = useNavigate();
    const [item, setItem] = useState({
        name: '',
        price: 0,
        quantity: 0,
        image: '',
        description: ''
    });

    const handleChange = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    };

    const owner = JSON.parse(localStorage.getItem('ownuser'));

    let user = JSON.parse(localStorage.getItem('ownuser'));
    user = user ? user : "NA";

    useEffect(() => {
        if (user === "NA") {
            alert("You Must Login First!");
            navigate('/ologin');
        }
    }, [navigate, user]);

    const handleSubmit = async (e) => {
        console.log("DONE");
        e.preventDefault();
        const formData = new FormData();
        Object.keys(item).forEach(key => formData.append(key, item[key]));
        console.log(owner);
        // await axios.post('http://localhost:5000/addItems', formData);
        await axios.post(`http://localhost:5000/addItems?collect=${owner.collect}`, item);
        console.log("DONE");
        navigate('/preitems');
    };

    if (user === "NA") {
        return null;
    }

    return (
        <div className='loginForm'>
            <form onSubmit={handleSubmit}>
                <input className="signUp" type="text" name="name" placeholder="Item Name" onChange={handleChange} required />
                <br></br>
                <input className="signUp" type="number" name="price" placeholder="Price" onChange={handleChange} required />
                <br></br>
                <input className="signUp" type="number" name="quantity" placeholder="Quantity" onChange={handleChange} required />
                <br></br>
                <input className="signUp" type="text" name="image" placeholder="Image URL" onChange={handleChange} required />
                <br></br>
                <textarea style={{width:"95%",height:"4rem", marginTop:"5px" , position:"relative" ,left:"8px", borderRadius:"5px"}} name="description" placeholder="Description" onChange={handleChange} required />
                <br></br>
                <div style={{display:"flex", justifyContent:"center"}}><button type="submit">Add Item</button></div>
            </form>
        </div>
    );
};

export default AddItem;
