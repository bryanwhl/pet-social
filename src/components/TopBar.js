import { useState } from 'react';
import {IconButton, AppBar, Toolbar, Grid, TextField} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import SideBar from './SideBar';

const TopBar = () => {

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
            <AppBar position="relative">
                <Toolbar>
                    <Grid container spacing={1} alignItems="flex-end" justify="flex-start">
                        <IconButton onClick={openDrawer}>
                            <MenuIcon />
                        </IconButton>
                    </Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item alignItems="flex-end">
                            <SearchIcon />
                        </Grid>
                        <Grid item>
                            <TextField id="input-with-icon-grid" placeholder="Search" />
                        </Grid>
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
