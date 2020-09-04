import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import {useAuth} from './hooks/auth.hook'
import {useRoutes} from './routes'
import {AuthContext} from './context/AuthContext'
import {Navbar} from './components/NavbarComp'
import {Loader} from './components/LoaderComp'
import 'materialize-css'


function App() {

  const {token, login, logout, userId, ready} = useAuth()
  const isAuthorized = !!token
  const routes = useRoutes( isAuthorized )

  if (!ready) {
    return <Loader /> // if authorization check still in process
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, userId, isAuthorized }}>
    <BrowserRouter>
      { isAuthorized && <Navbar />}
      <div className="container">
        { routes }
      </div>
    </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
