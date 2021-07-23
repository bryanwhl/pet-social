import { Drawer, IconButton } from '@material-ui/core';
import { MenuList, Avatar, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/client'
import { getChatsQuery, addChatQuery } from '../../queries.js';
import { CREATE_CHAT, DELETE_CHAT, SEND_MESSAGE, DELETE_MESSAGE } from '../../subscriptions.js';
import { displayName, convertTime } from '../../utility.js'
import Chat from './Chat.js'
import SearchBar from './SearchBar.js'
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import * as timeago from 'timeago.js';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  root: {
      display: 'flex',
  },
  drawerContainer: {
      overflow: 'auto'
  },
  avatar: {
    backgroundColor: green[200],
  },
}));

const RightChatBar = ({ drawerState, user, setNumChats, client }) => {

    const classes = useStyles();

    const allChats = useQuery(getChatsQuery, {variables: {id: user.id}})
    const [createChat] = useMutation(addChatQuery, {refetchQueries: {query: getChatsQuery, variables: {id: user.id}}})
    const [chats, setChats] = useState([]);
    const [name, setName] = useState("")
    const [addChat, setAddChat] = useState(false)
    const [addChatFriends, setAddChatFriends] = useState([])
    const [openChat, setOpenChat] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (allChats.data) {
          let outputArr = allChats.data.getChats.slice().sort((a, b) => {return b.date - a.date}); 
          setChats(outputArr);
          setNumChats(outputArr.length);
        }
    }, [allChats])

    const updateCacheWith = (addedChat) => {
        const includedIn = (set, object) => 
          set.map(p => p.id).includes(object.id)  
    
        const dataInStore = client.readQuery({ query: getChatsQuery, variables: {id: user.id} })
        if (!includedIn(dataInStore.getChats, addedChat)) {
          client.writeQuery({
            query: getChatsQuery,
            data: { getChats : dataInStore.getChats.concat(addedChat) },
            variables: {id: user.id}
          })
        }   
    }
    const updateMessageCacheWith = (addedChat) => {
        const includedIn = (set, object) => 
          set.map(p => p.id).includes(object.id)  
    
        const dataInStore = client.readQuery({ query: getChatsQuery, variables: {id: user.id} })
        if (!includedIn(dataInStore.getChats, addedChat)) {
          client.writeQuery({
            query: getChatsQuery,
            data: { getChats : dataInStore.getChats.filter(chat => chat.id !== addedChat.id).concat(addedChat) },
            variables: {id: user.id}
          })
        }   
    }

    const removeCacheWith = (removedChat) => {
        const includedIn = (set, object) => 
          set.map(p => p.id).includes(object.id)  
    
        const dataInStore = client.readQuery({ query: getChatsQuery, variables: {id: user.id} })
        if (includedIn(dataInStore.getChats, removedChat)) {
          client.writeQuery({
            query: getChatsQuery,
            data: { getChats : dataInStore.getChats.filter(chat => chat.id !== removedChat.id) },
            variables: {id: user.id}
          })
        }   
    }

    useSubscription(CREATE_CHAT, {
        variables: {id: user.id},
        onSubscriptionData: ({ subscriptionData }) => {
          updateCacheWith(subscriptionData.data.createChat)
        }
    })

    useSubscription(DELETE_CHAT, {
        variables: {id: user.id},
        onSubscriptionData: ({ subscriptionData }) => {
          removeCacheWith(subscriptionData.data.deleteChat)
          setOpenChat(false)
        }
    })

    useSubscription(SEND_MESSAGE, {
        variables: {id: user.id},
        onSubscriptionData: ({ subscriptionData }) => {
          updateMessageCacheWith(subscriptionData.data.sendMessage)
        }
    })

    useSubscription(DELETE_MESSAGE, {
        variables: {id: user.id},
        onSubscriptionData: ({ subscriptionData }) => {
          updateMessageCacheWith(subscriptionData.data.deleteMessage)
        }
    })

    const handleAddChatOpen = () => {
        setAddChat(true)
    }

    const handleAddChatClose = () => {
        setAddChatFriends([])
        setAddChat(false)
        setError(null)
    }

    const handleCreateChat = () => {

        if (addChatFriends.length===1 && user.chats.length!==0) {
            var userArray = user.chats.filter(chat => chat.users.length === 2)
            userArray = userArray.map(chat => chat.users)[0]
            for (let i = 0; i < userArray.length; i++) {
                if (userArray[i].id === addChatFriends[0].id) {
                    setError("Chat already exists with User")
                    return
                }
            }
        } else {

        }
        setAddChat(false)
        setError(null)
        createChat({variables: {users: addChatFriends.concat(user).map(person => person.id), name: name}})
        setAddChatFriends([])
    }

    const addChatFriend = (user) => {
        if (addChatFriends.map(friend => friend.id).includes(user.id)) {
            setError("User already in list")
        } else if (addChatFriends.length === 1) { //Remove for group chats
            setError("Group chats coming soon!")
        }else {
            setAddChatFriends(addChatFriends.concat(user))
            setError(null)
        }
    }

    const removeChatFriend = (user) => {
        setAddChatFriends(addChatFriends.filter(friend => friend.id !== user.id))
        setError(null)
    }

    const handleChatClick = (chat) => {
        setOpenChat(chat.id)
    }

    const handleChatClose = () => {
        setOpenChat(false)
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
                <div className={classes.toolbar} />
                <MenuList id="menu-list-grow" disablePadding>
                <div className={classes.drawerContainer}>
                    <ListItem button onClick={handleAddChatOpen}>
                        <ListItemIcon><AddIcon/></ListItemIcon>
                        <ListItemText primary={"Create chat"}/>
                    </ListItem>
                    {chats.map(item => (
                        <ListItem
                            button
                            onClick={()=>handleChatClick(item)}
                        >
                            <ListItemIcon>
                                <Avatar alt="Avatar" src={item.users.filter(u => u.id !== user.id)[0].avatarPath} className={classes.avatar}>
                                    {item.users.filter(u => u.id !== user.id)[0].name.givenName[0]}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body1"
                                    className={classes.inline}
                                    color="textPrimary"
                                >
                                {displayName(item.users.filter(u => u.id !== user.id)[0])}
                                </Typography>
                                {item.messages.length!==0 && <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textSecondary"
                                >
                                {' - ' + convertTime(item.messages[item.messages.length-1].date).slice(0, -3)}
                                </Typography>}
                            </React.Fragment>} 
                            secondary={item.messages.length===0 ? "No messages" : ((item.messages[item.messages.length-1].user.id===user.id ? "You" : item.messages[item.messages.length-1].user.name.givenName) + ": " + item.messages[item.messages.length-1].text)}></ListItemText>
                        </ListItem>
                    ))}
                </div>
                <ListItem>
                    <ListItemText primary={String(chats)===String([]) && "You have no chats"}></ListItemText>
                </ListItem>
                </MenuList>
            </Drawer>
            <Dialog onClose={handleAddChatClose} open={addChat}>
                <DialogTitle>Create Chat</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Please search for friends you wish to create a chat with
                </DialogContentText>
                <SearchBar user={user} type={"Chat"} addChatFriend={addChatFriend}/>
                <List>
                    {addChatFriends.map(item => (
                        <ListItem>
                            <ListItemIcon>
                                <Avatar alt="Avatar" src={item.avatarPath} className={classes.avatar}>
                                    {item.name.givenName[0]}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={displayName(item)}></ListItemText>
                            <ListItemSecondaryAction>
                                <IconButton onClick={()=>removeChatFriend(item)}>
                                    <ClearIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                {error && <DialogContentText>{error}</DialogContentText>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateChat} color="primary" disabled={String(addChatFriends)===String([])}>
                        Create chat
                    </Button>
                    <Button onClick={handleAddChatClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openChat} onClose={handleChatClose} scroll={"body"} fullWidth PaperProps={{
                style: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
                maxWidth: "75vmin"
                },
            }}>
                {openChat && <Chat user={user} chatId={openChat} client={client}/>}
            </Dialog>
        </div>
    )
}

export default RightChatBar
