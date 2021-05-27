import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';

const NotificationsSettings = (user) => {
    return (
        <div>
            <CssBaseline />
            <Typography variant="h4" component="h2" gutterBottom>
                Notifications
            </Typography>
            <Typography variant="h6" gutterBottom>
                Select which notifications you'd like to see
            </Typography>
            <Typography variant="body1" gutterBottom>
                Notification Settings Here
            </Typography>
        </div>
    )
}

export default NotificationsSettings
