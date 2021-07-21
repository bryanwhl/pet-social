import React from 'react';
import { useState } from 'react';
import { IconButton, AppBar, Toolbar, Grid, Badge, Popper, Grow,
    Paper, MenuList, ClickAwayListener, ListItem, ListItemIcon, ListItemText, Avatar, Typography, Divider, Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChatIcon from '@material-ui/icons/Chat';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import SideBar from './SideBar';
import RightNotificationBar from './RightNotificationBar';
import RightChatBar from './RightChatBar';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { displayName } from '../../utility.js';
import { useHistory } from "react-router-dom";
import SearchBar from './SearchBar.js';

// image file path for Pet Social logo
const LOGO_PATH = "http://localhost:4000/images/pet-social-logo.jpg"

// for root AppBar component use
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 2,
    },
    avatar: {
        backgroundColor: red[500],
    },
    rightPopper: {
        zIndex: theme.zIndex.drawer + 1,
        width: '200px',
    },
    customizeToolbar: {
        height: "4vh"
    },
    searchBarRoot: {
      padding: '2px 12px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      fontSize:17,
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    resize:{
      fontSize:50
    },
}));

// constructor function for TopBar
const TopBar = ({ logout, user, client, getCurrentUser }) => {

    // const for all components
    const classes = useStyles();
    let history = useHistory();

    // data set up for notifications
    const [numNotifications, setNumNotifications] = useState(0);
    
    //data set up for chats
    const [numChats, setNumChats] = useState(0);

    // state changes from clicking buttons
    const switchToProfile = () => {
        history.push('/myprofile')
    }

    const switchToHome = () => {
        history.push('/home')
    }

    const switchToSettings = () => {
        history.push('/settings')
        closeLeftDrawer()
    }

    // top right profile menu drop bar options
    const profileItems = [
        {
            text: "Profile",
            icon: <PersonOutlineIcon />,
            path: "/",
            onClick: switchToProfile
        },
        {
            text: "Settings",
            icon: <SettingsIcon />,
            path: "/",
            onClick: switchToSettings
        },
        {
            text: "Sign Out",
            icon: <ExitToAppIcon />,
            path: "/",
            onClick: logout
        }
    ]

    // handles opening profile menu
    const [profileOpen, setProfileOpen] = useState(false);
    const [anchorProfileRef, setAnchorProfileRef] = useState(null);

    const handleProfilePopper = (event) => {
        setAnchorProfileRef(event.currentTarget)
        setProfileOpen(!profileOpen);
    }

    const handleProfileClose = (event) => {
        if (anchorProfileRef.current && anchorProfileRef.current.contains(event.target)) {
            return;
        }
      
        setProfileOpen(false);
    }

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setProfileOpen(false);
        }
    }

    // handles opening and closing of left drawer
    const [leftDrawerState, setLeftDrawerState] = useState(false);

    const toggleLeftDrawer = () => {
        console.log('Side menu ', leftDrawerState ? 'closed' : 'opened');
        setLeftDrawerState(!leftDrawerState);
    }

    const closeLeftDrawer = () => {
        console.log('Side menu closed');
        setLeftDrawerState(false);
    }

    // handles opening and closing of right drawer
    const [rightDrawerState, setRightDrawerState] = useState('notification');

    const handleRightDrawerNotification = () => {
        if (rightDrawerState === 'closed' || rightDrawerState === 'chat') {
            setRightDrawerState('notification');
        } else {
            setRightDrawerState('closed');
        }
    }

    const handleRightDrawerChat = () => {
        if (rightDrawerState === 'closed' || rightDrawerState === 'notification') {
            setRightDrawerState('chat');
        } else {
            setRightDrawerState('closed');
        }
    }

    return (
        <div className={classes.root}>
            <AppBar elevation="0" variant="outlined" className={classes.appBar}>
                <Toolbar className={classes.customizeToolbar}>
                    <Grid container spacing={3} alignItems="center" justify="flex-start" wrap="nowrap">
                        <IconButton onClick={toggleLeftDrawer}>
                            <MenuIcon />
                        </IconButton>
                        <Grid item alignItems="center">
                          <SearchBar />
                        </Grid>
                    </Grid>
                    <Hidden smDown>
                        <Grid container alignItems="center" justify="center" xs={0} md={0}>
                            <Grid item>
                                <img src={LOGO_PATH} alt="Pet Social" width="190" height="60" onClick={switchToHome} style={{cursor: "pointer"}} />
                            </Grid>
                        </Grid>
                    </Hidden>
                    <Grid container spacing={1} alignItems="center" justify="flex-end" wrap="nowrap">
                        <IconButton onClick={handleRightDrawerChat}>
                            <Badge badgeContent={numChats} color="secondary">
                                <ChatIcon />
                            </Badge>
                        </IconButton>
                        <IconButton onClick={handleRightDrawerNotification}>
                            <Badge badgeContent={numNotifications} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton ref={anchorProfileRef} onClick={handleProfilePopper}>
                            <AccountCircleIcon />
                        </IconButton>
                        <Popper className={classes.rightPopper} open={profileOpen} anchorEl={anchorProfileRef} placement={'bottom-end'} transition>
                            {({ TransitionProps }) => (
                            <Grow {...TransitionProps}>
                                <Paper>
                                    <ClickAwayListener onClickAway={handleProfileClose}>
                                        <MenuList autoFocusItem={profileOpen} id="profile-list-grow" onKeyDown={handleListKeyDown}>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Avatar alt="Avatar" src={user.avatarPath} />
                                                </ListItemIcon>
                                                <Typography>{displayName(user)}</Typography>
                                            </ListItem>
                                            <Divider />
                                            {profileItems.map(item => (
                                                <ListItem
                                                    button
                                                    key={item.text}
                                                    onClick={item.onClick}
                                                >
                                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                                    <ListItemText primary={item.text}></ListItemText>
                                                </ListItem>
                                            ))}
                                        </MenuList>
                                        </ClickAwayListener>
                                </Paper>
                            </Grow>
                            )}
                        </Popper>
                    </Grid>
                </Toolbar>
            </AppBar>
            <SideBar position="relative" drawerState={leftDrawerState} closeLeftDrawer={closeLeftDrawer} setRightDrawerState={setRightDrawerState} accountType={user.accountType} />
            <RightNotificationBar drawerState={rightDrawerState === 'notification'} user={user} setNumNotifications={setNumNotifications} client={client} getCurrentUser={getCurrentUser} />
            <RightChatBar drawerState={rightDrawerState === 'chat'} user={user} setNumChats={setNumChats} client={client} />
        </div>
    )
}

export default TopBar
