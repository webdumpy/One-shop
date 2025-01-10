import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const PreItems = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const storeRef = useRef(JSON.parse(localStorage.getItem('ownuser')));
    const [items, setItems] = useState([]);
    const [updatedItem, setUpdatedItem] = useState({});
    let user = JSON.parse(localStorage.getItem('ownuser'));
    user = user ? user : "NA";

    useEffect(() => {
        if (user === "NA") {
            alert("You Must Login First!");
            navigate('/ologin');
        }
    }, [navigate, user]);


    const fetchItems = async () => {
        if (storeRef.current) {
            try {
                const res = await axios.get(`http://localhost:5000/items?collect=${storeRef.current.collect}`);
                setItems(res.data.item);
                console.log(res.data.item);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        }
    };

    const deleteItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/delItem?collect=${storeRef.current.collect}&itemId=${itemId}`);
            setItems(items.filter(item => item.name !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const updateItem = async (itemId, updatedData) => {
        try {
            updatedData.quantity = parseInt(updatedData.quantity);
            await axios.put(`http://localhost:5000/update?collect=${storeRef.current.collect}&itemId=${itemId}`, updatedData);
            fetchItems();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    if (user === "NA") {
        return null;
    }

    return (
        <div>
            <div style={{ display: 'flex', paddingLeft: "1rem", justifyContent: 'space-between' }}>
                <h1 style={{ margin: "8px" }}>{storeRef.current.shop} Items</h1>
                <div style={{ marginRight: "25px", fontSize: "1.5rem" }} className='storeLogout'>
                    <p>{storeRef.current.name} <Link to="/ologout">Logout</Link></p>
                </div>
            </div>
            <Link to="/add">
                <button style={{marginLeft:"20px"}}>Add New Item</button>
            </Link>
            <Link to="/orders">
                <button style={{ marginLeft: "20px" }}>Check Your Orders</button>
            </Link>
            <hr></hr>
            <input style={{marginLeft:"20px"}} className="signUp" type="text" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
            {items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                <div style={{padding:"20px"}} key={item.id}>
                    <p style={{fontSize:"2.5rem", margin:"0px", fontWeight:"bold"}}> {item.name}</p>
                    <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
                    <p>{item.description}</p>
                    <p>{item.category}</p>
                    <p>Price: Rs {item.price}</p>
                    <p>Available Quantity: {item.quantity}</p>
                    {item.quantity === 0 ? <p>Out of Stock</p> : item.quantity < 10 ? <p>Only few pieces left</p> : null}
                    <button onClick={() => deleteItem(item.name)}>Delete</button>
                    <br></br>
                    <br></br>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const newQuantity = updatedItem.quantity !== '' ? updatedItem.quantity : item.quantity;
                        const newPrice = updatedItem.price !== '' ? updatedItem.price : item.price;
                        updateItem(item.name, { price: newPrice, quantity: newQuantity });
                    }}>
                        <input
                            className='signUp'
                            type="number"
                            placeholder="New Price"
                            value={updatedItem.price || ''}
                            onChange={(e) => setUpdatedItem({ ...updatedItem, price: e.target.value })}
                        />
                        <input
                            className='signUp'
                            type="number"
                            placeholder="New Quantity"
                            value={updatedItem.quantity || ''}
                            onChange={(e) => setUpdatedItem({ ...updatedItem, quantity: e.target.value })}
                        />
                        <button style={{position:"relative" , left:"20px", top:"3px"}} type="submit">Update</button>
                        <br></br>
                        <br></br>
                        <hr></hr>
                        {/* <br></br> */}
                    </form>
                </div>
            ))}
        </div>
    );
};

export default PreItems;