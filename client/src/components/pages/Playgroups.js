import React from 'react'
import { makeStyles, ListItemSecondaryAction, FormControl, ListSubheader, Button, Snackbar, IconButton, Divider, List, ListItem, ListItemText, Drawer, Toolbar, ListItemIcon } from '@material-ui/core';
import { GoogleMap, useLoadScript, InfoWindow, Marker } from "@react-google-maps/api";
import { v4 as uuidv4 } from 'uuid';
import "@reach/combobox/styles.css";
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import AddIcon from '@material-ui/icons/Add';
import ToggleButton from '@material-ui/lab/ToggleButton';
import PlaygroupForm from './PlaygroupForm.js';
import PlaygroupInfo from './PlaygroupInfo.js';
import Geocode from "react-geocode";
import { useQuery } from '@apollo/client';
import { getPlaygroupsQuery } from '../../queries.js';
import { useState, useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';

Geocode.setApiKey(process.env.REACT_APP_KEY);

const drawerWidth = 300;

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      marginLeft: 70,
    },
    mapContainerStyle: {
      width: "100vw",
      height: "94vh"
    },
    drawerContainer: {
        overflow: 'auto',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      zIndex: theme.zIndex.drawer - 3,
    },
    drawerPaper: {
      width: drawerWidth,
      marginTop: -4,
    },
    searchBarRoot: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    icon: {
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(2),
    },
    nested: {
      paddingLeft: theme.spacing(5),
      '& span, & svg': {
        fontSize: '0.82rem'
      }
    },
}));

const center = {
    lat: 1.3314930427408092,
    lng: 103.80778265368694
}

const mapStyle = {
    width: "100%",
    height: "100vh",
}

const generateNewID = () => {
    const newID = uuidv4();
    return newID;
}

const libraries = ["places"];

const Playgroups = ({ user }) => {

    const classes = useStyles();

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_KEY,
        libraries,
    })

    const [allPlaygroups, setAllPlaygroups] = useState([]);
    const [tempMarker, setTempMarker] = React.useState(null);
    const [selected, setSelected] = React.useState(null);
    const [newPlaygroup, setNewPlaygroup] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(true);
    const playgroups = useQuery(getPlaygroupsQuery);

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpenSnackbar(false);
    };

    useEffect(() => {
      if (playgroups.data) {
        console.log(playgroups.data)
        setAllPlaygroups(playgroups.data.getPlaygroup)
      }
      setSelected(null);
      setTempMarker(null);
      setNewPlaygroup(false);
    }, [playgroups])

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
      mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }, []);
  
    const handleNewPlaygroup = () => {
      setNewPlaygroup(!newPlaygroup);
    }

    const handleStopNewPlaygroup = () => {
      setNewPlaygroup(false);
    }

    // code for state of side bar
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
      setOpen(!open);
    };

    const onMapClick = React.useCallback((e) => {
        setTempMarker({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                id: generateNewID(),
        });
        handleStopNewPlaygroup();
        setSelected({
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        })
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        'https://maps.googleapis.com/maps/api/js?key=' + process.env.REACT_APP_KEY + '&libraries=places',
        document.querySelector('head'),
        'google-maps',
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps...";

    return (
        <div>
            <div className={classes.root}>
            <Drawer
              className={classes.drawer}
              variant="permanent"
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <Toolbar />
              <div className={classes.drawerContainer}>
                <List>
                  <ListItem button onClick={handleClick}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add a Playgroup" />
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItem className={classes.nested}>
                        <ListItemText primary="Click this marker and select your desired Playgroup location:" />
                          
                          <ToggleButton edge="end" selected={newPlaygroup} onClick={handleNewPlaygroup}>
                            
                            <LocationOnIcon color="secondary"/>
                          </ToggleButton>
                      </ListItem>
                    </List>
                  </Collapse>
                </List>
                <Divider />
                <List>
                  <ListItem>
                  <Autocomplete
                    id="google-map-demo"
                    style={{ width: 280 }}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
                    filterOptions={(x) => x}
                    options={options}
                    autoComplete
                    includeInputInList
                    filterSelectedOptions
                    value={value}
                    onChange={(event, newValue) => {
                      setOptions(newValue ? [newValue, ...options] : options);
                      setValue(newValue);
                      if (newValue === null) {
                        return;
                      }
                      Geocode.fromAddress(newValue.description).then(
                        (response) => {
                          const { lat, lng } = response.results[0].geometry.location;
                          panTo({lat: lat, lng: lng});
                          console.log(lat);
                          console.log(lng);
                        },
                        (error) => {
                          console.error(error);
                        }
                      );
                    }}
                    onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue);
                    }}
                    popupIcon={<LocationSearchingIcon />}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Map" variant="outlined" fullWidth />
                    )}
                    renderOption={(option) => {
                      const matches = option.structured_formatting.main_text_matched_substrings;
                      const parts = parse(
                        option.structured_formatting.main_text,
                        matches.map((match) => [match.offset, match.offset + match.length]),
                      );

                      return (
                        <Grid container alignItems="center">
                          <Grid item>
                            <LocationOnIcon className={classes.icon} />
                          </Grid>
                          <Grid item xs>
                            {parts.map((part, index) => (
                              <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                {part.text}
                              </span>
                            ))}

                            <Typography variant="body2" color="textSecondary">
                              {option.structured_formatting.secondary_text}
                            </Typography>
                          </Grid>
                        </Grid>
                      );
                    }}
                  />
                  </ListItem>
                  </List>
              </div>
            </Drawer>
            </div>
            <GoogleMap
                mapContainerStyle={mapStyle}
                zoom={12}
                center={center}
                onClick={newPlaygroup ? onMapClick : () => {}}
                onLoad={onMapLoad}
                clickableIcons={false}
            >
                {allPlaygroups.map(playgroup =>
                    <Marker 
                        key={playgroup.id} 
                        position={{
                            lat: playgroup.meetingLat,
                            lng: playgroup.meetingLng
                        }}
                        onClick={() => {
                            setSelected({
                              lat: playgroup.meetingLat, 
                              lng: playgroup.meetingLng, 
                              name: playgroup.name, 
                              description: playgroup.description, 
                              date: playgroup.meetingDate, 
                              user: playgroup.playgroupAdmin.username, 
                              id: playgroup.id,
                              userID: playgroup.playgroupAdmin.id,
                              members: playgroup.members
                            });
                        }}
                    />
                )}

                {selected ? (<InfoWindow position={{lat: selected.lat, lng: selected.lng}} 
                onCloseClick={() => {
                    setSelected(null);
                }}>
                    <div>
                      {tempMarker !== null && selected.lat === tempMarker.lat && selected.lng === tempMarker.lng ? 
                      <PlaygroupForm 
                        user={user} 
                        meetingLocation={[selected.lat, selected.lng]}/> : 
                      <PlaygroupInfo 
                      playgroup={{
                        lat: selected.lat, 
                        lng: selected.lng, 
                        name: selected.name, 
                        description: selected.description, 
                        date: selected.date,
                        user: selected.user,
                        id: selected.id,
                        userID: selected.userID,
                        members: selected.members
                      }}
                      user={user}
                      /> }
                    </div>
                </InfoWindow>) : null}
            </GoogleMap>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={openSnackbar}
              autoHideDuration={4000}
              onClose={handleClose}
              message="Please refresh if the map is not loading!"
              action={
                <React.Fragment>
                  <IconButton size="small" aria-label="close" color="secondary" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              }
            />
        </div>
    );
}

export default Playgroups
