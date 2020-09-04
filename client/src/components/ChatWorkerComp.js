import React, {useContext} from 'react'
import {useState, useEffect, useCallback, useRef} from 'react'
import {AuthContext} from '../context/AuthContext'
import {СhatArea} from './ChatAreaComp'



export const ChatWorker =({ chat, token, chatId, socket, allMessages}) => {

  const auth = useContext(AuthContext)
  const userId = auth.userId
  
  // Indicator for updating component
  // By default instance of listMessages is the same
  // On every iteration, useState don't see changes
  /* eslint-disable-next-line */
  const [news, setNews] = useState(null)

  const [onlineUsers, setOnlineUsers] = useState([])
  const [listMessages, setListMessages] = useState([])


  var sendHandler = (event) => {
    event.preventDefault()
    const newMessageFromClient = event.target.elements.newMessageInput.value
    event.target.elements.newMessageInput.value = null
    socket.emit('New message from client', newMessageFromClient, chatId, userId)
  }

  
  // Initialize socket listeners and emit when user connected
  const createSocket = useCallback( () => {

    socket.on('New user message from server', (newMessage) => {
      setListMessages( allMessages(newMessage, null) )
      setNews(newMessage)
      scrollToBottom()
    })

    socket.on('Refresh online users', (onUsers) => {
      var logins = onUsers.map( i => i.login )
      setOnlineUsers(logins)      
    })

    socket.on('Old messages', (oldMessages) => {
      setListMessages( allMessages(null, oldMessages) )
      scrollToBottom()
    })

    // Make emit to server
    socket.emit('Client just enter', chatId, userId)
    
    
  /* eslint-disable-next-line */
  }, [chatId, userId] )


  // Run when page will loading
  useEffect(() => {
    createSocket()
  }, [createSocket])


  // AutoScroll down
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Base component with empty chat    
  return (
  <div style={{marginTop: '2rem', width: '100%'}} >

    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
    {/* eslint-disable-next-line */}
    <a hreaf="/" className="waves-effect waves-light btn"><i className="material-icons right"> near_me </i> Chat </a>
    {/* eslint-disable-next-line */}
    <a href="#" className="waves-effect waves-light btn"><i className="material-icons right">live_tv</i> *Video Call* </a>

    <div className="row">
      <div className="col" style={{marginLeft: '-0.75rem', width:'100%'}}>
        <div className="card blue lighten-5">


        <div className="card-content black-text" >
          <span className="card-title pink-text"> {chat.chatname} </span>
          

          <div id="online-users">
            <span className="card-title pink-text" id="online-word"> Online: {'\u00A0'} </span>
            { onlineUsers.map( (login, index) => {
                return (
                    <span key={index} id="one-online"> {login} {'\u00A0'} </span>
                )
              })
            }
          </div>
          
          {/* Chat content component */}
          { listMessages.length && <СhatArea listMessages={listMessages} messagesEndRef={messagesEndRef}></СhatArea> }

        </div>

        {/* Input Area */}
        <div className="card-action">

          <form id="chat-form" onSubmit={ sendHandler }>

            <div className="input-field col s12">
              <input 
                id="newMessageInput"
                type="text"
                maxLength="50"
                name="newMessageInput"
                className="materialize-textarea"
                placeholder="Your message"
                autoComplete="off"
                />
            </div>

            <button 
              className="btn pink lighten-3" 
              style={{ marginLeft: '0.75rem'}}>
              Send
            </button>

          </form>
        </div>

        </div>
      </div>
    </div>
  </div>
  )
}

