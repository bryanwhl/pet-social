import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from "./static/images/pet-social-logo.jpg";

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

const ResetPassword = ({ resetPassword, switchToSignin, success, error }) => {
    const classes = useStyles();

    const [details, setDetails] = useState({username:"", password:"", confirmPassword:""});
    const buttonText = (success) ? "Password reset | Back to Sign In" : "Reset Password"

    const handleSubmit = event => {
        event.preventDefault();
        resetPassword(details);
    }

    const handleChange = (prop) => (event) => {
        setDetails({ ...details, [prop]: event.target.value });
    };

    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <img src={logo} alt="Pet Social" className={classes.logo} />
            <form className={classes.form} noValidate onSubmit={success ? switchToSignin : handleSubmit}>
              <TextField
                error={["Username", "Username empty"].includes(error)}
                helperText={(error === "Username") ? "Username does not exist"
                  : (error === "Username empty") ? "Username cannot be empty" : ""}
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
                disabled={success}
              />
              <TextField
                error={["Password", "Password empty", "Password same"].includes(error)}
                helperText={(error === "Password") ? "Passwords do not match"
                  : (error === "Password empty") ? "Password cannot be empty"
                  : (error === "Password same") ? "New password cannot be the same as previous" : ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                onChange={handleChange('password')}
                disabled={success}
              />
              <TextField
                error={["Password", "Confirm Password empty", "Password same"].includes(error)}
                helperText={(error === "Password") ? "Passwords do not match"
                  : (error === "Confirm Password empty") ? "Password cannot be empty"
                  : (error === "Password same") ? "New password cannot be the same as previous" : ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Re-enter Password"
                type="password"
                id="confirmPassword"
                onChange={handleChange('confirmPassword')}
                disabled={success}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {buttonText}
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="#" onClick={switchToSignin} variant="body2">
                    {"Back to sign in page"}
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

export default ResetPassword
