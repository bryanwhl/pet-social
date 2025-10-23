// React core
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

// Material-UI theme and styling
import { red } from '@material-ui/core/colors'
import { ThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

// Apollo GraphQL
import { useLazyQuery } from '@apollo/client'
import { currentUserQuery } from './queries.js'

// Internal components
import LoggedOut from './components/signin/LoggedOut.js'
import LoggedIn from './components/pages/LoggedIn.js'

/**
 * Custom Material-UI theme configuration for Pet Social
 * Defines color palette, typography, and global CSS overrides
 */
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
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*': {
          'scrollbar-width': 'thin',
        },
        overflowY: "auto",
        margin: 0,
        padding: 0,
        listStyle: "none",
        height: "100%",
        '*::-webkit-scrollbar': {
          width: '0.4em',
        },
        '*::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#F39991',
          borderRadius: "10px"
        }
      }
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

// Make theme responsive to screen sizes
customTheme = responsiveFontSizes(customTheme)

/**
 * Main App component - handles authentication and routing
 * @param {Object} client - Apollo client instance for GraphQL operations
 */
function App({ client }) {
  // Query to get current authenticated user
  const [getCurrentUser, currentUser] = useLazyQuery(currentUserQuery, {fetchPolicy: 'network-only'})
  
  // Current authenticated user state
  const [user, setUser] = useState(null);

  // Clear session data when page unloads
  window.onunload = function () {
    sessionStorage.clear();
    client.clearStore();
  }

  /**
   * Handles user logout - clears all stored data and redirects to login
   * Note: Logout redirect is handled in LoggedIn component which has Router context
   */
  const logout = () => {
    setUser(null);
    localStorage.clear()
    sessionStorage.clear()
    client.clearStore()
  }
  
  /**
   * Effect to handle user authentication state changes
   * Validates tokens and sets user data or triggers logout on invalid tokens
   */
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
            {(user !== null) ? <LoggedIn setUser={setUser} client={client} user={user} currentUser={currentUser} getCurrentUser={getCurrentUser} logout={logout} /> : <Redirect to="/login" /> }
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
