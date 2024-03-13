import React from 'react';
import { Link, useNavigate } from 'react-router-dom'

const Nav = () => {
    const auth = localStorage.getItem("user");
    const navigate = useNavigate()

    const logout = () => {
        localStorage.clear()
        navigate('/signup')
    }
    return (
        <div>
           <img className='logo' src='https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_640.png' alt='logo'/>
            {auth ? <ul className='nav-ul'>
                <li><Link to="/">Products</Link></li>
                <li><Link to="/add">Add Product</Link></li>
                <li><Link to="/update">Update Product</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/signup" onClick={logout}>Logout({JSON.parse(auth).name})</Link></li>
            </ul>

                :
                <ul className='nav-ul nav-right'>
                    <li><Link to="/signup">Sign up</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            }




        </div>
    )
}

export default Nav;