import React from 'react'
import {Link} from 'react-router-dom'
import { useStateValue } from "./StateProvider";
import './UserDetails.css'

function UserDetails() {
    const [{ user, address}, ] = useStateValue();
   

    return (
        <div className='user__details'>
            <h1>Your Details</h1>

            <div className="userDetails__container">
                <div className='user__column'>
                    <h3>User ID: </h3>
                    <p>{user?.uid}</p>
                    <p>{user?.email}</p>
                </div>
                <div className='user__column'>
                    <h3>User Name: </h3>
                    <p>{address.name}</p>
                </div>
                <div className='user__column'>
                    <h3>User Address: </h3>
                    <p>{address.street}</p>
                    <p>{address.town}</p>
                    <p>{address.code}</p>
                </div>
            </div>

            <Link to={'/'}>
                <button>Continue Shopping </button>                  
            </Link>
        </div>
    )
}

export default UserDetails
