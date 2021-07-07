import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from "../static/images/pet-social-logo.jpg";
import { useMutation } from '@apollo/client'
import { addUserQuery } from '../../queries.js'

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
      marginTop: theme.spacing(10),
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

const Signup = ({ switchToSignin }) => {
    const classes = useStyles();

    const [openSnackbar, setOpenSnackbar] = useState(null)
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [details, setDetails] = useState({givenName:"", familyName:"", username:"", password:"", confirmPassword:"", accountType:"", email:""});
    const buttonText = (success) ? "Back to Sign In" : "Sign up"

    const [ createUser, createUserResponse ] = useMutation(addUserQuery, {
      onError: (error) => {
        setError(error.graphQLErrors[0].message)
      }})

    useEffect(() => {
      if ( createUserResponse.data ) {
          if (!error) {
              setSuccess(true)
              handleOpenSnackbar("Account Created")
          }
      }
    }, [createUserResponse.data])

    const handleCloseSnackbar = () => {
      setOpenSnackbar(null)
    }

    const handleOpenSnackbar = (input) => {
      setOpenSnackbar(input)
    }

    const handleSubmit = event => {
        event.preventDefault();
        createUser({ variables: { username: details.username, password: details.password, confirmPassword: details.confirmPassword, email: details.email, accountType: details.accountType, givenName: details.givenName, familyName: details.familyName } })
        setError(null)
    }

    const handleChange = (prop) => (event) => {
        setDetails({ ...details, [prop]: event.target.value });
    };

    const accountTypes = ["Personal", "Business"]

    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <img src={logo} alt="Pet Social" className={classes.logo} />
            <form className={classes.form} noValidate onSubmit={success ? switchToSignin : handleSubmit}>
              <TextField
                error={["Given name empty"].includes(error)}
                helperText={(error === "Given name empty") ? "Given name cannot be empty" : ""}
                variant="outlined"
                margin="normal"
                required
                id="givenName"
                label="Given Name"
                name="givenName"
                autoFocus
                style={{width:'50%'}}
                onChange={handleChange('givenName')}
                disabled={success}
              />
              <TextField
                error={["Family name empty"].includes(error)}
                helperText={(error === "Family name empty") ? "Family name cannot be empty" : ""}
                variant="outlined"
                margin="normal"
                required
                id="familyName"
                label="Family Name"
                name="familyName"
                autoFocus
                style={{width:'50%'}}
                align='right'
                onChange={handleChange('familyName')}
                disabled={success}
              />
              <TextField
                error={["Invalid Email", "Email already exists"].includes(error)}
                helperText={["Invalid Email", "Email already exists"].includes(error) ? error : ""}
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
                error={["Username already exists"].includes(error)}
                helperText={(error === "Username already exists") ? error : ""}
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
                error={error==="Passwords do not match"}
                helperText={(error === "Passwords do not match") ? error : ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleChange('password')}
                disabled={success}
              />
              <TextField
                error={["Passwords do not match", "Confirm Password empty"].includes(error)}
                helperText={(error === "Passwords do not match") ? error : ""}
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
              <TextField
                error={["Account Type empty"].includes(error)}
                helperText={(error === "Account Type empty") ? "Account type cannot be empty" : ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="accountType"
                label="Account Type"
                select
                value={details.accountType}
                id="accountType"
                onChange={handleChange('accountType')}
                disabled={success}
              >
                {accountTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="body2">
                * Required Field
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={[details.familyName, details.givenName, details.email, details.username, details.password, details.confirmPassword, details.accountType].includes("")}
              >
                {buttonText}
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="#" onClick={switchToSignin} variant="body2">
                    {"Already have an account? Sign In"}
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

export default Signup
