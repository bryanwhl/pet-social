import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';


const AccountSettings = ({ user, deleteAccount }) => {

    const [open, setOpen] = React.useState(false);

    const handleConfirm = () => {
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
    }

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
