import { Drawer, Divider } from '@material-ui/core';
import { MenuList, Avatar, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import Post from '../posts/Post.js'
import { blue } from '@material-ui/core/colors';
import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/client'
import { getChatsQuery } from '../../queries.js';
import { POST_LIKED, POST_COMMENT, COMMENT_LIKED, FRIEND_REQUEST, FRIEND_REQUEST_INTERACT, DELETE_FRIEND, DELETE_NOTIF } from '../../subscriptions.js';
import { displayName, convertTime } from '../../utility.js'
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import * as timeago from 'timeago.js';

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
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
    backgroundColor: green[200],
  },
}));

const handleChatClick = () => {
    console.log('Navigate to home')
}

const RightChatBar = ({ drawerState, user, setNumChats, client }) => {

    const classes = useStyles();

    const allChats = useQuery(getChatsQuery, {variables: {id: user.id}})
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (allChats.data) {
          let outputArr = allChats.data.getChats.slice().sort((a, b) => {return b.date - a.date}); 
          setChats(outputArr);
          setNumChats(outputArr.length);
        }
      }, [allChats])

    const handleAddChat = () => {
        console.log("Add chat")
    }

    const notifications = [
        {
            text:"",
            icon: <Avatar aria-label="bryan" className={classes.avatar}>
                B
            </Avatar>,
            path:"/",
            time:""
        },
        {
            text: "You have received (2) new messages from Charmaine Lee",
            icon: <Avatar aria-label="Charmaine" className={classes.avatar}>
                    C
                </Avatar>,
            path: "/",
        },
    ]
    

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
                <Divider />
                <Divider />
                <Divider />
                <Divider />
                <MenuList id="menu-list-grow">
                    <ListItem button onClick={handleAddChat}>
                        <ListItemIcon><AddIcon/></ListItemIcon>
                        <ListItemText primary={"Create chat"} />
                    </ListItem>
                <div className={classes.drawerContainer}>
                    {chats.map(item => (
                        <ListItem
                            button
                            onClick={handleChatClick}
                        >
                            <ListItemIcon>
                                <Avatar alt="Avatar" src={item.users[0].avatarPath} className={classes.avatar}>
                                    {item.users[0].name.givenName[0]}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={displayName(item.users[0])} secondary={convertTime(item.date)}></ListItemText>
                        </ListItem>
                    ))}
                </div>
                <ListItem>
                    <ListItemText primary={String(chats)===String([]) && "You have no chats"}></ListItemText>
                </ListItem>
                </MenuList>
            </Drawer>
        </div>
    )
}

export default RightChatBar
