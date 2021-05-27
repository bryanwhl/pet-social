import { useState, useEffect } from 'react';
import TopBar from './components/toolbar/TopBar.js'
import Login from './components/signin/Login.js'
import Signup from './components/signin/Signup.js'
import ResetPassword from './components/signin/ResetPassword.js'
import ProfilePage from './components/pages/ProfilePage.js'
import Playgroups from './components/pages/Playgroups.js'
import Shop from './components/pages/Shop.js'
import SettingsPage from './components/settings/SettingsPage.js'
import { red } from '@material-ui/core/colors'
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { Avatar } from '@material-ui/core';
import PostsContainer from './components/posts/PostsContainer.js';
import profilePic from './components/static/images/cute-dog.jpg';
import { useQuery, useMutation } from '@apollo/client'
import { allUsersQuery, addUserQuery, editPasswordQuery } from './queries.js'

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
  // All user data can be centralized here
  const allUsers = useQuery(allUsersQuery)
  const [ createUser ] = useMutation(addUserQuery, {refetchQueries: [{query: allUsersQuery}]})
  const [ editPassword ] = useMutation(editPasswordQuery, {refetchQueries: [{query: allUsersQuery}]})
  
  // const adminUser={
  //   username: "admin",
  //   password: "admin123",
  //   accountType: "Personal",
  //   givenName: "Ad",
  //   familyName: "Min",
  //   displayName: "Ad Min",
  //   nameOrder: false,
  //   avatar: <Avatar src={profilePic} />
  // }


  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [appState, setAppState] = useState("Signin");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);


  useEffect(() => {
    if (allUsers.data) {
      console.log(allUsers.data)
      setUsers(allUsers.data.allUsers)
    }
  }, [allUsers])


  const updateUser = (userToUpdate, updatedUser) => {
    const userIndex = users.indexOf(userToUpdate)
    const updatedUsers = [users.slice(0, userIndex), updatedUser, users.slice(userIndex + 1)]
    setUsers(updatedUsers)
    setUser(updatedUser)
  }

  const displayName = (user) => {
    console.log("Display name: ", user)
    return user.otherSettings.familyNameFirst ? (user.name.familyName + " " + user.name.givenName)
      : (user.name.givenName + " " + user.name.familyName)
  }

  // Might be better to query server for user
  const login = details => {
    console.log(users)
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
        console.log(users[i])
        setError(null)
        switchToHome();
        return
      }
    }

      console.log("Username does not exist")
      setError("Username")
  }

  const logout = () => {
    console.log("Logout ", user.username);
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
    } else if (details.email === "") {
      setError("Email empty")
      return;
    } else if (!details.email.includes('@') || !details.email.includes('.')) {
      setError("Email")
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

    createUser({ variables: { username: details.username, password: details.password, email: details.email, accountType: details.accountType, givenName: details.givenName, familyName: details.familyName } })
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
        const updatedUser = {
          ...users[i],
          password: details.password
        }
        console.log(users[i].id, details.password)
        editPassword( { variables: { id: users[i].id, password: details.password } })
        //const updatedUsers = [users.slice(0, i), updatedUser, users.slice(i + 1)]
        //setUsers(updatedUsers)
        setResetSuccess(true)
        setError(null)
        console.log("Password reset successfully")
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
              <TopBar logout={logout} user={user} appState={appState} setAppState={setAppState} displayName={displayName} />
              {appState === "Home" && <PostsContainer user={user} displayName={displayName}/>}
              {appState === "Profile" && <ProfilePage user={user} displayName={displayName} />}
              {appState === "Settings" && <SettingsPage user={user} deleteAccount={deleteAccount} updateUser={updateUser} displayName={displayName}/>}
              {appState === "Playgroups" && <Playgroups />}
              {appState === "Shop" && <Shop />}
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
