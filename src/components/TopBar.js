import React from 'react';
import { useState } from 'react';
import {IconButton, AppBar, Toolbar, Grid, TextField, Popper, Grow,
    Paper, MenuList, ClickAwayListener, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import SideBar from './SideBar';
import { makeStyles } from '@material-ui/core/styles';
import logo from "./static/images/pet-social-logo.jpg";

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
      },
}));

const TopBar = ({ logout, user, appState, setAppState }) => {

    const switchToProfile = () => {
        setAppState("Profile")
      }

    const switchToHome = () => {
        setAppState("Home")
    }

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
            onClick: console.log("Go to account settings")
        },
        {
            text: "Sign Out",
            icon: <ExitToAppIcon />,
            path: "/",
            onClick: logout
        }
    ]

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

    const classes = useStyles();

    const [drawerState, setDrawerState] = useState(false);

    const toggleDrawer = () => {
        console.log('Side menu ', drawerState ? 'closed' : 'opened');
        setDrawerState(!drawerState);
    }

    const closeDrawer = () => {
        console.log('Side menu closed');
        setDrawerState(false);
    }

    return (
        <div>
            <AppBar position="relative" className={classes.appBar}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center" justify="flex-start">
                        <IconButton onClick={toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                        <Grid item alignItems="center">
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </Grid>
                        <Grid item alignItems="center">
                            <TextField id="input-with-icon-grid" placeholder="Search" />
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" justify="center">
                        <Grid item>
                            <img src={logo} alt="Pet Social" width="190" height="60" onClick={switchToHome} style={{cursor: "pointer"}} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} alignItems="center" justify="flex-end">
                        <IconButton>
                            <ChatIcon />
                        </IconButton>
                        <IconButton>
                            <NotificationsIcon />
                        </IconButton>
                        <IconButton ref={anchorProfileRef} onClick={handleProfilePopper}>
                            <AccountCircleIcon />
                        </IconButton>
                        <Popper open={profileOpen} anchorEl={anchorProfileRef} placement={'bottom-end'} transition>
                            {({ TransitionProps }) => (
                            <Grow {...TransitionProps}>
                                <Paper>
                                    <ClickAwayListener onClickAway={handleProfileClose}>
                                        <MenuList autoFocusItem={profileOpen} id="profile-list-grow" onKeyDown={handleListKeyDown}>
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
            <SideBar position="relative" drawerState={drawerState} closeDrawer={closeDrawer} accountType={user.accountType} appState={appState} setAppState={setAppState} />
        </div>
    )
}

export default TopBar
