import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import GoogleMapReact from 'google-map-react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        zIndex: theme.zIndex.drawer + 10,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

const Playgroups = () => {
    const classes = useStyles();
    console.log(process.env.REACT_APP_KEY);

    return (
        <div style={{ height: '94vh', width: '100%' }}>
        <Grid container alignItems="center" justify="flex-start">
            <Grid item>
                <Paper component="form" className={classes.root}>
                    <IconButton className={classes.iconButton} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <InputBase
                        className={classes.input}
                        placeholder="Search Google Maps"
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <Divider className={classes.divider} orientation="vertical" />
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions">
                        <DirectionsIcon />
                    </IconButton>
                </Paper>
            </Grid>
        </Grid>
        <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_KEY }}
            defaultCenter={{
                lat: 1.3314930427408092,
                lng: 103.80778265368694
            }}
            defaultZoom={12}
        >
        </GoogleMapReact>
        </div>
    );
}

export default Playgroups
