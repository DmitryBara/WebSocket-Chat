import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/LoaderComp'


export const ChatroomsPage = () => {


  const {token} = useContext(AuthContext)
  const {request, loading} = useHttp()
  const [chatrooms, setChatrooms] = useState(null)


  const getChatrooms = useCallback(async () => {
    try {
      const fetched = await request (
        `/api/chat/chatrooms`,
        'GET',
        null,
        {Authorization: `Bearer ${token}`}
      )
      setChatrooms(fetched.reverse()) 
    } catch (e) {}
  }, [token, request])

  useEffect(() => {
    getChatrooms()
  }, [])

    // If still loading data from backend
    if (loading) {
      return <Loader />
    }


  return (
    <div>
      <h1 className="blue-text">All Chatrooms</h1>
      <div className="collection">
        { !loading && chatrooms && chatrooms.map( (chat, index) => {
          if (!chat.private) {
            const url = "/chatrooms/" + chat._id
            return (
              <a href={url} key={index} className="collection-item" id="chat-public">
                { chat.chatname } (online: {chat.onlineUsers.length})</a>
            ) } else {
            return (
              <a href="#" key={index} className="collection-item" id="chat-private">{ chat.chatname } (private)</a>
            )
            }
        } ) }
      </div>
    </div>
  )
}