import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import MuiAlert from '@material-ui/lab/Alert';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { List, ListItem, ListItemAvatar, ListItemText, ListItemIcon } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import BackspaceIcon from '@material-ui/icons/Backspace';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { displayName, convertDate } from '../../utility.js';
import { useMutation } from '@apollo/client'
import { currentUserQuery, deleteFriendQuery, retractFriendRequestQuery, acceptFriendRequestQuery } from '../../queries.js'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexGrow: 1,
      marginTop: 20,
      width: "50vmin",
      height: "15vh",
      zIndex: 1,
    },
  }));

const FriendList = ({ user }) => {
    const classes=useStyles();

    const [openSnackbar, setOpenSnackbar] = useState(null)
    const [snackbarSeverity, setSnackbarSeverity] = useState("success")
    const [error, setError] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [sentDialog, setSentDialog] = useState(false)
    const [receivedDialog, setReceivedDialog] = useState(false)

    const [ deleteFriend, deleteFriendResponse ] = useMutation(deleteFriendQuery, {refetchQueries: [{query: currentUserQuery}]})
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
        if ( deleteFriendResponse.data ) {
          setSelectedFriend(null);
        }
      }, [deleteFriendResponse.data])

    useEffect(() => {
    if (retractFriendRequestResponse.data) {
        if (!error) {
            if (sentDialog) {
                handleOpenSnackbar("Friend Request Retracted", "success")
                if (user.sentFriendRequests.length === 1) {
                    handleCloseSentRequests()
                }
            } else {
                handleOpenSnackbar("Friend Request Dismissed", "success")
                if (user.receivedFriendRequests.length === 1) {
                    handleCloseReceivedRequests()
                }
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

    const handleFriend = (item) => () => {
        setSelectedFriend(item)
    };
    
    const handleRemoveFriend = (item) => () => {
        setSelectedFriend(item)
        setDeleteDialog(true)
    };
    
    const handleCloseDeleteDialog = () => {
        setDeleteDialog(false)
    };
    
    const handleConfirmDelete = () => {
        deleteFriend({variables: {id: user.id, friend: selectedFriend.id}})
        setDeleteDialog(false)
    };
    
    const handleOpenSentRequests = () => {
        setError(null)
        setSentDialog(true)
    };
    
    const handleCloseSentRequests = () => {
        setSentDialog(false)
    };
    
    const handleRetractRequest = (request) => () => {
        retractFriendRequest({variables: {to: request.toUser.id, from: user.id}})
    };
    
    const handleOpenReceivedRequests = () => {
        setError(null)
        setReceivedDialog(true)
    };
    
    const handleCloseReceivedRequests = () => {
        setReceivedDialog(false)
    };

    const handleAcceptRequest = (request) => () => {
        acceptFriendRequest({variables: {to: user.id, from: request.fromUser.id}})
    };
    
    const handleRejectRequest = (request) => () => {
        retractFriendRequest({variables: {to: user.id, from: request.fromUser.id}})
    };

    return (
        <div>
            <CssBaseline>
                <Grid container className={classes.root} spacing={1}>
                    <Grid item xs={9}>
                        <Typography variant="h4">Friends</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <List>
                            <ListItem
                                button
                                onClick={handleOpenSentRequests}
                                disabled={!user.sentFriendRequests.length}
                            >
                                <ListItemIcon>
                                    <Badge color="secondary" badgeContent={user.sentFriendRequests.length}>
                                        <SendIcon />
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText primary={"Sent Friend Requests"}></ListItemText>
                            </ListItem>
                            <ListItem
                                button
                                onClick={handleOpenReceivedRequests}
                                disabled={!user.receivedFriendRequests.length}
                            >
                                <ListItemIcon>
                                    <Badge color="secondary" badgeContent={user.receivedFriendRequests.length}>
                                        <PersonAddIcon />
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText primary={"Received Friend Requests"}></ListItemText>
                            </ListItem>
                            {user.friends.map(item => (
                                <ListItem
                                    button
                                    key={item.id}
                                    selected={selectedFriend===item}
                                    onClick={handleFriend(item)}
                                >
                                    <ListItemIcon><Avatar alt="Avatar" src={item.avatarPath} /></ListItemIcon>
                                    <ListItemText primary={displayName(item)}></ListItemText>
                                    <ListItemSecondaryAction>
                                        <Tooltip title="Delete Friend" placement="right">
                                            <IconButton edge="end" aria-label="comments" onClick={handleRemoveFriend(item)}>
                                                <ClearIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
                <Dialog onClose={handleCloseDeleteDialog} open={deleteDialog} fullWidth>
                    <DialogTitle>Remove Friend</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove {selectedFriend && displayName(selectedFriend)} as a friend?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleConfirmDelete} color="primary">
                        Yes
                    </Button>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    </DialogActions>
                </Dialog>
                <Dialog onClose={handleCloseSentRequests} aria-labelledby="simple-dialog-title" open={sentDialog}>
                <DialogTitle id="simple-dialog-title">Sent Friend Requests</DialogTitle>
                    <List>
                        {user.sentFriendRequests.map((request) => (
                        <ListItem button key={request}>
                            <ListItemAvatar>
                            <Avatar src={request.toUser.avatarPath}/>
                            </ListItemAvatar>
                            <ListItemText primary={displayName(request.toUser)} secondary={`Sent ${convertDate(request.date)}`}/>
                            <ListItemSecondaryAction>
                                <Tooltip title="Retract Friend Request" placement="right">
                                    <IconButton edge="end" aria-label="comments" onClick={handleRetractRequest(request)}>
                                        <BackspaceIcon />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                        ))}
                    </List>
                </Dialog>
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
            </CssBaseline>
        </div>
    )
}

export default FriendList
