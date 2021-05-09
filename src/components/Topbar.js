import {IconButton, AppBar, Box, CssBaseline, Toolbar, Grid, TextField} from '@material-ui/core';
import React from 'react'
import MenuIcon from '@material-ui/icons/Menu';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
  }));

const TopBar = () => {
    const classes = useStyles();

    return (
        <div>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <Grid container spacing={1} alignItems="flex-end" justify="flex-start">
                        <IconButton>
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
        </div>
    )
}

export default TopBar
