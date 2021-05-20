import { useState } from 'react';
import TopBar from './components/TopBar.js'
import Login from './components/Login.js'
import Signup from './components/Signup.js'
import ResetPassword from './components/ResetPassword.js'
import ProfilePage from './components/ProfilePage.js'
import SettingsPage from './components/Settings/SettingsPage.js'
import { red } from '@material-ui/core/colors'
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import PostsContainer from './components/PostsContainer.js';

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

function App() {
  const adminUser={
    username: "admin",
    password: "admin123",
    accountType: "Personal",
    givenName: "Ad",
    familyName: "Min",
    displayName: "Ad Min",
    nameOrder: false
  }

  const [users, setUsers] = useState([adminUser,]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [appState, setAppState] = useState("Signin");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const login = details => {
    console.log("Login ", details);
    if (details.username === "") {
      setError("Username empty")
      return;
    } else if (details.password === "") {
      setError("Password empty")
      return;
    }
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === details.username){
        if (users[i].password !== details.password) {
          setError("Password")
          return
        }
        console.log("Logged in to account");
        setUser(users[i]);
        setError(null)
        switchToHome();
      }
    }

      console.log("Username does not exist")
      setError("Username")
  }

  const logout = () => {
    console.log("Logout " + user.username);
    setUser(null);
    setError(null)
    setAppState("Signin")
  }

  const signup = details => {
    console.log("Signup ", details)
    if (details.givenName === "") {
      setError("Given name empty")
      return;
    } else if (details.familyName === "") {
      setError("Family name empty")
      return;
    } else if (details.username === "") {
      setError("Username empty")
      return;
    } else if (details.password === "") {
      setError("Password empty")
      return;
    } else if (details.confirmPassword === "") {
      setError("Confirm Password empty")
      return;
    } else if (details.accountType === "") {
      setError("Account Type empty")
      return;
    }
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === details.username){
        setError("Username")
        return;
      }
    }
    if (details.password !== details.confirmPassword) {
      setError("Password")
      return;
    } 

    setUsers( [...users, {
      givenName: details.givenName,
      familyName: details.familyName,
      username: details.username,
      password: details.password,
      accountType: details.accountType,
      displayName: details.givenName + " " + details.familyName,
      nameOrder: false
    }])
    setSignupSuccess(true)
    setError(null)
  }

  const resetPassword = details => {
    console.log("Reset ", details);
    if (details.username === "") {
      setError("Username empty")
      return;
    } else if (details.password === "") {
      setError("Password empty")
      return;
    } else if (details.confirmPassword === "") {
      setError("Confirm Password empty")
      return;
    }
    if (details.password !== details.confirmPassword) {
      setError("Password")
      return;
    } 
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === details.username){
        if (users[i].password === details.password) {
          setError("Password same")
          return;
        }
        console.log("Password reset successfully")
        users[i].password = details.password
        setResetSuccess(true)
        return;
      }
    }
    setError("Username")
  }

  const deleteAccount = username => {
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username){
        logout()
        users.splice(i, 1)
        console.log(user, " removed")
      }
    }
  }

  const switchToSignup = () => {
    setAppState("Signup")
    setError(null)
  }
  const switchToSignin = () => {
    setAppState("Signin")
    setError(null)
    setSignupSuccess(false)
    setResetSuccess(false)
  }
  const switchToResetPassword = () => {
    setAppState("Reset Password")
    setError(null)
    setResetSuccess(false)
  }

  const switchToHome = () => {
    setAppState("Home")
  }

  return (
    <div className="App">
      <ThemeProvider theme = {customTheme}>
          {(user !== null) ? (
            <div className="loggedIn">
              <CssBaseline />
              <TopBar logout={logout} user={user} appState={appState} setAppState={setAppState} />
              {appState === "Home" && <PostsContainer />}
              {appState === "Profile" && <ProfilePage user={user} />}
              {appState === "Settings" && <SettingsPage user={user} deleteAccount={deleteAccount}/>}
            </div>
          ) : (
            <div className="loggedOut">
              {appState === "Signin"
                && <Login login={login} switchToSignup={switchToSignup} switchToResetPassword={switchToResetPassword} error={error}/>}
              {appState === "Signup"
                && <Signup signup={signup} switchToSignin={switchToSignin} success={signupSuccess} error={error}/>}
              {appState === "Reset Password"
                && <ResetPassword resetPassword={resetPassword} switchToSignin={switchToSignin} success={resetSuccess} error={error}/>}
            </div>
          )}

      </ThemeProvider>
    </div>
  );
}

export default App;
