import React from 'react'
import { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { displayName, convertDate } from '../../utility.js';
import { useMutation } from '@apollo/client'
import { currentUserQuery, retractFriendRequestQuery, acceptFriendRequestQuery } from '../../queries.js'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ReceivedFriendRequests = ({ user, receivedDialog, handleCloseReceivedRequests }) => {

    const [openSnackbar, setOpenSnackbar] = useState(null)
    const [snackbarSeverity, setSnackbarSeverity] = useState("success")
    const [error, setError] = useState(null);

    const [ retractFriendRequest,  retractFriendRequestResponse ] = useMutation(retractFriendRequestQuery, {
        onError: (error) => {
          setError(error.graphQLErrors[0].message)
         }, refetchQueries: [{query: currentUserQuery}]
    })
    const [ acceptFriendRequest,  acceptFriendRequestResponse ] = useMutation(acceptFriendRequestQuery, {
        onError: (error) => {
          setError(error.graphQLErrors[0].message)
         }, refetchQueries: [{query: currentUserQuery}]
    })

    useEffect(() => {
        if (retractFriendRequestResponse.data) {
            if (!error) {
                handleOpenSnackbar("Friend Request Dismissed", "success")
                if (user.receivedFriendRequests.length === 1) {
                    handleCloseReceivedRequests()
                }
            } else {
                handleOpenSnackbar(error, "error")
            }
        }
    }, [retractFriendRequestResponse.data])
    
    useEffect(() => {
        if (acceptFriendRequestResponse.data) {
            if (!error) {
                handleOpenSnackbar("Friend Request Accepted", "success")
                if (user.receivedFriendRequests.length === 1) {
                    handleCloseReceivedRequests()
                }
            } else {
                handleOpenSnackbar(error, "error")
            }
        }
    }, [acceptFriendRequestResponse.data])

    const handleCloseSnackbar = () => {
        setOpenSnackbar(null)
    }

    const handleOpenSnackbar = (input, severity) => {
        setOpenSnackbar(input)
        setSnackbarSeverity(severity)
    }

    const handleAcceptRequest = (request) => () => {
        acceptFriendRequest({variables: {to: user.id, from: request.fromUser.id}})
    };
    
    const handleRejectRequest = (request) => () => {
        retractFriendRequest({variables: {to: user.id, from: request.fromUser.id}})
    };

    return (
        <div>
            <Dialog onClose={handleCloseReceivedRequests} aria-labelledby="simple-dialog-title" open={receivedDialog}>
                <DialogTitle id="simple-dialog-title">Received Friend Requests</DialogTitle>
                    <List>
                        {user.receivedFriendRequests.map((request) => (
                        <ListItem button key={request}>
                            <ListItemAvatar>
                            <Avatar src={request.fromUser.avatarPath}/>
                            </ListItemAvatar>
                            <ListItemText primary={displayName(request.fromUser)} secondary={`At ${convertDate(request.date)}`}/>
                            <ListItemSecondaryAction>
                                <Tooltip title="Accept Friend Request">
                                    <IconButton edge="end" aria-label="comments" onClick={handleAcceptRequest(request)}>
                                        <CheckIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Dismiss Friend Request">
                                    <IconButton edge="end" aria-label="comments" onClick={handleRejectRequest(request)}>
                                        <ClearIcon />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                        ))}
                    </List>
                </Dialog>
                <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                        {openSnackbar}
                    </Alert>
                </Snackbar>
        </div>
    )
}

export default ReceivedFriendRequests
