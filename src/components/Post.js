import React from 'react';
import {Grid, Container, Card, IconButton, 
    CardMedia, CardContent, Typography, 
    Avatar, CardHeader, makeStyles, 
    CardActions, Grow, Paper, ClickAwayListener, MenuList, Popper, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import CommentIcon from '@material-ui/icons/Comment';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import { red } from '@material-ui/core/colors';
import dogImage from './static/images/eastcoast.jpg';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import CancelIcon from '@material-ui/icons/Cancel';
import ReportIcon from '@material-ui/icons/Report';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        padding: "20px",
    },
    root: {
        maxWidth: 700,
    },
    media: {
        height: 0,
        paddingTop: '90.25%', // 16:9
    },
    bookmark: {
        marginLeft: 'auto',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

const Post = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const history = useHistory();

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
  
    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
  
    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
  
      setOpen(false);
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
        anchorRef.current.focus();
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
                                <Avatar aria-label="bryan" className={classes.avatar}>
                                    B
                                </Avatar>
                                }
                                action={
                                    <div>
                                        <IconButton
                                        ref={anchorRef}
                                        aria-controls={open ? 'menu-list-grow' : undefined}
                                        aria-haspopup="true"
                                        onClick={handleToggle}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                        {({ TransitionProps, placement }) => (
                                            <Grow
                                            {...TransitionProps}
                                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                            >
                                            <Paper>
                                                <ClickAwayListener onClickAway={handleClose}>
                                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                    {menuItems.map(item => (
                                                        <ListItem
                                                            button
                                                            key={item.text}
                                                            onClick={handleClose}
                                                        >
                                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                                            <ListItemText primary={item.text}></ListItemText>
                                                        </ListItem>
                                                    ))}
                                                    {/* <MenuItem onClick={handleClose}>Receive notifications from this post</MenuItem>
                                                    <MenuItem onClick={handleClose}>Hide posts from this user</MenuItem>
                                                    <MenuItem onClick={handleClose}>Report Post</MenuItem> */}
                                                </MenuList>
                                                </ClickAwayListener>
                                            </Paper>
                                            </Grow>
                                        )}
                                        </Popper>
                                    </div>
                                }
                                title="Bryan Wong"
                                subheader="May 8, 2021"
                            />
                            <CardMedia
                                className={classes.media}
                                image= {dogImage}
                                title="dogs"
                            />
                            
                            <CardContent>
                                <Typography variant="body2" component="p">
                                Took my dogs out to East Coast Park for a walk today.
                                They seem to enjoy the sea breeze a lot!
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="like">
                                    <ThumbUpAltIcon />
                                </IconButton>
                                <IconButton aria-label="comment">
                                    <CommentIcon />
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                                <IconButton className={classes.bookmark} aria-label="bookmark">
                                    <BookmarkBorderIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                        
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default Post
