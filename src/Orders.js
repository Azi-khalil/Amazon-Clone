/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { db } from "./firebase";
import './Orders.css'
import { useStateValue } from "./StateProvider";
import Order from './Order'
import { doc, query, orderBy, onSnapshot, collection, getDocs} from "firebase/firestore"; 

function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if(user) {
        // const orderRef = doc(db, "users", user?.uid,) 
        const q = query(collection(db, "users", user?.uid, "orders"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    })))
          });

    } else {
        setOrders([])
    }

  }, [user])

    return (
        <div className='orders'>
            <h1>Your Orders</h1>

            <div className='orders__order'>
                {orders?.map((order, i) => (
                    <Order key={i} order={order} />
                ))}
            </div>
        </div>
    )
}

export default Orders