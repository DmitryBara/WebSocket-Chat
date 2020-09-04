import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/LoaderComp'
import {ChatWorker} from '../components/ChatWorkerComp'

// Initialize new socket when connect to new chatroom
import openSocket from 'socket.io-client'
const socket = openSocket()


// Logic block without component
export const OneChatPage = () => {

  const {token} = useContext(AuthContext)
  const {request, loading} = useHttp()
  const [chat, setChat] = useState(null)
  const chatId = useParams().id // catch param from route


  // Take response with chat data from backend
  // Put in {chat}
  const getChat = useCallback(async () => {
    try {
      const fetched = await request (
        `/api/chat/chatrooms/${chatId}`,
        'GET',
        null,
        {Authorization: `Bearer ${token}`}
      )
    setChat(fetched) 
    } catch (e) {}
  }, [token, chatId, request])

  // call getChat() when component is ready
  useEffect(() => {
    getChat()
  }, [getChat])

  // Save buffer for all messages from chat
  var allMsgs = []
  const allMessages = (newMessage = null, oldMessages = null) => {

    if ( !newMessage && !oldMessages.length ) {
        // pass
    } else if (oldMessages && oldMessages.length > 0) {
      allMsgs.push(...oldMessages)
    } else if (newMessage) {
      allMsgs.push(newMessage)
    } 
    return allMsgs
  }

  // If still loading data from backend
  if (loading) {
    return <Loader />
  }

  return (
    <>  
      { !loading && chat && <ChatWorker allMessages={allMessages} 
        chat={chat} socket={socket} token={token} chatId={chatId}/> }
    </>
  )
}