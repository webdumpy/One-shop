import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-tabs/style/react-tabs.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const owner = JSON.parse(localStorage.getItem('ownuser'));
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (owner) {
                    const res = await axios.get(`http://localhost:5000/forders?collect=${owner.collect}`);
                    setOrders(res.data.item);
                    console.log(res.data.item);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [owner]);


    const handleAccept = async (orderId) => {
        try {
            await axios.put(`http://localhost:5000/updateOr?collect=${owner.collect}&itemId=${orderId}`, { status: 'accepted' });
            // Update the local state to reflect the change
            setOrders(prevOrders => prevOrders.map(order => {
                if (order._id === orderId) {
                    return { ...order, status: 'accepted' };
                }
                return order;
            }));
        } catch (error) {
            console.error("Error accepting order:", error);
        }
    };

    useEffect(() => {
        if (!owner) {
            alert("You Must Login First!");
            navigate('/ologin');
        }
    }, [navigate, owner]);

    const handleReject = async (orderId) => {
        try {
            await axios.put(`http://localhost:5000/updateOr?collect=${owner.collect}&itemId=${orderId}`, { status: 'rejected' });
            // Update the local state to reflect the change
            setOrders(prevOrders => prevOrders.map(order => {
                if (order._id === orderId) {
                    return { ...order, status: 'rejected' };
                }
                return order;
            }));
        } catch (error) {
            console.error("Error rejecting order:", error);
        }
    };

    const calculateTotal = (order) => {
        let total = 0;
        for (const itemName in order.cart) {
            const item = order.cart[itemName];
            total += item.quantity * item.price;
        }
        return total;
    };

    if (!owner) return null;

    return (
        <Tabs>
            <TabList style={{ marginLeft: "20px " }}>
                <Tab>Pending</Tab>
                <Tab>Accepted</Tab>
                <Tab>Rejected</Tab>
            </TabList>

            <TabPanel style={{ marginLeft: "20px " }}>
                <h2>Pending Orders</h2>
                {orders.filter(order => order.status === 'pending').map((order , index) => (
                    <div  key={order._id}>
                        <h2 style={{textDecoration:"underline" }}>Order {index + 1}: </h2>
                        <h3>{order.user.name}</h3>
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
                        <h3>Payment Method: Cash On Delivery.</h3>
                        <button style={{backgroundColor:"green",marginRight:"20px"}} onClick={() => handleAccept(order._id)}>Accept</button>
                        <button onClick={() => handleReject(order._id)}>Reject</button>
                        <hr></hr>

                    </div>
                ))}
            </TabPanel>
            <TabPanel style={{ marginLeft: "20px " }}>
                <h2>Accepted Orders</h2>
                {orders.filter(order => order.status === 'accepted').map((order , index) => (
                    <div key={order._id}>
                        <h2>Order {index + 1}: </h2>
                        <h3>{order.user.name}</h3>
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
                        <h3>Payment Method: Cash On Delivery.</h3>
                        <hr></hr>

                    </div>
                ))}
            </TabPanel>
            <TabPanel style={{ marginLeft: "20px " }}>
                <h2>Rejected Orders</h2>
                {orders.filter(order => order.status === 'rejected').map((order , index) => (
                    <div key={order._id}>
                        <h2>Order {index + 1}: </h2>
                        <h3>{order.user.name}</h3>
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
                        <h3>Payment Method: Cash On Delivery.</h3>
                        <hr></hr>

                    </div>
                ))}
            </TabPanel>
        </Tabs>
    );
};

export default Orders;
