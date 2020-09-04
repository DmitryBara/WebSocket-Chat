import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {ChatroomsPage} from './pages/ChatroomsPage'
import {CreateChatPage} from './pages/CreateChatPage'
import {OneChatPage} from './pages/OneChatPage'


export const useRoutes = (isAuthorized) => {
  if (isAuthorized) {
    return (
      <Switch>
        <Route path="/chatrooms" exact>
          <ChatroomsPage />
        </Route>
        <Route path="/create" exact>
          <CreateChatPage />
        </Route>
        <Route path="/chatrooms/:id">
          <OneChatPage />
        </Route>
        <Redirect to="/chatrooms" />
      </Switch>
    )
  } else {
    return (
      <Switch>
        <Route path="/" exact>
          <AuthPage />
        </Route>

        <Redirect to="/" />
      </Switch>
    )
  }
}