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
import PostsContainer from './components/posts/PostsContainer.js';
import { useQuery, useMutation } from '@apollo/client'
import { allUsersQuery, addUserQuery, editPasswordQuery, editFamilyNameFirstQuery, editLikeNotificationQuery,
  editCommentNotificationQuery, editShareNotificationQuery, deleteUserQuery } from './queries.js'
import { useApolloClient } from '@apollo/client';

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
  const [ editFamilyNameFirst ] = useMutation(editFamilyNameFirstQuery, {refetchQueries: [{query: allUsersQuery}]})
  const [ editLikeNotification ] = useMutation(editLikeNotificationQuery, {refetchQueries: [{query: allUsersQuery}]})
  const [ editCommentNotification ] = useMutation(editCommentNotificationQuery, {refetchQueries: [{query: allUsersQuery}]})
  const [ editShareNotification ] = useMutation(editShareNotificationQuery, {refetchQueries: [{query: allUsersQuery}]})
  const [ deleteUser ] = useMutation(deleteUserQuery, {refetchQueries: [{query: allUsersQuery}]})

  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [appState, setAppState] = useState("Signin");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe"));
  const [rememberMeQueryCount, setRememberMeQueryCount] = useState(0);

  const client = useApolloClient()

  useEffect(() => {
    if (allUsers.data) {
      console.log(allUsers.data)
      setUsers(allUsers.data.allUsers)
    }
  }, [allUsers])

  useEffect(() => {
    if (user) {
      const updatedUser = users.find(u => u.id === user.id)
      if (updatedUser) {
        setUser(updatedUser)
      } else {
        setUser(null)
      }
    }
  }, [users])

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
        if (details.remember) {
          localStorage.setItem("rememberMe", users[i].id)
        } else {
          localStorage.clear()
        }
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
    localStorage.clear()
    client.resetStore()
    setRememberMeQueryCount(0)
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
        console.log(users[i].id, details.password)
        editPassword( { variables: { id: users[i].id, password: details.password } } )
        setResetSuccess(true)
        setError(null)
        console.log("Password reset successfully")
        return;
      }
    }
    setError("Username")
  }

  const deleteAccount = id => {
    deleteUser( { variables: { id: id } } )
    console.log(id, " removed")
    logout()
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

  console.log("Remember Me ", rememberMe)


  if (rememberMe) {
    if (users !== null){
      setUser(users.find(u => u.id === rememberMe));
      while (!user) { //When user is deleted from server
        if (rememberMeQueryCount === 2) {
          setRememberMe(false)
          localStorage.clear()
          client.resetStore()
          setUser(null)
          return
        }
        setRememberMeQueryCount(rememberMeQueryCount + 1)
        return
      }
      switchToHome();
      setRememberMe(false)
    }
  }

  return (
    <div className="App">
      <ThemeProvider theme = {customTheme}>
          {(user !== null) ? (
            <div className="loggedIn">
              <CssBaseline />
              <TopBar logout={logout} user={user} appState={appState} setAppState={setAppState} />
              {appState === "Home" && <PostsContainer user={user}/>}
              {appState === "Profile" && <ProfilePage user={user}/>}
              {appState === "Settings" && <SettingsPage user={user} deleteAccount={deleteAccount} editFamilyNameFirst={editFamilyNameFirst}
              editLikeNotification={editLikeNotification} editCommentNotification={editCommentNotification} editShareNotification={editShareNotification}/>}
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
