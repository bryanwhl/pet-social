import React from 'react';
import {Grid, Container, Card, IconButton, 
    CardMedia, CardContent, Typography, 
    CardHeader, makeStyles, CardActions, 
    Grow, Paper, ClickAwayListener, 
    MenuList, Popper, ListItem, Avatar,
    ListItemIcon, ListItemText, Collapse,
    Divider, List, TextField} from '@material-ui/core';
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
import { displayName } from '../../utility.js'


const useStyles = makeStyles((theme) => ({
    cardGrid: {
        padding: "20px",
    },
    root: {
        width: "75vmin",
    },
    media: {
        height: 0,
        paddingTop: '90.25%', // 16:9
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
    textField: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 14,
        fullWidth: true
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
}));

const Post = ({user, post}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorOptionsRef = React.useRef(null);
    const [liked, setLiked] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);

    const menuItems = [
        {
            text: "Receive notifications from this post",
            icon: <NotificationsActiveIcon />,
            path: "/"
        },
        {
            text: "Hide posts from this user",
            icon: <CancelIcon />,
            path: "/"
        },
        {
            text: "Report Post",
            icon: <ReportIcon />,
            path: "/"
        }
    ]

    const convertDate = (unixDate) => {
        const normalDate = new Date(unixDate).toLocaleDateString("en-uk");
        return normalDate;
    }

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const handleOptionsToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
  
    const handleOptionsClose = (event) => {
      if (anchorOptionsRef.current && anchorOptionsRef.current.contains(event.target)) {
        return;
      }
  
      setOpen(false);
    };

    const handleLikedToggle = () => {
      setLiked((liked) => !liked);
    };

    const handleSavedToggle = () => {
      setSaved((saved) => !saved);
    };
  
    function handleListKeyDown(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      }
    }
  
    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorOptionsRef.current.focus();
      }
  
      prevOpen.current = open;
    }, [open]);

    return (
        <div>
            <Container className={classes.cardGrid}>
                <Grid container justify="center">
                    <Grid item>
                        <Card className={classes.root}>
                            <CardHeader
                                avatar={
                                    <Avatar src={post.user.avatarPath} />
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
                                        <Popper open={open} anchorEl={anchorOptionsRef.current} role={undefined} transition disablePortal>
                                        {({ TransitionProps, placement }) => (
                                            <Grow
                                            {...TransitionProps}
                                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                            >
                                            <Paper>
                                                <ClickAwayListener onClickAway={handleOptionsClose}>
                                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                    {menuItems.map(item => (
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
                                subheader={convertDate(post.date)}
                            />
                            <CardMedia
                                className={classes.media}
                                image= {post.imageFilePath}
                                title="dogs"
                            />
                            
                            <CardContent>
                                <Typography variant="body2" component="p">
                                    {post.text}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="like" onClick={handleLikedToggle}>
                                    {liked === true ? <ThumbUpAltIcon color="secondary"/> : <ThumbUpAltIcon />} 
                                </IconButton>
                                <IconButton aria-label="comment" onClick={handleExpandClick}>
                                    <CommentIcon />
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                                <IconButton className={classes.bookmark} aria-label="bookmark" onClick={handleSavedToggle}>
                                    {saved === true ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                </IconButton>
                            </CardActions>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <MenuList id="menu-list-grow">
                                        <Divider />
                                        <List>
                                        {post.comments.map(item => (
                                            <ListItem
                                                button
                                                divider="true"
                                            >
                                                <ListItemIcon>
                                                    <Avatar src={item.user.avatarPath} />
                                                </ListItemIcon>
                                                <ListItemText primary={displayName(item.user)} secondary={item.text}></ListItemText>
                                            </ListItem>
                                        ))}
                                        <ListItem>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Write a comment..."
                                                multiline
                                                rows={4}
                                                variant="outlined"
                                                fullWidth
                                                className={classes.textField}
                                            />
                                        </ListItem>
                                        </List>
                                        <Divider />
                                    </MenuList>
                                </CardContent>
                            </Collapse>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

Post.defaultProps = {
    comments:[]
}

export default Post
