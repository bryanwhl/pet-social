import { useState } from 'react';
import TopBar from './components/TopBar.js'
import Post from './components/Post.js'
import Login from './components/Login.js'
import Signup from './components/Signup.js'
import { red } from '@material-ui/core/colors'
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

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

  const login = details => {
    console.log(details);
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
    console.log(details)
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

  const switchToSignup = () => {
    setSignedOutState("Signup")
    setError(null)
  }
  const switchToSignin = () => {
    setSignedOutState("Signin")
    setError(null)
    setSignupSuccess(false)
  }

  return (
    <div className="App">
      <ThemeProvider theme = {customTheme}>
          {(username !== null) ? (
            <div className="loggedIn">
              <CssBaseline />
              <TopBar logout={logout} />
              <Post />
            </div>
          ) : (
            <div className="loggedOut">
              {signedOutState === "Signin" && <Login login={login} switchToSignup={switchToSignup} error={error}/>}
              {signedOutState === "Signup"
                && <Signup signup={signup} switchToSignin={switchToSignin} success={signupSuccess} error={error}/>}
            </div>
          )}

      </ThemeProvider>
    </div>
  );
}

export default App;
