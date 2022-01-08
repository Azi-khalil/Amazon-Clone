/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useEffect} from "react";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {db} from './firebase'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Home from "./Home";
import Header from "./Header"
import Login from "./Login"
import Checkout from "./Checkout"
import Payment from "./Payment"
import Orders from "./Orders"
import Details from "./Details"
import UserDetails from "./UserDetails";


const promise = loadStripe('pk_test_51KBIugL0OU7vEOuWfEhIh9uz7K05ko1Zkgo1mkfh8p4fO6ExQuEbSZQrF3ZcQa2v9QUXaQZ5McRgjgHfH0ahNYoV00DZzKx3dK')

function App(props) {

const [{ user, address }, dispatch] = useStateValue();
const auth = getAuth();
const location = useLocation()

useEffect(() => {
  // will only run once when the app component loads...
  onAuthStateChanged(auth, async(user) => {
    
      if (user) {
        
        dispatch({
          type: "SET_USER",
          user: user,
        });
        const docRef = doc(db, "users", user?.uid, "address", "details");
        const docSnap = await getDoc(docRef);
          if (docSnap.exists()) { 
          dispatch({
              type: "CHANGE-DETAILS",
              address: docSnap.data().address 
          })  
        }else{console.log("No such document!");}        

      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
        dispatch({
          type: "CHANGE-DETAILS",
          address: null
        })
      }
  });
}, []);

return (
  <div className="app">
    {location.pathname !== '/login' ? <Header /> : null}
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />}/>
        <Route path="/userdetails" element={<UserDetails /> }/>
        <Route path="/details" element={user ? <Details /> : <h1>Please Log In Or Register</h1>}/>
        <Route path="/login" element={<Login />} />   
        <Route path="/orders" element={user ? <Orders /> : <h1>Please Log In Or Register</h1>} />   
        <Route path="/payment" element={
           <Elements stripe={promise}>
             <Payment />
           </Elements>  
        }/>
    </Routes>
  </div>
);
}
export default App;