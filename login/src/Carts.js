import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState({});
    const storeRef = useRef(JSON.parse(localStorage.getItem('custstore')));
    let user = JSON.parse((localStorage.getItem('custuser')));
    const cartKey = `cart_${user.name}_${storeRef.current.shop}`;
    user = user ? user : "NA";

    useEffect(() => {
        if (user === "NA") {
            alert("You Must Login First!");
            navigate('/clogin');
        }
    }, [navigate, user]);

    useEffect(() => {
        // Retrieve the cart from local storage
        let localCart = localStorage.getItem(cartKey);
        setCart(localCart ? JSON.parse(localCart) : {});
    }, [cartKey]);

    const calculateTotal = useCallback(() => {
        return Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    const handleQuantityChange = useCallback((itemName, delta) => {
        setCart(prevCart => {
            const newCart = { ...prevCart };
            if (newCart[itemName].quantity + delta > newCart[itemName].max) {
                alert("Maximum Quantity Reached");
            } else {
                newCart[itemName].quantity += delta;
                if (newCart[itemName].quantity <= 0) {
                    delete newCart[itemName];
                }
            }
            localStorage.setItem(cartKey, JSON.stringify(newCart));
            return newCart;
        });
    }, [cartKey]);

    const handleRemoveItem = useCallback((itemName) => {
        setCart(prevCart => {
            const newCart = { ...prevCart };
            delete newCart[itemName];
            localStorage.setItem(cartKey, JSON.stringify(newCart));
            return newCart;
        });
    }, [cartKey]);

    const handleCheckout = async () => {
        const order = {
            user: user,
            cart: cart,
            owner: storeRef.current,
            status: 'pending'
        };
        console.log(order);
        await axios.post(`http://localhost:5000/orders?collect=${storeRef.current.collect}&name=${storeRef.current.shop}`, order);
        localStorage.removeItem(cartKey);
        alert('Proceeding to checkout...');
        navigate('/checkout');
        // Add your checkout logic here
    };

    if (user === "NA")
        return null;

    return (
        <div>
            <div style={{ display: 'flex', paddingLeft: "1rem", justifyContent: 'space-between' }}>
                <h1 style={{ margin: "8px" }}>Cart From {storeRef.current.shop}</h1>
                <div style={{ marginRight: "25px", fontSize: "1.5rem" }} className='storeLogout'>
                    <p>{user.name} <Link to="/logout">Logout</Link></p>
                </div>
            </div>
            <table style={{ marginLeft: "20px" }}>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(cart).map(item => (
                        <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>
                                <button onClick={() => handleQuantityChange(item.name, -0.5)}>-</button>
                                {item.quantity}
                                <button onClick={() => handleQuantityChange(item.name, 0.5)}>+</button>
                            </td>
                            <td>Rs. {item.price}</td>
                            <td>Rs. {item.price * item.quantity}</td>
                            <td>
                                <button onClick={() => handleRemoveItem(item.name)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p style={{ margin: "20px 20px 10px 20px", fontSize: "1.8rem" }}>Total Amount: Rs. {calculateTotal()}</p>
            <div style={{ margin: "20px 20px 10px 20px", justifyContent: "center" }}>
                <button onClick={handleCheckout}>Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default Cart;
