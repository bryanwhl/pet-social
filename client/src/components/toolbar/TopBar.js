import React from 'react';
import { useState } from 'react';
import { IconButton, AppBar, Toolbar, Grid, TextField, Badge, Popper, Grow,
    Paper, MenuList, ClickAwayListener, ListItem, ListItemIcon, ListItemText, Avatar, InputBase, Typography, Divider, Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChatIcon from '@material-ui/icons/Chat';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import SideBar from './SideBar';
import RightNotificationBar from './RightNotificationBar';
import RightChatBar from './RightChatBar';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { displayName } from '../../utility.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { allUsernameQuery } from '../../queries.js';
import { useQuery } from '@apollo/client';
import {
  Link,
} from "react-router-dom";
import { useHistory } from "react-router-dom";

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
// appState helps navigate the app, and goes one level deeper for SideBar to change the app state
const TopBar = ({ logout, user, appState, setAppState, client, getCurrentUser }) => {

    // const for all components
    const classes = useStyles();

    // data set up for notifications
    const [numNotifications, setNumNotifications] = useState(0);
    const notifications = [
        {
        text: "Bryan Wong liked your post.",
        icon: <Avatar aria-label="bryan" className={classes.avatar}>
                B
                </Avatar>,
        path: "/",
        time: "45 minutes ago"
        },
        {
        text: "Benedict Tan has commented on your post.",
        icon: <Avatar aria-label="bryan" className={classes.avatar}>
                B
                </Avatar>,
        path: "/",
        time: "53 minutes ago"
        },
        {
        text: "Brendan Lim has shared your post.",
        icon: <Avatar aria-label="bryan" className={classes.avatar}>
                B
                </Avatar>,
        path: "/",
        time: "an hour ago"
        }
    ]    

    // state changes from clicking buttons
    const switchToProfile = () => {
        setAppState("Profile")
    }

    const switchToHome = () => {
        setAppState("Home")
    }

    const switchToSettings = () => {
        setAppState("Settings")
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
    const [searchText, setSearchText] = useState("");
    const allUsers = useQuery(allUsernameQuery);

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

    const handleSearchChange = (event, value) => {
      console.log(value)
      setSearchText(value.username);
    };

    const handleSubmitSearch = () => {
      if (searchText[0] === '@') {
        const resultString = searchText.slice(1);
        setSearchText(resultString)
      } else {
        setSearchText(searchText)
      }
      console.log(searchText);
      return "/profile?username=" + searchText;
    }

    return (
        <div className={classes.root}>
            <AppBar elevation="0" variant="outlined" className={classes.appBar}>
                <Toolbar className={classes.customizeToolbar}>
                    <Grid container spacing={3} alignItems="center" justify="flex-start" wrap="nowrap">
                        <IconButton onClick={toggleLeftDrawer}>
                            <MenuIcon />
                        </IconButton>
                        {/* <Grid item alignItems="center">
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </Grid> */}
                        <Grid item alignItems="center">
                          
                          {/* <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            options={allUsers.map((option) => option.name)}
                            style={{ width: 100 }}
                            renderInput={(params) => (
                              <TextField {...params} label="freeSolo" size="small" margin="normal" height="40px" color="secondary" variant="outlined" className={classes.searchBarRoot}/>
                            )}
                          /> */}
                          <Autocomplete
                            id="custom-input-demo"
                            freeSolo
                            options={allUsers.data === undefined ? null : allUsers.data.allUsers}
                            getOptionLabel={(option) => '@' + option.username}
                            onChange={handleSearchChange}
                            renderInput={(params) => (
                              <div ref={params.InputProps.ref}>
                                <Paper component="form" className={classes.searchBarRoot}>
                                  <InputBase
                                    className={classes.input}
                                    placeholder="Search Users"
                                    inputProps={{ 'aria-label': 'search pet social' }}
                                    {...params.inputProps}
                                  />
                                  <IconButton component={Link} to={handleSubmitSearch} className={classes.iconButton} aria-label="search">
                                    <SearchIcon />
                                  </IconButton>
                                </Paper>
                              </div>
                            )}
                          />
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
                            <Badge badgeContent={1} color="secondary">
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
            <SideBar position="relative" drawerState={leftDrawerState} closeLeftDrawer={closeLeftDrawer} setRightDrawerState={setRightDrawerState} accountType={user.accountType} appState={appState} setAppState={setAppState} />
            <RightNotificationBar drawerState={rightDrawerState === 'notification'} user={user} setNumNotifications={setNumNotifications} client={client} getCurrentUser={getCurrentUser} />
            <RightChatBar drawerState={rightDrawerState === 'chat'} user={user} />
        </div>
    )
}

export default TopBar
