import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'react-tabs/style/react-tabs.css';

const Check = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('custuser'));

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (user && user.email) { // Check if user and user.email are defined
                    const res = await axios.get(`http://localhost:5000/corders?customer=${user.email}`);
                    setOrders(res.data.item);
                    console.log(res.data.item);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user && user.email]); // Only re-run the effect if user.email changes


    useEffect(() => {
        if (!user) {
            alert("You Must Login First!");
            navigate('/clogin');
        }
    }, [navigate, user]);

    const calculateTotal = (order) => {
        let total = 0;
        for (const itemName in order.cart) {
            const item = order.cart[itemName];
            total += item.quantity * item.price;
        }
        return total;
    };

    if (!user) return null;

    return (
        <div >
            {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Your Orders:
                </h1>
                <h4>{user.name} <Link to="/logout">Logout</Link></h4>

            </div> */}
            <div style={{ display: 'flex', paddingLeft: "1rem", justifyContent: 'space-between' }}>
                <h1 style={{ margin: "8px", textDecoration: "underline" }}>Your Orders:</h1>
                <div style={{ marginRight: "25px", fontSize: "1.5rem" }} className='storeLogout'>
                    <p >{user.name} <Link to="/logout">Logout</Link></p>
                </div>
            </div>
            <hr></hr>
            
            {orders.map((order , index) => (
                <div style={{ marginLeft: "20px" }}  key={order._id}>
                    <h2>Order {index + 1}: </h2>
                    <h3>{order.owner.shop}</h3>
                    <p>{order.user.location}</p>
                    <p>{order.user.phone}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Object.entries(order.cart).map(([itemName, item]) => (
                                <tr key={item.name}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>Rs. {item.price}</td>
                                    <td>Rs. {item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h2>Total Amount: Rs. {calculateTotal(order)}</h2>
                    <h2>Status: {order.status.toUpperCase()}</h2>
                    <h3>Payment Method: Cash On Delivery.</h3>
                    <hr></hr>
                </div>
            ))}
        </div>
    );
};

export default Check;
