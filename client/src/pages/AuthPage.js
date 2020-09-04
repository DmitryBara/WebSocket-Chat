import React from 'react'
import {Switch, Route, BrowserRouter, Link} from 'react-router-dom'

import {AuthRegisterComp, AuthLoginComp} from '../components/AuthComp'


// Root Auth Component
export const AuthPage = () => {
  
  return (
    <BrowserRouter>
    <div className="row">
      <div className="col s6 offset-s3">
        <div className="card pink lighten-3" id='auth'>
          <div className="card-content white-text">
            <span className="card-title">Authorizathion</span>
            <p id='p-up'>Only authenticated users can create and connect to chatrooms.</p>

            <Link to='/registration'>Sign Up</Link>
            {'\u00A0'}{'\u00A0'}{'\u00A0'}
            <Link to='/login'>Log In</Link>
            
            <Switch>
                <Route path='/registration' component={AuthRegisterComp} />
                <Route path='/login' component={AuthLoginComp} />
            </Switch>

          </div>
        </div>
      </div>
    </div> 
    </BrowserRouter>
  )
}