import { useState } from 'react';
import {IconButton, AppBar, Toolbar, Grid, TextField} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import SideBar from './SideBar';
import { makeStyles } from '@material-ui/core/styles';
import logo from "./static/images/pet-social-logo.jpg";

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
      },
}));

const TopBar = () => {

    const classes = useStyles();

    const [drawerState, setDrawerState] = useState(false);

    const openDrawer = () => {
        console.log('Side menu opened');
        setDrawerState(true);
    }

    const closeDrawer = () => {
        console.log('Side menu closed');
        setDrawerState(false);
    }

    return (
        <div>
            <AppBar position="relative" className={classes.appBar}>
                <Toolbar>
                    
                    <Grid container spacing={1} alignItems="flex-end" justify="flex-start">
                        <IconButton onClick={openDrawer}>
                            <MenuIcon />
                        </IconButton>
                        <Grid item alignItems="flex-end">
                            <SearchIcon />
                        </Grid>
                        <Grid item>
                            <TextField id="input-with-icon-grid" placeholder="Search" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <img src={logo} alt="Pet Social" width="190" height="60" />
                    </Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="flex-end">
                        <IconButton>
                            <ChatIcon />
                        </IconButton>
                        <IconButton>
                            <NotificationsIcon />
                        </IconButton>
                        <IconButton>
                            <AccountCircleIcon />
                        </IconButton>
                    </Grid>
                </Toolbar>
            </AppBar>
            <SideBar position="relative" drawerState={drawerState} closeDrawer={closeDrawer}/>
        </div>
    )
}

export default TopBar
