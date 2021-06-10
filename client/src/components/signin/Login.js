import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from "../static/images/pet-social-logo.jpg";
import { useMutation } from '@apollo/client'
import { loginQuery } from '../../queries.js'

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Pet Social @ '}
        <Link color="inherit" href="https://orbital.comp.nus.edu.sg/">
          {"Orbital 2021"}
        </Link>
      </Typography>
    );
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(20),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    logo: {
      margin: theme.spacing(2),
      width: '60%',
      border: 0,
      borderRadius: 10,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

const Login = ({ switchToHome, switchToSignup, switchToResetPassword, getCurrentUser }) => {
    const classes = useStyles();

    const [error, setError] = useState(null);
    const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe"));
    const [details, setDetails] = useState({username:"", password:"", remember:false});

    const [ login, loginResult ] = useMutation(loginQuery, {
      onError: (error) => {
        console.log(error.graphQLErrors[0].message)
        setError(error.graphQLErrors[0].message)
      },
    })

    useEffect(() => {
      if ( loginResult.data ) {
        const token = loginResult.data.login.value
        console.log(token)
        setError(null)
        sessionStorage.setItem('user-token', token)
        if (token) {
          getCurrentUser()
          switchToHome()
          if (details.remember) {
            localStorage.setItem("rememberMe", token)
          } else {
            localStorage.clear()
          }
        }
      }
    }, [loginResult.data])

    const handleSubmit = event => {
        event.preventDefault();
        const username = details.username
        const password = details.password
        login({variables: { username, password }});
    }

    const handleChange = (prop) => (event) => {
        setDetails({ ...details, [prop]: event.target.value });
    };

    if (rememberMe) {
      console.log("Remember Me")
      sessionStorage.setItem('user-token', rememberMe)
      getCurrentUser()
      switchToHome();
      setRememberMe(false)
    }

    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <img src={logo} alt="Pet Social" className={classes.logo} />
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                error={["Username cannot be empty", "Username does not exist"].includes(error)}
                helperText={["Username cannot be empty", "Username does not exist"].includes(error) ? error : ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={handleChange('username')}
              />
              <TextField
                error={["Password cannot be empty", "Password is incorrect"].includes(error)}
                helperText={["Password cannot be empty", "Password is incorrect"].includes(error) ? error : ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange('password')}
              />
              <FormControlLabel
                control={<Checkbox value="remember" name="remember" color="primary" />}
                label="Remember me" 
                defaultValue={false}
                onClick={handleChange('remember')}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" onClick={switchToResetPassword} variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" onClick={switchToSignup} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      );
}

export default Login
