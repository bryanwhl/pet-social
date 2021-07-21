import { Drawer, Divider } from '@material-ui/core';
import { MenuList, Avatar, ListItem, ListItemIcon, ListItemText, Tooltip, IconButton, ListItemSecondaryAction } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Post from '../posts/Post.js'
import { blue } from '@material-ui/core/colors';
import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/client'
import { getNotificationsQuery, deleteNotificationQuery, getPostByIdQuery } from '../../queries.js';
import { POST_LIKED, POST_COMMENT, COMMENT_LIKED, FRIEND_REQUEST, FRIEND_REQUEST_INTERACT, DELETE_FRIEND, DELETE_NOTIF } from '../../subscriptions.js';
import { displayName } from '../../utility.js'
import ClearIcon from '@material-ui/icons/Clear';
import * as timeago from 'timeago.js';
import ReceivedFriendRequests from '../profile/ReceivedFriendRequests.js';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    paddingTop: 55,
    width: drawerWidth,
  },
  root: {
      display: 'flex',
  },
  drawerContainer: {
      overflow: 'auto'
  },
  avatar: {
    backgroundColor: blue[500],
  },
}));

const displayNotificationMessage = (notification) => {
    if (notification.notificationType === "Post Like") {
        return displayName(notification.fromUser) + " liked your post"
    } else if (notification.notificationType === "Post Comment") {
        return displayName(notification.fromUser) + " commented on your post"
    } else if (notification.notificationType === "Comment Like") {
        return displayName(notification.fromUser) + " liked your comment"
    } else if (notification.notificationType === "Friend Request") {
        return displayName(notification.fromUser) + " send you a friend request"
    }
}

const RightNotificationBar = ({ drawerState, user, setNumNotifications, client, getCurrentUser }) => {

    const classes = useStyles();

    const allNotifications = useQuery(getNotificationsQuery, {variables: {id: user.id}})
    const [notifications, setNotifications] = useState([]);

    const [postOpen, setPostOpen] = useState(false);
    const [backdropPost, setBackdropPost] = useState(null);
    const [receivedDialog, setReceivedDialog] = useState(false)

    const [getQueryPost, queryPost] = useLazyQuery(getPostByIdQuery, {
        fetchPolicy: "no-cache"
    })

    useEffect(() => {
        if (queryPost.data) {
          setBackdropPost(queryPost.data.findPost)
        }
    }, [queryPost.data])

    const handleOpenPost = (id) => {
        setPostOpen(true);
        getQueryPost({variables: {id}})
    };

    const handleClosePost = () => {
        setPostOpen(false);
        setBackdropPost(null)
    };

    const handleOpenReceivedRequests = () => {
        setReceivedDialog(true)
    };

    const handleCloseReceivedRequests = () => {
        setReceivedDialog(false)
    };

    const [ deleteNotification, deleteNotificationResponse ] = useMutation(deleteNotificationQuery, {refetchQueries: [{query: getNotificationsQuery, variables: {id: user.id}}]})


    const updateCacheWith = (addedNotification) => {
        const includedIn = (set, object) => 
          set.map(p => p.id).includes(object.id)  
    
        const dataInStore = client.readQuery({ query: getNotificationsQuery, variables: {id: user.id} })
        if (!includedIn(dataInStore.getNotifications, addedNotification)) {
          client.writeQuery({
            query: getNotificationsQuery,
            data: { getNotifications : dataInStore.getNotifications.concat(addedNotification) },
            variables: {id: user.id}
          })
        }   
    }
    
    const removeCacheWith = (removedNotification) => {
        const includedIn = (set, object) => 
          set.map(p => p.id).includes(object.id)  
    
        const dataInStore = client.readQuery({ query: getNotificationsQuery, variables: {id: user.id} })
        if (includedIn(dataInStore.getNotifications, removedNotification)) {
          client.writeQuery({
            query: getNotificationsQuery,
            data: { getNotifications : dataInStore.getNotifications.filter(notif => notif.id !== removedNotification.id) },
            variables: {id: user.id}
          })
        }   
    }

    useEffect(() => {
        if (allNotifications.data) {
          let outputArr = allNotifications.data.getNotifications.slice().sort((a, b) => {return b.date - a.date}); 
          setNotifications(outputArr);
          setNumNotifications(outputArr.length);
        }
      }, [allNotifications])

    useSubscription(POST_LIKED, {
        variables: {id: user.id},
        onSubscriptionData: ({ subscriptionData }) => {
          console.log(subscriptionData)
          updateCacheWith(subscriptionData.data.postLiked)
        }
    })

    useSubscription(POST_COMMENT, {
        variables: {id: user.id},
        onSubscriptionData: ({ subscriptionData }) => {
          console.log(subscriptionData)
          updateCacheWith(subscriptionData.data.postComment)
        }
    })
    
    useSubscription(COMMENT_LIKED, {
        variables: {id: user.id},
        onSubscriptionData: ({ subscriptionData }) => {
          console.log(subscriptionData)
          updateCacheWith(subscriptionData.data.commentLiked)
        }
    })
    
    useSubscription(FRIEND_REQUEST, {
        variables: {id: user.id},
        onSubscriptionData: ({ subscriptionData }) => {
          console.log(subscriptionData)
          updateCacheWith(subscriptionData.data.friendRequestReceived)
          getCurrentUser()
        }
    })
    
    useSubscription(FRIEND_REQUEST_INTERACT, {
        variables: {id: user.id},
        onSubscriptionData: ({ subscriptionData }) => {
          console.log(subscriptionData)
          getCurrentUser()
        }
    })
  
    useSubscription(DELETE_FRIEND, {
        variables: {id: user.id},
        onSubscriptionData: ({ subscriptionData }) => {
          console.log(subscriptionData)
          getCurrentUser()
        }
    })

    useSubscription(DELETE_NOTIF, {
        variables: {id: user.id},
        onSubscriptionData: ({ subscriptionData }) => {
          console.log("Delete ", subscriptionData)
          removeCacheWith(subscriptionData.data.deleteNotif)
          getCurrentUser()
        }
    })

    const handleNotificationClick = (notif) => {
        if (["Post Like", "Post Comment", "Comment Like"].includes(notif.notificationType)) {
            handleOpenPost(notif.post.id)
        } else if (["Friend Request"].includes(notif.notificationType)) {
            handleOpenReceivedRequests()
        }
    }
    
    const handleDismissNotification = (notification) => {
        deleteNotification({variables: {id: notification.id}})
    }

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant='persistent'
                anchor='right'
                open={drawerState}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <MenuList id="menu-list-grow" disablePadding>
                <div className={classes.drawerContainer}>
                    {notifications.filter(notif => user.settings.likeNotification ? true : !["Post Like", "Comment Like"].includes(notif.notificationType))
                    .filter(notif => user.settings.commentNotification ? true : notif.notificationType !== "Post Comment").map(item => (
                        <ListItem
                            button
                            onClick={() => handleNotificationClick(item)}
                        >
                            <ListItemIcon>
                            <Avatar alt="Avatar" src={item.fromUser.avatarPath} className={classes.avatar}>
                                {item.fromUser.name.givenName[0]}
                            </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={displayNotificationMessage(item)} secondary={timeago.format(item.date)}></ListItemText>
                            <ListItemSecondaryAction>
                                <Tooltip title="Dismiss Notification">
                                    <IconButton edge="end" aria-label="comments" onClick={() => handleDismissNotification(item)}>
                                        <ClearIcon />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </div>
                <ListItem>
                    <ListItemText primary={String(notifications)===String([]) && "You have no notifications"}></ListItemText>
                </ListItem>
                </MenuList>
            </Drawer>
            <Dialog onClose={handleClosePost} open={postOpen} scroll={"body"} fullWidth
            PaperProps={{
                style: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
                maxWidth: "75vmin"
                },
            }}>
                {backdropPost && <Post user={user} post={backdropPost} closePost={handleClosePost}/>}
            </Dialog>
            <ReceivedFriendRequests user={user} receivedDialog={receivedDialog} handleCloseReceivedRequests={handleCloseReceivedRequests} />
        </div>
    )
}

export default RightNotificationBar
