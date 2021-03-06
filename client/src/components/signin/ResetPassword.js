import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from "../static/images/pet-social-logo.jpg";
import { useMutation } from '@apollo/client'
import { resetPasswordQuery } from '../../queries.js'

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

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(17),
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

const ResetPassword = ({ switchToSignin }) => {
    const classes = useStyles();

    const [openSnackbar, setOpenSnackbar] = useState(null)
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [details, setDetails] = useState({email:"", password:"", confirmPassword:""});
    const buttonText = (success) ? "Back to Sign In" : "Reset Password"

    const [ resetPassword, resetPasswordResponse ] = useMutation(resetPasswordQuery, {
      onError: (error) => {
        console.log(error)
        console.log(error.graphQLErrors[0].message)
        setError(error.graphQLErrors[0].message)
      }})

    useEffect(() => {
      if ( resetPasswordResponse.data ) {
          if (!error) {
              setSuccess(true)
              handleOpenSnackbar("Password Reset")
          }
      }
    }, [resetPasswordResponse.data])

    const handleCloseSnackbar = () => {
      setOpenSnackbar(null)
    }

    const handleOpenSnackbar = (input) => {
      setOpenSnackbar(input)
    }

    const handleSubmit = event => {
        event.preventDefault();
        resetPassword({variables: {email: details.email, password: details.password, confirmPassword: details.confirmPassword}})
        setError(null)
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
                error={["Invalid Email", "Email does not exist"].includes(error)}
                helperText={["Invalid Email", "Email does not exist"].includes(error) ? error : ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange('email')}
                disabled={success}
              />
              <TextField
                error={["Passwords do not match", "Password same"].includes(error)}
                helperText={(error === "Passwords do not match") ? error
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
                error={["Passwords do not match", "Password same"].includes(error)}
                helperText={(error === "Passwords do not match") ? error
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
              <Typography variant="body2">
                * Required
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={[details.email, details.password, details.confirmPassword].includes("")}
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
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success">
              {openSnackbar}
          </Alert>
        </Snackbar>
        </Container>
      );
}

export default ResetPassword
