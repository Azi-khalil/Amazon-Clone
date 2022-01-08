/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react'
import './Payment.css'
import { useStateValue } from "./StateProvider";
import { Link, useNavigate } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import { getBasketTotal } from "./reducer";
import CurrencyFormat from "react-currency-format";
import axios from './axios'
import { doc, setDoc } from "firebase/firestore"; 
import {db} from './firebase'
import UserDetails from './UserDetails';



function Payment() {
    const [{ basket, user, address }, dispatch] = useStateValue();

    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [error, setError] = useState(null)
    const [disabled, setDisabled] = useState(true)
    const [succeeded, setSucceeded] = useState(false)
    const [processing, setProcessing] = useState("")
    const [clientSecret, setClientSecret] = useState("")
  
    useEffect(() => {
        const getClientSecret = async () => {
           const response = await axios ({
                method: 'post',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
           })
           setClientSecret(response.data.clientSecret)
        }
        getClientSecret()
    }, [basket])

    
    const handleSubmit = async (event) => {
      if(user){
         // do all the fancy stripe stuff...
         event.preventDefault();
         setProcessing(true);
 
         const payload = await stripe.confirmCardPayment(clientSecret, {
             payment_method: {
                 card: elements.getElement(CardElement)
             }
         }).then(({ paymentIntent }) => {
 
             const userRef = doc(db, "users", user?.uid, "orders", paymentIntent.id);
               setDoc(userRef, {
                 basket: basket,
                 amount: paymentIntent.amount,
                 created: paymentIntent.created
               });
 
             setSucceeded(true);
             setError(null)
             setProcessing(false)
 
             dispatch({
                 type: 'EMPTY_BASKET'
             })
 
             
           navigate('/orders', { replace: true })
         })
      } else {
          alert("Please Log in to complete purchase ")
          navigate('/login',)
      }
       

    }

    const handleChange = (e) => {
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "")
        setProcessing(false)
        if(!address) {
            alert('Fill in your address first')
        }
        if(basket.length === 0){
            alert('Your basket is emprty!!')
        }
    }

    return (
        <div className='payment'>
            <div className="payment__container">
                <h1>
                    Checkout {<Link to='./checkout'>{basket?.length} items</Link>}
                </h1>

                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        {!address ? <Link to='/details'><button>Click here to fill in your Address</button></Link> : 
                            <div>
                                <p>{address?.name}</p>
                                <p>{user?.email}</p>
                                <p>{address?.street}</p>
                                <p>{address?.town}</p>
                                <p>{address?.code}</p>
                            </div>
                        }   
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Order Details</h3>
                    </div>
                    <div className="payment__items">
                    {basket.map((item, i) => (
                        <CheckoutProduct 
                            key={i}
                            id={item.id}
                            title={item.title}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}  />
                    ))}
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                        <form onSubmit={handleSubmit}>
                            <CardElement  onChange={handleChange}/>
                            <div className="payment__priceContainer">
                            <CurrencyFormat
                                    renderText={(value) => (
                                    <>
                                        <h3>Order Value: {value} </h3>
                                    </>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)} // Part of the homework
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"£"}
                                />
                            <button disabled={disabled || processing || succeeded }>
                                <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                            </button> 
                            </div>
                          {error && <div>{error}</div>}  
                        </form>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
export default Payment
