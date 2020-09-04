import React from 'react'

// Chat zone which refreshing on event from server
export const СhatArea = ({listMessages, messagesEndRef}) => {

  return (
    
    <div id="chat-zone">

      { listMessages.map( (message) => {

        // Working with datetime
        var dt = message.date
        var s = dt.split('-').join(',').split('T').join(',').split(':').join(',').split('.').join(',').split(',')
        var cur = new Date(s[0], s[1]-1, s[2], s[3], s[4], s[5])
        var off = cur.getTimezoneOffset();
        cur.setMinutes(cur.getMinutes() - off )
        var datetime = cur.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) // it's dont work. set default time as in browser

        return (
          <div key={message._id} style={{marginTop: '1rem'}}>

            <span className="msg-author">
              {message.login}{'\u00A0'}
            </span>

            <span className="msg-date">
              { datetime }
            </span>

            <span className="msg-text flow-text">
              {message.text}
            </span>
          </div>
        )
        
        } ) 
      }

    <div ref={messagesEndRef}></div>
    </div> 
  )
}