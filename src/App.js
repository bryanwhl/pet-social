import { useState } from 'react';
import TopBar from './components/TopBar.js'
import Login from './components/Login.js'
import Signup from './components/Signup.js'
import ResetPassword from './components/ResetPassword.js'
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
    password: "admin123"
  }

  const [users, setUsers] = useState([adminUser,]);
  const [username, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [signedOutState, setSignedOutState] = useState("Signin");
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
        setUser("admin");
        setError(null)
      }
    }

      console.log("Username does not exist")
      setError("Username")
  }

  const logout = () => {
    console.log("Logout ", username);
    setUser(null);
    setError(null)
  }

  const signup = details => {
    console.log("Signup ", details)
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
      username: details.username,
      password: details.password
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

  const switchToSignup = () => {
    setSignedOutState("Signup")
    setError(null)
  }
  const switchToSignin = () => {
    setSignedOutState("Signin")
    setError(null)
    setSignupSuccess(false)
    setResetSuccess(false)
  }
  const switchToResetPassword = () => {
    setSignedOutState("Reset")
    setError(null)
    setResetSuccess(false)
  }

  return (
    <div className="App">
      <ThemeProvider theme = {customTheme}>
          {(username !== null) ? (
            <div className="loggedIn">
              <CssBaseline />
              <TopBar logout={logout} />
              <PostsContainer />
            </div>
          ) : (
            <div className="loggedOut">
              {signedOutState === "Signin"
                && <Login login={login} switchToSignup={switchToSignup} switchToResetPassword={switchToResetPassword} error={error}/>}
              {signedOutState === "Signup"
                && <Signup signup={signup} switchToSignin={switchToSignin} success={signupSuccess} error={error}/>}
              {signedOutState === "Reset"
                && <ResetPassword resetPassword={resetPassword} switchToSignin={switchToSignin} success={resetSuccess} error={error}/>}
            </div>
          )}

      </ThemeProvider>
    </div>
  );
}

export default App;
