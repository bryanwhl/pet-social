import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import PostsContainer from '../posts/PostsContainer.js';
import TopBar from '../toolbar/TopBar.js'
import ProfilePage from '../profile/ProfilePage.js'
import Playgroups from '../pages/Playgroups.js'
import Shop from '../pages/Shop.js'
import SettingsPage from '../settings/SettingsPage.js'
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import OtherUsersProfilePage from '../profile/OtherUsersProfilePage.js'


const LoggedIn = ({setUser, client, user, getCurrentUser}) => {

  const history = useHistory();

  const logout = () => {
    setUser(null);
    localStorage.clear()
    sessionStorage.clear()
    client.clearStore()
    //client.resetStore() //This causes cache problems
    //setAppState("Signin") //change route
    history.push("/login");
  }

  return (
    <div>
      <CssBaseline />
      <TopBar logout={logout} user={user} client={client} getCurrentUser={getCurrentUser} />
      <Switch>
        <Route exact path='/profile'>
          {(user !== null) ? <OtherUsersProfilePage setUser={setUser} client={client} user={user} getCurrentUser={getCurrentUser} /> : <Redirect to="/login" /> }
        </Route>
        <Route exact path='/home'>
          {(user !== null) ?<PostsContainer user={user}/> : <Redirect to="/login" /> }
        </Route>
        <Route exact path='/myprofile'>
          {(user !== null) ?<ProfilePage user={user} getCurrentUser={getCurrentUser}/> : <Redirect to="/login" /> }
        </Route>
        <Route exact path='/settings'>
          {(user !== null) ?<SettingsPage user={user} logout={logout}/> : <Redirect to="/login" /> }
        </Route>
        <Route exact path='/playgroups'>
          {(user !== null) ?<Playgroups user={user}/> : <Redirect to="/login" /> }
        </Route>
        <Route exact path='/shop'>
          {(user !== null) ?<Shop /> : <Redirect to="/login" /> }
        </Route>
      </Switch>
    </div>
  )
}

export default LoggedIn
