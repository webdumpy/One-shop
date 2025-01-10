import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const addToCart = (item, quantity, cartKey) => {
    // Retrieve the cart from local storage
    let cart = localStorage.getItem(cartKey);
    cart = cart ? JSON.parse(cart) : {};

    // If the item is already in the cart, update the quantity
    if (item.name in cart) {
        cart[item.name].quantity = Number(cart[item.name].quantity) + Number(quantity);
    } else {
        // Add the new item to the cart
        cart[item.name] = {
            ...item,
            quantity: Number(quantity),
            max: Number(item.quantity),
        };
    }

    // Save the cart back to local storage
    localStorage.setItem(cartKey, JSON.stringify(cart));
    console.log(cart);
};


const Items = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const storeRef = useRef(JSON.parse(localStorage.getItem('custstore')));
    const [items, setItems] = useState([]);
    const [quantity, setQuantity] = useState(0); // Moved useState hook to the top level


    useEffect(() => {
        const fetchItems = async () => {
            if (storeRef.current) {
                const res = await axios.get(`http://localhost:5000/items?collect=${storeRef.current.collect}`);
                setItems(res.data.item);
                console.log(res.data.item);
            }
        };

        fetchItems();
    }, []);

    const handleAddToCart = (item) => {
        const cartKey = `cart_${user.name}_${storeRef.current.shop}`;
        let cart = localStorage.getItem(cartKey);
        cart = cart ? JSON.parse(cart) : {};
        let newQ = Number(quantity);
        console.log(cart);
        if (item.name in cart) {
            newQ = Number(newQ) + Number(cart[item.name].quantity);
        }
        if (newQ > item.quantity) {
            console.log(newQ);
            console.log(item.quantity);
            alert('You cannot add more items than available in stock {newQ}');
        } else {
            addToCart(item, quantity, cartKey);
        }
    };
    const navigate = useNavigate();
    const goToCart = () => {
        navigate('/cart');
    };
    let user = JSON.parse((localStorage.getItem('custuser')));
    user = user ? user : "NA";
    useEffect(() => {
        if (user === "NA") {
            alert("You Must Login First!");
            navigate('/clogin');
        }
    }, [navigate, user]);

    if (user === "NA")
        return null;

    return (
        <div>
        <div style={{ display: 'flex', paddingLeft: "1rem", justifyContent: 'space-between' }}>
            <h1 style={{ margin: "8px", textDecoration:"underline" }}>{storeRef.current.shop} Items</h1>
            <div style={{ marginRight: "25px", fontSize: "1.5rem" }} className='storeLogout'>
                <p >{user.name} <Link to="/ologout">Logout</Link></p>
            </div>
        </div>

        <button style={{marginLeft:"20px"}} onClick={goToCart}>Go to Cart</button>
        <hr></hr>
        <input style={{ marginLeft: "20px   " }} className="signUp" type="text" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
        {items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
            <div style={{ padding: "20px" }} key={item.id}>
                <h2>{item.name}</h2>
                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
                <p>{item.description}</p>
                <p>Price: Rs {item.price}</p>
                <p>Available Quantity: {item.quantity}</p>
                {item.quantity === 0 ? <p>Out of Stock</p> : item.quantity < 10 ? <p>Only few pieces left</p> : null}
                <input className="signUp" type="number" value={quantity} min="0" max={item.quantity} onChange={(e) => setQuantity(e.target.value)} />
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
        ))}
        <br></br>
        <hr></hr>
        <button style={{ marginLeft: "20px" , backgroundColor:  "red"}}  onClick={goToCart}>Go to Cart</button>
    </div>
    );
};

export default Items;
