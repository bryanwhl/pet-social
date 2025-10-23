/**
 * LoggedIn component - Main authenticated user interface
 * Renders the application shell with navigation and protected routes
 * Handles logout functionality and route protection
 */

import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import { useHistory } from "react-router-dom";
import { Switch, Route, Redirect } from 'react-router-dom';

// Internal components
import PostsContainer from '../posts/PostsContainer.js';
import TopBar from '../toolbar/TopBar.js'
import ProfilePage from '../profile/ProfilePage.js'
import Playgroups from '../pages/Playgroups.js'
import Shop from '../pages/Shop.js'
import SettingsPage from '../settings/SettingsPage.js'
import OtherUsersProfilePage from '../profile/OtherUsersProfilePage.js'

/**
 * LoggedIn - Main container for authenticated user interface
 * @param {Function} setUser - Function to update user state
 * @param {Object} client - Apollo GraphQL client instance
 * @param {Object} user - Current authenticated user object
 * @param {Object} currentUser - Current user query result
 * @param {Function} getCurrentUser - Function to fetch current user data
 * @param {Function} logout - Function to handle logout from parent App component
 */
const LoggedIn = ({setUser, client, user, currentUser, getCurrentUser, logout}) => {

  const history = useHistory();

  /**
   * Handles user logout with navigation - calls parent logout and redirects
   */
  const handleLogout = () => {
    logout(); // Call parent logout function
    history.push("/login"); // Navigate to login page
  }

  return (
    <div>
      <CssBaseline />
      <TopBar logout={handleLogout} user={user} client={client} getCurrentUser={getCurrentUser} />
      <Switch>
        <Route exact path='/'>
          <Redirect to="/home" />
        </Route>
        <Route exact path='/profile'>
          {(user !== null || currentUser.data !== undefined) ? <OtherUsersProfilePage setUser={setUser} client={client} user={user} getCurrentUser={getCurrentUser} /> : <Redirect to="/login" /> }
        </Route>
        <Route exact path='/home'>
          {(user !== null) ?<PostsContainer user={user}/> : <Redirect to="/login" /> }
        </Route>
        <Route exact path='/myprofile'>
          {(user !== null) ?<ProfilePage user={user} getCurrentUser={getCurrentUser}/> : <Redirect to="/login" /> }
        </Route>
        <Route exact path='/settings'>
          {(user !== null) ?<SettingsPage user={user} logout={handleLogout}/> : <Redirect to="/login" /> }
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
