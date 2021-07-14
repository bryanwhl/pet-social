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
import { withRouter } from 'react-router-dom'

const LoggedIn = ({setUser, client, user, getCurrentUser}) => {

  const [appState, setAppState] = useState("Home");

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
      <TopBar logout={logout} user={user} appState={appState} setAppState={setAppState} client={client} getCurrentUser={getCurrentUser} />
      {appState === "Home" && <PostsContainer user={user}/>}
      {appState === "Profile" && <ProfilePage user={user} getCurrentUser={getCurrentUser}/>}
      {appState === "Settings" && <SettingsPage user={user} logout={logout}/>}
      {appState === "Playgroups" && <Playgroups user={user}/>}
      {appState === "Shop" && <Shop />}
    </div>
  )
}

export default LoggedIn
