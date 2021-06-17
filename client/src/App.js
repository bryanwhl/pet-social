import { useState, useEffect } from 'react';
import TopBar from './components/toolbar/TopBar.js'
import Login from './components/signin/Login.js'
import Signup from './components/signin/Signup.js'
import ResetPassword from './components/signin/ResetPassword.js'
import ProfilePage from './components/profile/ProfilePage.js'
import Playgroups from './components/pages/Playgroups.js'
import Shop from './components/pages/Shop.js'
import SettingsPage from './components/settings/SettingsPage.js'
import { red } from '@material-ui/core/colors'
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import PostsContainer from './components/posts/PostsContainer.js';
import { useLazyQuery } from '@apollo/client'
import { currentUserQuery } from './queries.js'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const customTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#F39991",
    },
    secondary: {
      main: red[400],
    },
    info: {
      light: "#64b5f6",
      main: "#2196f3",
      dark: "#1976d2"
    },
    success: {
      main: "#4caf50",
    },
    warning: {
      main: "#ff9800",
    }
  },
  typography: {
    fontSize: 16,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
})

function App({ client }) {
  // All user data can be centralized here
  const [getCurrentUser, currentUser] = useLazyQuery(currentUserQuery)

  const [user, setUser] = useState(null);
  const [appState, setAppState] = useState("Signin");

  window.onunload = function () {
    sessionStorage.clear();
    client.clearStore();
  }
  
  useEffect(() => {
    if (currentUser.data) {
      console.log("Current User: ", currentUser.data)
      if (currentUser.data.me !== null) {
        console.log("Valid token")
        setUser(currentUser.data.me)
        console.log(user)
      } else {
        console.log("Invalid token")
        logout()
        alert("Token is invalid. It may have expired or user was deleted.")
      }
    }
  }, [currentUser.data])

  const logout = () => {
    setUser(null);
    localStorage.clear()
    sessionStorage.clear()
    client.clearStore()
    //client.resetStore() //This causes cache problems
    setAppState("Signin")
  }

  const switchToSignup = () => {
    setAppState("Signup")
  }
  const switchToSignin = () => {
    setAppState("Signin")
  }
  const switchToResetPassword = () => {
    setAppState("Reset Password")
  }

  const switchToHome = () => {
    setAppState("Home")
  }

  return (
    <Router>
      <div className="App">
        <ThemeProvider theme = {customTheme}>
            {(user !== null) ? (
              <div className="loggedIn">
                <CssBaseline />
                <TopBar logout={logout} user={user} appState={appState} setAppState={setAppState} />
                {appState === "Home" && <PostsContainer user={user}/>}
                {appState === "Profile" && <ProfilePage user={user}/>}
                {appState === "Settings" && <SettingsPage user={user} logout={logout}/>}
                {appState === "Playgroups" && <Playgroups user={user}/>}
                {appState === "Shop" && <Shop />}
              </div>
            ) : (
              <div className="loggedOut">
                {appState === "Signin"
                  && <Login switchToHome={switchToHome} switchToSignup={switchToSignup} switchToResetPassword={switchToResetPassword} getCurrentUser={getCurrentUser}/>}
                {appState === "Signup"
                  && <Signup switchToSignin={switchToSignin}/>}
                {appState === "Reset Password"
                  && <ResetPassword switchToSignin={switchToSignin}/>}
              </div>
            )}
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
