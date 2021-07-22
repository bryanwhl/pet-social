import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions'
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import MenuList from '@material-ui/core/MenuList'
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { displayName, convertTime } from '../../utility.js'
import { Avatar } from '@material-ui/core';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/client'
import { getChatsQuery, deleteChatQuery, addMessageQuery, getChatByIdQuery } from '../../queries.js';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        padding: "20px",
    },
    root: {
        width: "100%",
        height: "70vh",
    },
    avatarRed: {
        backgroundColor: red[500],
    },
    input: {
        paddingTop: "5px",
        paddingBottom: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        backgroundColor: red[50]
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
    messages: {
        height: "62vh",
        overflow: "auto",
    },
    message: {
        maxWidth: "50%",
        display: "flex",
        marginBottom: "10px"
    },
    ownMessage: {
        paddingTop: "4px",
        paddingBottom: "2px",
        paddingLeft: "10px",
        paddingRight: "10px",
        backgroundColor: red[100]
    },
    otherMessage: {
        paddingTop: "4px",
        paddingBottom: "2px",
        paddingLeft: "10px",
        paddingRight: "10px",
    }
}));

const Chat = ({user, chatId, client}) => {
    const classes = useStyles();

    const [open, setOpen] = useState(false)
    const [chat, setChat] = useState(false)
    const scrollRef = useRef(null)
    const [openDelete, setOpenDelete] = useState(false)
    const [message, setMessage] = useState("")
    const anchorOptionsRef = React.useRef(null);
    const prevOpen = React.useRef(open);

    const chatResponse = useQuery(getChatByIdQuery, {variables: {id: chatId}})
    const [addMessage] = useMutation(addMessageQuery, {refetchQueries: {query: getChatsQuery, variables: {id: user.id}}})
    const [deleteChat] = useMutation(deleteChatQuery, {refetchQueries: {query: getChatsQuery, variables: {id: user.id}}})

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
          anchorOptionsRef.current.focus();
        }
    
        prevOpen.current = open;
    }, [open]);

    useEffect(() => {
        if (chatResponse.data) {
          setChat(chatResponse.data.getChatById);
          console.log(chatResponse.data)
        }
    }, [chatResponse])

    useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behaviour: "smooth" });
        }
    }, [chat]);

    const handleOptionsToggle = () => {
        setOpen((prevOpen) => !prevOpen);
        console.log("Options popper is toggling now!")
        console.log("value after toggle: " + prevOpen)
    };

    const handleOptionsClose = () => {
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
          event.preventDefault();
          setOpen(false);
        }
    }

    const handleOpenDelete = () => {
        setOpenDelete(true)
    }
    
    const handleCloseDelete = () => {
        setOpenDelete(false)
    }

    const handleDeleteChat = () => {
        setOpen(false)
        setOpenDelete(false)
        deleteChat({variables: {id: chat.id}})
    }

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        if (message !== "") {
            addMessage({variables: {user: user.id, chat: chat.id, text: message}})
        }
        setMessage("")
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            handleSubmit()
        }
    }

    return (
        <div>
            <Card className={classes.root}>
                <CardHeader 
                avatar={chat && <Avatar src={chat.users.filter(u => u.id !== user.id)[0].avatarPath}>{chat.users.filter(u => u.id !== user.id)[0].name.givenName[0]}</Avatar>}
                title={chat && displayName(chat.users.filter(u => u.id !== user.id)[0])}
                subheader={"Online status"}
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
                                    <ListItem button onClick={handleOpenDelete}>
                                        <ListItemText>Delete Chat</ListItemText>
                                    </ListItem>
                                </MenuList>
                                </ClickAwayListener>
                            </Paper>
                            </Grow>
                        )}
                        </Popper>
                    </div>
                }/>
                <CardContent className={classes.messages}>
                    {chat && chat.messages.length===0 ? <Typography align="center">Send the first message!</Typography> :
                    <div>
                        {chat && chat.messages.map(message => (
                            <Grid container justify={message.user.id===user.id ? "flex-end" : "flex-start"}>
                                <Grid item className={classes.message}>
                                    <Paper className={message.user.id===user.id ? classes.ownMessage : classes.otherMessage} ref={scrollRef}>
                                        <ListItemText primary={message.text} />
                                        <ListItemText secondary={convertTime(message.date).slice(0, -3)} align="right"/>
                                    </Paper>
                                </Grid>
                            </Grid>
                        ))}
                    </div>
                }
                </CardContent>
            </Card>
            <Grid container className={classes.input}>
                <Grid item xs={11}>
                    <TextField label="Write a message..." fullWidth onChange={handleChange} value={message} onKeyDown={handleKeyDown}/>
                </Grid>
                <Grid xs={1} align="right">
                    {message!== "" && <IconButton>
                        <SendIcon color="secondary"/>
                    </IconButton>}
                </Grid>
            </Grid>
            <Dialog open={openDelete} onClose={handleCloseDelete}>
                <DialogTitle>
                    Are you sure you want to delete the chat? 
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The chat will be deleted for other users as well.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteChat} color="primary">
                        Delete chat
                    </Button>
                    <Button onClick={handleCloseDelete} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Chat
