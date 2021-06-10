import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch';
import { useMutation } from '@apollo/client'
import { editLikeNotificationQuery, editCommentNotificationQuery, currentUserQuery, editShareNotificationQuery } from '../../queries.js'

const NotificationsSettings = ( {user} ) => {
    const [likeNotificationState, setLikeNotificationState] = useState(user.settings.likeNotification);
    const [commentNoficiationState, setCommentNoficiationState] = useState(user.settings.commentNotification);
    const [shareNotificationState, setShareNotificationState] = useState(user.settings.shareNotification);

    const [ editLikeNotification ] = useMutation(editLikeNotificationQuery, {refetchQueries: [{query: currentUserQuery}]})
    const [ editCommentNotification ] = useMutation(editCommentNotificationQuery, {refetchQueries: [{query: currentUserQuery}]})
    const [ editShareNotification ] = useMutation(editShareNotificationQuery, {refetchQueries: [{query: currentUserQuery}]})

    const handleLikeNotification = (event) => {
        setLikeNotificationState(event.target.checked);
        editLikeNotification({ variables: { id: user.id, likeNotification: event.target.checked } } )
    };

    const handleCommentNotification = (event) => {
        setCommentNoficiationState(event.target.checked);
        editCommentNotification({ variables: { id: user.id, commentNotification: event.target.checked } } )
    };

    const handleShareNotification = (event) => {
        setShareNotificationState(event.target.checked);
        editShareNotification({ variables: { id: user.id, shareNotification: event.target.checked } } )
    };

    return (
        <div>
            <CssBaseline />
            <Typography variant="h4" component="h2" gutterBottom>
                Notifications
            </Typography>
            <Typography variant="h6" gutterBottom>
                Select which notifications you'd like to see
            </Typography>
            <Grid component="label" container spacing={1}>
                <Grid item>Like Notifications</Grid>
                <Grid item>
                <Switch
                    checked={likeNotificationState}
                    onChange={handleLikeNotification}
                    name="likeNotification"
                    label="Like Notification"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                </Grid>
            </Grid>
            <Grid component="label" container spacing={1}>
                <Grid item>Comment Notifications</Grid>
                <Grid item>
                <Switch
                    checked={commentNoficiationState}
                    onChange={handleCommentNotification}
                    name="commentNotification"
                    label="Comment Notification"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                </Grid>
            </Grid>
            <Grid component="label" container spacing={1}>
                <Grid item>Share Notifications</Grid>
                <Grid item>
                <Switch
                    checked={shareNotificationState}
                    onChange={handleShareNotification}
                    name="shareNotification"
                    label="Share Notification"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                </Grid>
            </Grid>
        </div>
    )
}

export default NotificationsSettings
