import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {useMessage} from '../hooks/message.hook'


export const CreateChatPage = () => {

  // Import myself created hooks and other hooks
  const auth = useContext(AuthContext)
  const history = useHistory()
  const [chatname, setChatname] = useState('')
  const [isChatPrivate, setIsChatPrivate] = useState(false)

  // Show error message in case of backend errors
  const {loading, error, request, clearError} = useHttp()
  const message = useMessage()
  
  useEffect( () => {
    message(error)
    clearError()
  }, [error, message, clearError])


  const submitHandler = async () => {
    try {
      // Should make request (from useHttp hook) with Headers['Authorization']=token
      // Headers let backend know who make request (after auth.middleware parse token)
      const data = await request(
        '/api/chat/create', 
        'POST', 
        {chatname, private: isChatPrivate},
        {Authorization: `Bearer ${auth.token}`}
      )

      if (data.message === "Chat has been created") {
        history.push(`/chatrooms/${data.chatId}`)
      } else {
        message(data.message)
      }

    } catch (e) {}
  }
  

  const pressHandler = (event) => {
    if (event.key === 'Enter' && !!chatname) { submitHandler() }
  }


  return (
    <div className="row blue lighten-3" id="cont-create">
      <div className="col s8 offset-s2">
        <h4 className="white-text" style={{ marginBottom: '2rem'}}>New Chat</h4>
        <div className="input-field">
          
          <input 
            id="chatname" 
            name="chatname"
            type="text"
            autoComplete="off"
            value={chatname}
            onChange={ e => setChatname(e.target.value) }
            onKeyPress = {pressHandler}
            maxLength="50"
            className="field" 
            />
          <label htmlFor="chatname">Chat Name</label>
          
          <p>
            <label htmlFor="password">
              <input 
                id="password" 
                className="white white-text" 
                type="checkbox"
                value={isChatPrivate}
                onChange={ () => setIsChatPrivate(!isChatPrivate) }
                />
              <span className="white-text">Make this chat private (acces by link)</span>
            </label>
          </p>

          <button 
            className="btn yellow green-text" 
            onClick={submitHandler} 
            disabled={loading || !chatname}>
            Create!
          </button>

        </div>
      </div>
    </div>
  )
}