import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';

const PrivacySettings = ( {user} ) => {
    return (
        <div>
            <CssBaseline />
            <Typography variant="h4" component="h2" gutterBottom>
                Privacy
            </Typography>
            <Typography variant="h6" gutterBottom>
                Manage your privacy settings
            </Typography>
            <Typography variant="body1" gutterBottom>
                Blocked Users: {user.blockedUsers.length}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Current Privacy Setting: {user.settings.defaultPrivacy}
            </Typography>
        </div>
    )
}

export default PrivacySettings
