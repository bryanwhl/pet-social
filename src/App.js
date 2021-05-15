import { useState } from 'react';
import TopBar from './components/TopBar.js'
import Post from './components/Post.js'
import Login from './components/Login.js'
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

  const [username, setUser] = useState(null);
  const [error, setError] = useState(null);

  const login = details => {
    console.log(details);

    if (details.username !== adminUser.username) {
      console.log("Username does not exist")
      setError("Username")
      return;
    } else if (details.password !== adminUser.password) {
      console.log("Password is incorrect")
      setError("Password")
      return;
    }

    console.log("Logged in to admin account");
    setUser("admin");
    setError(null)
  }

  const logout = () => {
    console.log("Logout ", username);
    setUser(null);
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
              <Login login={login} error={error}/>
            </div>
          )}

      </ThemeProvider>
    </div>
  );
}

export default App;
