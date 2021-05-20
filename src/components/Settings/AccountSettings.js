import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';

const AccountSettings = (user, classes) => {
    return (
        <div className={classes.root}>
            <CssBaseline />
            <Typography variant="h4" component="h2" gutterBottom>
                Account
            </Typography>
            <Typography variant="h6">
                Your Account
            </Typography>
            <Typography variant="body1" gutterBottom>
                Signed in as {user.username}
            </Typography>
        </div>
    )
}

export default AccountSettings
