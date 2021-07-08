import React, { useState, useEffect } from 'react'
import {Grid, Container, Card, IconButton, 
    CardMedia, CardContent, Typography, 
    CardHeader, makeStyles, CardActions, 
    Grow, Paper, ClickAwayListener, 
    MenuList, Popper, ListItem, Avatar,
    ListItemIcon, ListItemText, Collapse,
    Divider, List, ListItemSecondaryAction} from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import MuiAlert from '@material-ui/lab/Alert';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ReplyIcon from '@material-ui/icons/Reply';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { red, blue } from '@material-ui/core/colors';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import { displayName, convertDate } from '../../utility.js';
import { deleteCommentQuery, getPostsQuery, likeCommentQuery } from '../../queries.js';
import { useMutation } from '@apollo/client';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    popper: {
        zIndex: theme.zIndex.drawer + 2,
    },
}));

const Comment = ({ user, post, comment, handleUserClick }) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [liked, setLiked] = useState(false);

    const [edit, setEdit] = useState(false);
    const [text, setText] = useState(comment.text);

    const [ deleteComment, deleteCommentResult ] = useMutation(deleteCommentQuery, {
        refetchQueries: [{query: getPostsQuery}],
    })
    const [ likeComment, likeCommentResult ] = useMutation(likeCommentQuery, {
        refetchQueries: [{query: getPostsQuery}],
    })

    useEffect(() => {
        setLiked(false);
        if (comment !== undefined && comment.likedBy !== undefined) {
            comment.likedBy.forEach((userLiked) => {
                if (user.id === userLiked.id) {
                    setLiked(true);
                }
            })
        }
    });

    const handleEdit = () => {
        setEdit(true)
        setOpen(false)
    }
    
    const handleCloseEdit = () => {
        setEdit(false)
    }

    const handleDelete = () => {
        console.log(comment.id, post.id)
        deleteComment({variables: {id: comment.id, post: post.id}})
        setOpen(false)
        setAnchorEl(false)
    }

    const commentItems = [
        {
            text: "Edit (Coming Soon)",
            icon: <EditIcon />,
            path: "/",
            onClick: handleEdit
        },
        {
            text: "Delete",
            icon: <DeleteIcon />,
            path: "/",
            onClick: handleDelete
        }
    ]

    const handleLikedToggle = () => {
        likeComment({variables: {id: comment.id, user: user.id}});
      };

    const handleOptionsToggle = (event) => {
        setOpen((prevOpen) => !prevOpen);
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleOptionsClose = (event) => {
        if (anchorEl && anchorEl.contains(event.target)) {
          return;
        }
    
        setOpen(false);
        setAnchorEl(null);
    };

    return (
        <div>
            <ListItem
                button
                divider="true"
                selected={open}
            >
                <ListItemIcon onClick={handleUserClick(comment.user.id)}>
                    <Avatar src={comment.user.avatarPath} />
                </ListItemIcon>
                <ListItemText primary={displayName(comment.user)} secondary={comment.text} onClick={handleUserClick}></ListItemText>
                <ListItemSecondaryAction>
                    <IconButton aria-label="like" onClick={handleLikedToggle}>
                        <Badge color="secondary" badgeContent={comment.likedBy.length} anchorOrigin={{vertical: 'bottom',horizontal: 'right',}}>
                                {liked === true ? <ThumbUpAltIcon color="secondary"/> : <ThumbUpAltIcon />} 
                        </Badge>
                    </IconButton>
                    <IconButton edge="end" aria-label="comments" onClick={handleOptionsToggle}>
                        <MoreVertIcon />
                    </IconButton>
                </ListItemSecondaryAction>
                <Popper open={open} anchorEl={anchorEl} transition disablePortal className={classes.popper} placement="bottom-end">
                    {({ TransitionProps, placement }) => (
                        <Grow
                        {...TransitionProps}
                        >
                        <Paper>
                            <ClickAwayListener onClickAway={handleOptionsClose}>
                            <List>
                                <ListItem button onClick={handleOptionsClose}>
                                    <ListItemIcon>
                                        <ReplyIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Reply (Coming Soon)"/>
                                </ListItem>
                                {user.id===comment.user.id && commentItems.map(item => (
                                    <ListItem
                                        button
                                        key={item.text}
                                        onClick={item.onClick}
                                    >
                                        <ListItemIcon>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.text}></ListItemText>
                                    </ListItem>
                                ))}
                            </List>
                            </ClickAwayListener>
                        </Paper>
                        </Grow>
                    )}
                </Popper>
            </ListItem>
        </div>
    )
}

export default Comment
