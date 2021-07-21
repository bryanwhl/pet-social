import { useState, useEffect } from 'react';
import LoggedOut from './components/signin/LoggedOut.js'
import LoggedIn from './components/pages/LoggedIn.js'
import { red } from '@material-ui/core/colors'
import { ThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { useLazyQuery } from '@apollo/client'
import { currentUserQuery } from './queries.js'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { useHistory } from "react-router-dom";

let customTheme = createMuiTheme({
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

customTheme = responsiveFontSizes(customTheme)

function App({ client }) {

  // All user data can be centralized here

  const [getCurrentUser, currentUser] = useLazyQuery(currentUserQuery, {fetchPolicy: 'network-only'})

  let history = useHistory();

  const [user, setUser] = useState(null);

  window.onunload = function () {
    sessionStorage.clear();
    client.clearStore();
  }

  const logout = () => {
    setUser(null);
    localStorage.clear()
    sessionStorage.clear()
    client.clearStore()
    //client.resetStore() //This causes cache problems
    history.push("/login");
  }
  
  useEffect(() => {
    console.log(currentUser)
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

  return (
    <Router>
      <div className="App">
        <ThemeProvider theme = {customTheme}>
          <Route path='/'>
            {(user !== null) ? <LoggedIn setUser={setUser} client={client} user={user} getCurrentUser={getCurrentUser} /> : <Redirect to="/login" /> }
          </Route>
          <Route exact path='/login'>
            {(user === null) ? <LoggedOut getCurrentUser={getCurrentUser}/> : <Redirect to="/" /> }
          </Route>
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
