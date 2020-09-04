import React, {useContext} from 'react'
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Navbar = () => {

  const auth = useContext(AuthContext)

  const logoutHandler = (event) => {
    event.preventDefault()
    auth.logout()
  }

  return (
  <nav>
    <div className="nav-wrapper pink lighten-3" id='navbar'>
      <a href="/" className="brand-logo">Chatrooms</a>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><NavLink to='/create'>Create New Chat</NavLink></li>
        <li><NavLink to='#'>*Myself Chat*</NavLink></li>
        <li><a href="/" onClick={logoutHandler}>Log Out</a></li>
      </ul>
    </div>
  </nav>
  )
}