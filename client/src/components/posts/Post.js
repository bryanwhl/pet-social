import React, { useState, useEffect } from 'react'
import {Grid, Container, Card, IconButton, 
    CardMedia, CardContent, Typography, 
    CardHeader, makeStyles, CardActions, 
    Grow, Paper, ClickAwayListener, 
    MenuList, Popper, ListItem, Avatar,
    ListItemIcon, ListItemText, Collapse,
    Divider, List, Button, ButtonBase, ListItemSecondaryAction} from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import MuiAlert from '@material-ui/lab/Alert';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import CommentIcon from '@material-ui/icons/Comment';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { red, blue } from '@material-ui/core/colors';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import CancelIcon from '@material-ui/icons/Cancel';
import ReportIcon from '@material-ui/icons/Report';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import SubmitComment from './SubmitComment.js'
import Comment from './Comment.js'
import Tooltip from '@material-ui/core/Tooltip';
import * as timeago from 'timeago.js';
import { displayName, convertDate } from '../../utility.js';
import { editPostCaptionQuery, getPostsQuery, likePostQuery, savePostQuery, currentUserQuery, deletePostQuery, sendFriendRequestQuery, retractFriendRequestQuery, acceptFriendRequestQuery } from '../../queries.js';
import { useMutation } from '@apollo/client';
import { id } from 'date-fns/locale';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        padding: "20px",
    },
    root: {
        width: "100%",
        marginTop: "40px"
    },
    media: {
        height: 0,
        paddingTop: '90.25%', // 16:9
    },
    videoMedia: {
        height: "100%",
        width: "100%",
        // paddingTop: '90.25%', // 16:9
    },
    bookmark: {
        marginLeft: 'auto',
    },
    avatarRed: {
        backgroundColor: red[500],
    },
    avatarBlue: {
        backgroundColor: blue[500],
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    popper: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));

const Post = ({user, post, closePost}) => {
    const classes = useStyles();

    const [openSnackbar, setOpenSnackbar] = useState(null)
    const [snackbarSeverity, setSnackbarSeverity] = useState("success")
    const [error, setError] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [openUser, setOpenUser] = React.useState(false);
    const [openUserPopper, setOpenUserPopper] = React.useState(false);
    const [friendRequestText, setFriendRequestText] = React.useState(false);
    const anchorOptionsRef = React.useRef(null);
    const [liked, setLiked] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [userAnchor, setUserAnchor] = React.useState(null);
    const [edittedCaption, setEdittedCaption] = useState(post.text);
    const [openEditPost, setOpenEditPost] = React.useState(false);

    React.useEffect(() => {
        setLiked(false);
        if (post !== undefined && post.likedBy !== undefined) {
            post.likedBy.forEach((userLiked) => {
                if (user.id === userLiked.id) {
                    setLiked(true);
                }
            })
        }
    });

    React.useEffect(() => {
        setSaved(false);
        if (user !== undefined && user.savedPosts !== undefined) {
            user.savedPosts.forEach((savedPost) => {
                if (savedPost.id === post.id) {
                    setSaved(true);
                }
            })
        }
    });

    const [ likePost, likePostResult ] = useMutation(likePostQuery, {
        refetchQueries: [{query: getPostsQuery}],
    })

    const [ savePost, savePostResult ] = useMutation(savePostQuery, {
        refetchQueries: [{query: currentUserQuery}],
    })

    const [ editPostCaption ] = useMutation(editPostCaptionQuery, {
        refetchQueries: [{query: getPostsQuery}]
    })
    
    const [ sendFriendRequest,  sendFriendRequestResponse ] = useMutation(sendFriendRequestQuery, {
        onError: (error) => {
          setError(error.graphQLErrors[0].message)
         }, refetchQueries: [{query: currentUserQuery}]
    })
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

    const [ deletePost, deletePostResult ] = useMutation(deletePostQuery, {
        refetchQueries: [{query: getPostsQuery}],
    })

    const handleCloseSnackbar = () => {
        setOpenSnackbar(null)
    }

    const handleOpenSnackbar = (input, severity) => {
        setOpenSnackbar(input)
        setSnackbarSeverity(severity)
    }

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const handleOptionsToggle = () => {
      setOpen((prevOpen) => !prevOpen);
      console.log("Options popper is toggling now!")
      console.log("value after toggle: " + prevOpen)
    };
  
    // const handleOptionsClose = (event) => {
    //   if (anchorOptionsRef.current && anchorOptionsRef.current.contains(event.target)) {
    //     return;
    //   }
  
    //   setOpen(false);
    // };

    const handleOptionsClose = () => {
      setOpen(false);
      console.log("Options popper is closing now!")
    };

    const handleLikedToggle = () => {
      likePost({variables: {id: post.id, userID: user.id}});
    };

    const handleSavedToggle = () => {
      savePost({variables: {id: user.id, postID: post.id}});
      if (closePost) {
          closePost()
      }
      if (user !== undefined && !user.savedPosts.map(post => post.id).includes(post.id)) {
        handleOpenSnackbar("Post saved. You may find it in Profile -> Saved", "success")
      }
    };
  
    function handleListKeyDown(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      }
    }

    const handleUserClick = (targetUser) => (event) => {
        setOpenUser(targetUser)
        setError(null)
        setOpenUserPopper(true);
        setUserAnchor(event.currentTarget);
    };
    
    const handleUserClose = () => {
        setUserAnchor(null);
        setOpenUserPopper(false);
    };

    const handleFriendRequestClick = () => {
        if (friendRequestText === "Add as Friend") {
            sendFriendRequest({variables: {from: user.id, to: openUser}})
        } else if (friendRequestText === "Retract Friend Request") {
            retractFriendRequest({variables: {from: user.id, to: openUser}})
        } else if (friendRequestText === "Accept Friend Request") {
            acceptFriendRequest({variables: {from: openUser, to: user.id}})
        }
    }

    const handleDelete = () => {
        console.log(user.id, post.id)
        deletePost({variables: {id: post.id, userID: user.id}})
        handleOptionsClose()
        // setOpen(false)
        // setAnchorEl(false)
    }

    const handleOpenEditPost = () => {
      setOpenEditPost(true);
      console.log("Edit Post Dialog is opening now!")
    };
  
    const handleCloseEditPost = () => {
      setOpenEditPost(false);
      console.log("Edit Post Dialog is closing now!")
    };

    const handleEditCaption = (event) => {
      event.preventDefault();
      editPostCaption({variables: {id: post.id, text: edittedCaption}})
      handleCloseEditPost();
      handleOptionsClose();
    }

    const handleEditChange = (event) => {
      setEdittedCaption(event.target.value);
    };

    const otherUserMenuItems = [
        {
            text: "Receive notifications from this post (Coming Soon)",
            icon: <NotificationsActiveIcon />,
            path: "/"
        },
        {
            text: "Hide posts from this user (Coming Soon)",
            icon: <CancelIcon />,
            path: "/"
        },
        {
            text: "Report Post (Coming Soon)",
            icon: <ReportIcon />,
            path: "/"
        }
    ]
    
    const userMenuItems = [
        {
            text: "Receive notifications from this post (Coming Soon)",
            icon: <NotificationsActiveIcon />,
            path: "/",
            onClick: handleOptionsClose
        },
        {
            text: "Edit Post",
            icon: <EditIcon />,
            path: "/",
            onClick: handleOpenEditPost
        },
        {
            text: "Delete Post",
            icon: <DeleteIcon />,
            path: "/",
            onClick: handleDelete
        }
    ]

    useEffect(() => {
        if (openUser) {
            if (user.sentFriendRequests.map(request => request.toUser.id).includes(openUser)) {
                setFriendRequestText("Retract Friend Request")
            } else if (user.receivedFriendRequests.map(request => request.fromUser.id).includes(openUser)) {
                setFriendRequestText("Accept Friend Request")
            } else {
                setFriendRequestText("Add as Friend")
            }
        }
      }, [openUserPopper])
    
      useEffect(() => {
        if (sendFriendRequestResponse.data) {
            if (!error) {
                handleOpenSnackbar("Friend Request Sent", "success")
                handleUserClose()
            } else {
                handleOpenSnackbar(error, "error")
                handleUserClose()
            }
        }
      }, [sendFriendRequestResponse.data])
      
      useEffect(() => {
        if (retractFriendRequestResponse.data) {
            if (!error) {
                handleOpenSnackbar("Friend Request Retracted", "success")
                handleUserClose()
            } else {
                handleOpenSnackbar(error, "error")
                handleUserClose()
            }
        }
      }, [retractFriendRequestResponse.data])
      
      useEffect(() => {
        if (acceptFriendRequestResponse.data) {
            if (!error) {
                handleOpenSnackbar("Friend Request Accepted", "success")
                handleUserClose()
            } else {
                handleOpenSnackbar(error, "error")
                handleUserClose()
            }
        }
      }, [acceptFriendRequestResponse.data])
      
      useEffect(() => {
        if (error) {
            handleOpenSnackbar(error, "error")
            handleUserClose()
        }
      }, [error])
    
  
    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorOptionsRef.current.focus();
      }
  
      prevOpen.current = open;
    }, [open]);

    console.log(post.postType);
    return (
        <div>
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <ButtonBase disableRipple disableTouchRipple>
                            <Avatar src={post.user.avatarPath} onClick={handleUserClick(post.user.id)} />
                        </ButtonBase>
                    }
                    action={
                        <div>
                            <IconButton
                            ref={anchorOptionsRef}
                            aria-controls={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleOptionsToggle}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Popper open={open} anchorEl={anchorOptionsRef.current} role={undefined} transition placement={post.postType==="video" ? "top" : "bottom"} disablePortal modifiers={post.postType==="video" ? {flip: {enabled: false}} : {}}>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                {...TransitionProps}
                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleOptionsClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        {user.id===post.user.id && userMenuItems.map(item => (
                                            <ListItem
                                                button
                                            >
                                                <ListItemIcon onClick={item.onClick}>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={item.text} onClick={item.onClick} />
                                                {item.text!=="Edit Post" ? null : <Dialog open={openEditPost} aria-labelledby="form-dialog-title">
                                                    <DialogTitle id="form-dialog-title">Edit Caption</DialogTitle>
                                                    <DialogContent>
                                                    <DialogContentText>
                                                        Please submit your new caption:
                                                    </DialogContentText>
                                                    <TextField
                                                        autoFocus
                                                        margin="dense"
                                                        id="name"
                                                        label="Email Address"
                                                        type="email"
                                                        fullWidth
                                                        defaultValue={post.text}
                                                        onChange={handleEditChange}
                                                    />
                                                    </DialogContent>
                                                    <DialogActions>
                                                    <Button onClick={handleCloseEditPost} color="primary">
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleEditCaption} color="primary">
                                                        Submit
                                                    </Button>
                                                    </DialogActions>
                                                </Dialog>}
                                            </ListItem>
                                        ))}
                                        {user.id!==post.user.id && otherUserMenuItems.map(item => (
                                            <ListItem
                                                button
                                                key={item.text}
                                                onClick={handleOptionsClose}
                                            >
                                                <ListItemIcon>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={item.text}></ListItemText>
                                            </ListItem>
                                        ))}
                                    </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                                </Grow>
                            )}
                            </Popper>
                        </div>
                    }
                    title={displayName(post.user)}
                    subheader={timeago.format(post.date)}
                    //subheader={convertDate(post.date)}
                />
                    {post.postType === "image" ? <CardMedia
                        className={classes.media}
                        image={post.imageFilePath}
                    /> : <CardMedia className={classes.videoMedia}><video 
                    src={post.imageFilePath}
                    title="Video"
                    controls
                    height="100%"
                    width="100%"
                    controls
                    >    
                    </video></CardMedia>}
                <CardContent>
                    <Typography variant="body2" component="p">
                        {post.text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="like" onClick={handleLikedToggle}>
                        <Badge color="secondary" badgeContent={post.likedBy.length} anchorOrigin={{vertical: 'bottom',horizontal: 'right',}}>
                                {liked === true ? <ThumbUpAltIcon color="secondary"/> : <ThumbUpAltIcon />} 
                        </Badge>
                    </IconButton>
                    <IconButton aria-label="comment" onClick={handleExpandClick}>
                        <Badge color="secondary" badgeContent={post.comments.length} anchorOrigin={{vertical: 'bottom',horizontal: 'right',}}>
                            <CommentIcon />
                        </Badge>
                    </IconButton>
                    <Tooltip title="Share this post (Coming Soon)">
                        <IconButton aria-label="share">
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={user.savedPosts.map(post => post.id).includes(post.id) ? "Unsave this post" : "Save this post"}>
                        <IconButton className={classes.bookmark} aria-label="bookmark" onClick={handleSavedToggle}>
                            {saved === true ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                    </Tooltip>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <MenuList id="menu-list-grow">
                            <Divider />
                            <List>
                            {post.comments.map(item => (
                                <Comment user={user} post={post} comment={item} handleUserClick={handleUserClick}/>
                            ))}
                            </List>
                            <SubmitComment user={user} post={post}/>
                        </MenuList>
                    </CardContent>
                </Collapse>
            </Card>
            <Popper className={classes.popper} open={openUserPopper} anchorEl={userAnchor} placement={'bottom'} transition disablePortal className={classes.popper}>
                {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                    <Paper>
                        <ClickAwayListener onClickAway={handleUserClose}>
                            <MenuList id="user-grow">
                                {(user.id !== openUser && !user.friends.map(friend => friend.id).includes(openUser)) && <ListItem button onClick={handleFriendRequestClick}>
                                    <ListItemIcon>
                                        {<PersonAddIcon />}
                                    </ListItemIcon>
                                    <Typography>{friendRequestText}</Typography>
                                </ListItem>}
                                {(user.id !== openUser && !user.friends.map(friend => friend.id).includes(openUser)) && <Divider />}
                                <ListItem button>
                                    <ListItemIcon>
                                        <PersonIcon/>
                                    </ListItemIcon>
                                    <Typography>View Profile (Coming soon)</Typography>
                                </ListItem>
                            </MenuList>
                            </ClickAwayListener>
                    </Paper>
                </Grow>
                )}
            </Popper>
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {openSnackbar}
        </Alert>
        </Snackbar>
        </div>
    )
}

Post.defaultProps = {
    comments:[]
}

export default Post
