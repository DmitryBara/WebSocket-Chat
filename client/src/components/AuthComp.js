import React, {useState, useEffect, useContext} from 'react'

import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'



// Common resourses for both components (custom hook)
function useFormHandler ( formInputValues ) {

    // Import myself created hooks and other hooks
    const [form, setForm] = useState( formInputValues )
    const auth = useContext(AuthContext)

    // Show error message in case of backend errors
    const {loading, error, request, clearError} = useHttp()
    const message = useMessage()
    
    useEffect( () => {
      message(error)
      clearError()
    }, [error, message, clearError])
    
    // Refreshing form inputs value onChange
    const changeHandler = event => {
      setForm({...form, [event.target.name]: event.target.value })
    }

    return {form, loading, message, request, changeHandler, auth}
}




// COMPONENT for Registration Form
function AuthRegisterComp() {

  // Init resourses: hooks, forms, handlers
  const {form, loading, message, request, changeHandler, auth} = useFormHandler({email: '', login:'', password: '', rpassword: ''});

  // Make request to backend and get back message (with errors or confirmation)
  const submitHandler = async () => {
    try {
      const data = await request('/api/auth/registration', 'POST', {...form})
      
      // In future here will be email confirm, but now make auto login
      // Now its repeat logic in AuthPageLogin component
      if (data.message === "User has been created") {
        const data = await request('/api/auth/login', 'POST', {...form})
        auth.login(data.token, data.userId)
      } else {
        message(data.message) // show error
      }

    } catch (e) {} // errors already processed in useHttp hook
  }

return (
  <div className="input-container">

    <div className="input-field">
      <input 
        id="email" 
        name="email"
        type="text"
        maxLength="50"
        autoComplete="off"
        className="field"
        value={form.email}
        onChange={changeHandler} 
        />
      <label htmlFor="email">E-mail</label>
    </div>

    <div className="input-field">
      <input 
        id="login" 
        name="login"
        type="text"
        maxLength="50"
        autoComplete="off"
        className="field"
        value={form.login}
        onChange={changeHandler} 
        />
      <label htmlFor="login">Login</label>
    </div>
    
    <div className="input-field">
      <input 
        id="password" 
        name="password"
        type="password"
        maxLength="50"
        className="field"
        value={form.password}
        onChange={changeHandler} />
      <label htmlFor="password">Password</label>
    </div>


    <div className="input-field">
      <input 
        id="rpassword" 
        name="rpassword"
        type="password"
        maxLength="50"
        className="field"
        value={form.rpassword}
        onChange={changeHandler} />
      <label htmlFor="rpassword">Repeat password</label>
    </div>


  <button 
    className="btn blue lighten-2" 
    onClick={submitHandler}
    disabled={loading || !form.email || !form.login || !form.password || !form.rpassword }>
    Sign Up!
  </button>

</div>
)}




// COMPONENT for Login Form
function AuthLoginComp() {

  // Init resourses: hooks, forms, handlers. Depends on uri
  const {form, loading, message, request, changeHandler, auth} = useFormHandler({login:'', password: ''});

  // Make request to backend
  const submitHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      message(data.message)
      auth.login(data.token, data.userId)
    } catch (e) {} // errors already processed in useHttp hook
  }

return (
  <div className="input-container">

      <div className="input-field">
        <input 
          id="login" 
          name="login"
          type="text"
          maxLength="50"
          autoComplete="off"
          className="field"
          value={form.login}
          onChange={changeHandler} 
          />
        <label htmlFor="login">Login</label>
      </div>
      
      <div className="input-field">
        <input 
          id="password" 
          name="password"
          type="password"
          maxLength="50"
          className="field" 
          value={form.password}
          onChange={changeHandler} />
        <label htmlFor="password">Password</label>
      </div>

      <button 
        className="btn blue lighten-2" 
        onClick={submitHandler}
        disabled={ loading || !form.login || !form.password } >
        Login!
      </button>

  </div>
  )}

  export {AuthLoginComp, AuthRegisterComp}