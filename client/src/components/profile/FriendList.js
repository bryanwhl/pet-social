import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
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
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { displayName } from '../../utility.js';
import { useMutation } from '@apollo/client'
import { currentUserQuery, deleteFriendQuery } from '../../queries.js'

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

    const [selectedFriend, setSelectedFriend] = useState(null)
    const [deleteDialog, setDeleteDialog] = useState(false)

    const [ deleteFriend, deleteFriendResponse ] = useMutation(deleteFriendQuery, {refetchQueries: [{query: currentUserQuery}]})

    useEffect(() => {
        if ( deleteFriendResponse.data ) {
          setSelectedFriend(null);
        }
      }, [deleteFriendResponse.data])

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
    };
    
    const handleOpenReceivedRequests = () => {
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
                                        <IconButton edge="end" aria-label="comments" onClick={handleRemoveFriend(item)}>
                                            <ClearIcon />
                                        </IconButton>
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
            </CssBaseline>
        </div>
    )
}

export default FriendList
