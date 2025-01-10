
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './Home';

//Customer
import SignupForm from './SignUpForm';
import LoginForm from './LoginForm';
import Logout from './Logout';
import Items from './Items';
import Cart from './Carts';
import Stores from './Stores';
import Check from './CheckOut';

//Owner
import OwnerSignup from './OwnerSU';
import OwnerLogin from './OwnerL';
import OLogout from './Ownlogout';
import PreItems from './PreItems';
import AddItem from './AddItem';
import Orders from './Orders';


const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/csignup" element={<SignupForm />} />
          <Route path="/clogin" element={<LoginForm />} />
          <Route path="/osignup" element={<OwnerSignup />} />
          <Route path="/ologin" element={<OwnerLogin />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/items" element={<Items />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/preitems" element={<PreItems />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/ologout" element={<OLogout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Check />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
