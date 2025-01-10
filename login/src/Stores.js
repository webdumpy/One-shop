import React , {useEffect} from 'react';
import { useNavigate ,  Link } from 'react-router-dom';

const Stores = () => {

    const navigate=useNavigate();
    let user = JSON.parse(localStorage.getItem('custuser'));
    const stores = JSON.parse(localStorage.getItem('custstores'));
    user = user ? user : "NA";

    useEffect(() => {
        if(user === "NA"){
            alert("You Must Login First!");
            navigate('/clogin');
        }
    }, [navigate, user]);

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

    if(user==="NA"){
        return null;
    }

    return (
        <div style={{width:"100vw"}}>
            <div style={{ display: 'flex',paddingLeft:"1rem", justifyContent: 'space-between' }}>
                    <h1 style={{margin:"8px"}}>Stores</h1>
                <div style={{marginRight:"16px", fontSize:"1.5rem"}} className='storeLogout'>
                    <p>{user.name} <Link to="/logout">Logout</Link></p>
                </div>

            </div>
            {stores.map((store) => (
                <div color='black' key={store.name} style={{ backgroundImage: `url(${store.back_img})`, padding: '20px', margin: '10px', borderRadius: '5px', opacity:'1'}}>
                    <div style={{backgroundColor:"white" , opacity:"0.7", width:"30vw"}}>
                        <h2 style={{ color: "black", marginLeft:"5px", fontWeight:"bold", textDecoration:"underline" }}>{store.shop}</h2>
                        <p style={{ color: "black", marginLeft: "5px", fontWeight: "bold" }}>{store.phone}</p>
                        <p style={{ color: "black", marginLeft: "5px", fontWeight: "bold" }}>{store.location}</p>
                        <p style={{ color: "black", marginLeft: "5px", fontWeight: "bold" }}>Distance: {calculateDistance(user.coordinates, store.coordinates).toFixed(3)} km</p>
                        <Link
                            to={{ pathname: '/items' }}
                            onClick={() => {
                                const currentStore = JSON.parse(localStorage.getItem('custstore'));
                                if (JSON.stringify(currentStore) !== JSON.stringify(store)) {
                                    localStorage.setItem('custstore', JSON.stringify(store));
                                }
                            }}

                            style={{marginLeft:"5px", fontWeight:"bold"}}
                        >
                            View Items
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );

};

export default Stores;
