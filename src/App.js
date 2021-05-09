import TopBar from './components/TopBar.js'
import { red } from '@material-ui/core/colors'
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
    fontSize: 20,
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
  return (
    <div className="App">
      <ThemeProvider theme = {customTheme}>
        <TopBar />
      </ThemeProvider>
    </div>
  );
}

export default App;
