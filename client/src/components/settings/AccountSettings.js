import React, { useState, useEffect } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Switch from '@material-ui/core/Switch';
import { displayName, convertDate } from '../../utility.js'
import { useMutation } from '@apollo/client'
import { editEmailQuery, editPasswordQuery, currentUserQuery, editFamilyNameFirstQuery, deleteUserQuery, allUsersQuery } from '../../queries.js'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AccountSettings = ({ user, logout }) => {

    // Account Settings State Variables
    const [openSnackbar, setOpenSnackbar] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState(user.email)
    const [edittedEmail, setEdittedEmail] = useState("");
    const [openEmail, setOpenEmail] = useState(false);
    const [error, setError] = useState(null);
    const [nameOrderState, setNameOrderState] = useState(user.settings.familyNameFirst);
    const [openDelete, setOpenDelete] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const [passwordDetails, setPasswordDetails] = useState({oldPassword: "", newPassword: "", confirmPassword: ""})

    // Queries for Account Settings
    const [ editFamilyNameFirst, editFamilyNameFirstResponse ] = useMutation(editFamilyNameFirstQuery, {
        onError: (error) => {
            console.log(error.graphQLErrors[0])
          setError(error.graphQLErrors[0].message)
         }, refetchQueries: [{query: currentUserQuery}]
    })
    const [ editEmail, editEmailResponse ] = useMutation(editEmailQuery, {
        onError: (error) => {
          setError(error.graphQLErrors[0].message)
         }, refetchQueries: [{query: currentUserQuery}]
    })
    const [ editPassword, editPasswordResponse ] = useMutation(editPasswordQuery, {
        onError: (error) => {
          setError(error.graphQLErrors[0].message)
         }, refetchQueries: [{query: currentUserQuery}]
    })
    const [ deleteUser, deleteUserResponse ] = useMutation(deleteUserQuery, {
        onError: (error) => {
          setError(error.graphQLErrors[0].message)
         }
    })

    if (error === "Invalid token") {
        logout()
        alert("Token is invalid. It may have expired or user was deleted.")
    }

    useEffect(() => {
        if ( editFamilyNameFirstResponse.data ) {
            if (!error) {
                setNameOrderState(!nameOrderState);
            }
        }
      }, [editFamilyNameFirstResponse.data])

    useEffect(() => {
        if ( editEmailResponse.data ) {
            if (!error) {
                setEmail(edittedEmail)
                handleCloseEmail();
                handleOpenSnackbar("Email Changed")
            }
        }
      }, [editEmailResponse.data])

    useEffect(() => {
        if ( editPasswordResponse.data ) {
            if (!error) {
                handleClosePassword();
                handleOpenSnackbar("Password Changed")
            }
        }
      }, [editPasswordResponse.data])

    useEffect(() => {
    if ( deleteUserResponse.data ) {
        if (!error) {
            handleCloseDelete();
            logout()
        }
    }
    }, [deleteUserResponse.data])

    const handleCloseSnackbar = () => {
        setOpenSnackbar(null)
    }

    const handleOpenSnackbar = (input) => {
        setOpenSnackbar(input)
    }

    const handleConfirmDelete = () => {
        setError(null)
        deleteUser({variables: {id: user.id, password: confirmPassword}});
    }

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setConfirmPassword("")
    }

    const handleDelete = () => {
        if (user.username === "admin") {
            alert("Cannot delete admin account")
            return
        }
        setOpenDelete(true);
        setError(null);
    }

    const handleChangeDelete = () => (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleConfirmEmail = () => {
        const id = user.id
        setError(null)
        editEmail({variables: {id: id, email: edittedEmail}});
    }

    const handleCloseEmail = () => {
        setOpenEmail(false);
        setEdittedEmail("")
    }

    const handleOpenEmail = () => {
        if (user.username === "admin") {
            alert("Cannot change admin account email")
            return
        }
        setOpenEmail(true);
        setError(null);
    }

    const handleChangeEmail = () => (event) => {
        setEdittedEmail(event.target.value);
    };

    const handleConfirmPassword = () => {
        const id = user.id
        setError(null)
        editPassword({variables: {id: id, password: passwordDetails.oldPassword, newPassword: passwordDetails.newPassword}});
    }

    const handleClosePassword = () => {
        setOpenPassword(false);
        setPasswordDetails({oldPassword: "", newPassword: "", confirmPassword: ""})
    }

    const handleOpenPassword = () => {
        setOpenPassword(true);
        setError(null);
    }
    
    const handleChangePassword = (prop) => (event) => {
        setPasswordDetails({ ...passwordDetails, [prop]: event.target.value });
    };

    const handleNameOrder = (event) => {
        setError(null)
        editFamilyNameFirst({ variables: { id: user.id, familyNameFirst: event.target.checked } } )
      };


    return (
        <div>
            <CssBaseline />
            <Typography variant="h4" component="h2" gutterBottom>
                Account
            </Typography>
            <Typography variant="h6" gutterBottom>
                Your Account
            </Typography>
            <Typography variant="body2" gutterBottom>
                Signed in as {user.username} ({email})
            </Typography>
            <Typography variant="body2" gutterBottom>
                Account Type: {user.accountType} Account
            </Typography>
            <Typography variant="body2" gutterBottom>
                Joined: {convertDate(user.registeredDate)}
            </Typography>
            <ListItem>
                <ListItemIcon>
                    <Avatar alt="Avatar" src={user.avatarPath}>
                        {user.name.givenName[0]}
                    </Avatar>
                </ListItemIcon>
                <Typography>{displayName(user)}</Typography>
            </ListItem>
            <Typography>
            <Grid component="label" container spacing={1}>
                <Grid item>Given name first</Grid>
                <Grid item>
                <Switch
                    checked={nameOrderState}
                    onChange={handleNameOrder}
                    name="nameOrder"
                    label="Name order"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                </Grid>
                <Grid item>Family name first</Grid>
            </Grid>
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={ handleOpenEmail }>Change Email</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={ handleOpenPassword }>Change Password</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={ handleDelete }>Delete Account</Button>
                </Grid>
            </Grid>
            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deleting Your Account?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You would not be able to restore your account. All data will be lost.
                </DialogContentText>
                <TextField
                    error={["Empty", "Password is incorrect"].includes(error)}
                    helperText={(error === "Password is incorrect") ? error : ""}
                    autoFocus
                    margin='dense'
                    label="Enter your password to confirm"
                    type="password"
                    fullWidth
                    onChange={handleChangeDelete()}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseDelete} variant="contained" color="primary">
                    No
                </Button>
                <Button onClick={handleConfirmDelete} variant="contained" color="primary" autoFocus disabled={confirmPassword===""}>
                    Yes
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openEmail}
                onClose={handleCloseEmail}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Change your Email"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Please enter your new email address
                </DialogContentText>
                <TextField
                    error={["Invalid Email", "Email already exists"].includes(error)}
                    helperText={["Invalid Email", "Email already exists"].includes(error) ? error : ""}
                    autoFocus
                    margin='dense'
                    label="New Email"
                    fullWidth
                    onChange={handleChangeEmail()}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleConfirmEmail} variant="contained" color="primary" disabled={edittedEmail===email || edittedEmail===""}>
                    Change
                </Button>
                <Button onClick={handleCloseEmail} variant="contained" color="primary" autoFocus>
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openPassword}
                onClose={handleClosePassword}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Change your password"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Please enter the old password and new password you wish to change to.
                </DialogContentText>
                <TextField
                    error={error==="Password is incorrect"}
                    helperText={(error === "Password is incorrect") ? error : ""}
                    autoFocus
                    type="password"
                    margin='dense'
                    label="Old Password"
                    fullWidth
                    onChange={handleChangePassword('oldPassword')}
                />
                <TextField
                    error={passwordDetails.oldPassword===passwordDetails.newPassword && passwordDetails.oldPassword}
                    helperText={(passwordDetails.oldPassword===passwordDetails.newPassword && passwordDetails.oldPassword) ? "New Password cannot be the same as Old Password" : ""}
                    autoFocus
                    type="password"
                    margin='dense'
                    label="New Password"
                    fullWidth
                    onChange={handleChangePassword('newPassword')}
                />
                <TextField
                    autoFocus
                    type="password"
                    margin='dense'
                    label="Confirm New Password"
                    fullWidth
                    onChange={handleChangePassword('confirmPassword')}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleConfirmPassword} variant="contained" color="primary" disabled={passwordDetails.newPassword!==passwordDetails.confirmPassword || passwordDetails.oldPassword===passwordDetails.newPassword || passwordDetails.oldPassword==="" || passwordDetails.newPassword==="" || passwordDetails.confirmPassword===""}>
                    Save
                </Button>
                <Button onClick={handleClosePassword} variant="contained" color="primary" autoFocus>
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {openSnackbar}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default AccountSettings
