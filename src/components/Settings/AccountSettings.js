import React, { useState } from 'react';
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
import Switch from '@material-ui/core/Switch';


const AccountSettings = ({ user, deleteAccount }) => {

    const [confirmPassword, setConfirmPassword] = useState(null);
    const [error, setError] = useState(null);
    const [nameOrderState, setNameOrderState] = useState(user.nameOrder);

    const [open, setOpen] = React.useState(false);

    const handleConfirm = () => {
        console.log(confirmPassword)
        if (confirmPassword === null || confirmPassword === "") {
            setError("Empty");
            return
        } else if (confirmPassword !== user.password) {
            setError("Wrong Password");
            return
        }
        handleClose();
        console.log("Confirm delete")
        deleteAccount(user.username);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleDelete = () => {
        if (user.username === "admin") {
            alert("Cannot delete admin account")
            return
        }
        setOpen(true);
        setError(null);
    }

    const handleChange = () => (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleNameOrder = (event) => {
        user.nameOrder = event.target.checked;
        setNameOrderState(event.target.checked);
        user.displayName = event.target.checked ? (user.familyName + " " + user.givenName)
            : (user.givenName + " " + user.familyName)
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
            <Typography variant="body1" gutterBottom>
                Signed in as {user.username} ({user.accountType} Account)
            </Typography>
            <ListItem>
                <ListItemIcon>
                    <Avatar>
                        {user.givenName[0]}
                    </Avatar>
                </ListItemIcon>
                <Typography>{user.displayName}</Typography>
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
            <Button variant="contained" color="primary" onClick={ handleDelete }>Delete Account</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deleting Your Account?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You would not be able to restore your account. All data will be lost.
                </DialogContentText>
                <TextField
                    error={["Empty", "Wrong Password"].includes(error)}
                    helperText={(error === "Empty") ? "Password cannot be empty"
                  : (error === "Wrong Password") ? "Incorrect Password" : ""}
                    autoFocus
                    margin='dense'
                    label="Enter your password to confirm"
                    type="password"
                    fullWidth
                    onChange={handleChange()}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    No
                </Button>
                <Button onClick={handleConfirm} color="primary" autoFocus>
                    Yes
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AccountSettings
