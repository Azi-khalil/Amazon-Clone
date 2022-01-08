import React, { useState}from 'react'
import './Details.css'
import {Link, useNavigate} from 'react-router-dom'
import { useStateValue } from "./StateProvider";
import { doc, setDoc } from "firebase/firestore"; 
import {db} from './firebase'
import UserDetails from './UserDetails';

function Details() {
    const navigate = useNavigate();
    const [{ user, address}, dispatch] = useStateValue();
    const [name, setName] = useState()
    const [number, setNumber] = useState()
    const [street, setStreet] = useState()
    const [town, setTown] = useState()
    const [code, setCode] = useState()

    const details = {
        name: name,
        number: number,
        street: street,
        town: town,
        code: code,
    }
    
    const detailsHandler = async (event) => {
        event.preventDefault()
        if(!details.name || !details.number || !details.street || !details.town || !details.code ){
            alert('You must fill in all fields')
        }
        const detailsRef = doc(db, "users", user?.uid, "address", "details");
            setDoc(detailsRef, {
                address: details
            });
            dispatch({
                type: "CHANGE-DETAILS",
                address: details
            })
        navigate('/',)
    }


    return (
    <div>
        {user && address ? <UserDetails /> : 
            <form className='details' onSubmit={detailsHandler}>
            <Link to='/'>
                <img
                    className="details__logo"
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png'
                    alt='' 
                />
            </Link>
            <div className="details__container">
                <h1>Your Details</h1>
                <input type="text" name="name" placeholder="Full name" onChange={(e) => {setName(e.target.value)}} />
                <input type="text" name="number" placeholder="Phone number" onChange={(e) => {setNumber(e.target.value)}} />
                <input type="text" name="street" placeholder="Street Name" onChange={(e) => {setStreet(e.target.value)}} />
                <input type="text" name="town" placeholder="City/Town" onChange={(e) => {setTown(e.target.value)}}  />
                <input type="text" name="code" placeholder="Postcode" onChange={(e) => {setCode(e.target.value)}}  />
            </div>
            <button type="submit" >Submit</button>
        </form>
        }
        
    </div>
    )
}

export default Details
