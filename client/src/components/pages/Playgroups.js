import React from 'react'
import { makeStyles, ListItemSecondaryAction, FormControl, ListSubheader, Button, Divider, List, ListItem, ListItemText, Drawer, Toolbar, Paper, IconButton, ListItemIcon } from '@material-ui/core';
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

const drawerWidth = 320;

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
      paddingLeft: theme.spacing(4),
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
    width: "100vw",
    height: "100vh",
}

const generateNewID = () => {
    const newID = uuidv4();
    return newID;
}

const libraries = ["places"];

const Playgroups = () => {

    const classes = useStyles();

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_KEY,
        libraries,
    })

    const [markers, setMarkers] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [newPlaygroup, setNewPlaygroup] = React.useState(false);
  
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
        setMarkers((current) => [
            ...current,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                id: generateNewID(),
            },
        ]);
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

    const mapRef = React.useRef();

    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, [])

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
                        <ListItemText primary="Click this marker and select the desired location for your Playgroup:" />
                        <ListItemSecondaryAction>
                          <ToggleButton edge="end" selected={newPlaygroup} onClick={handleNewPlaygroup}>
                            <LocationOnIcon color="secondary"/>
                          </ToggleButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Collapse>
                </List>
                <Divider />
                <List>
                  <ListItem>
                  <Autocomplete
                    id="google-map-demo"
                    style={{ width: 300 }}
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
                      console.log(event);
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
            {/* <Locate panTo={panTo} />
            <Search panTo={panTo} /> */}
            <GoogleMap
                mapContainerStyle={mapStyle}
                zoom={12}
                center={center}
                onClick={newPlaygroup ? onMapClick : () => {}}
                onLoad={onMapLoad}
                clickableIcons={false}
            >
                {markers.map(marker =>
                    <Marker 
                        key={marker.id} 
                        position={{
                            lat: marker.lat,
                            lng: marker.lng
                        }}
                        onClick={() => {
                            setSelected(marker);
                        }}
                    />
                )}

                {selected ? (<InfoWindow position={{lat: selected.lat, lng:selected.lng}} 
                onCloseClick={() => {
                    setSelected(null);
                }}>
                    <div>
                        <FormControl>
                            <List subheader={
                              <ListSubheader component="div" id="nested-list-subheader">
                                Create a Playgroup!
                              </ListSubheader>
                            }>
                                <ListItem>
                                    <TextField id="name-of-playgroup" label="Name Of Playgroup" variant="outlined" />
                                </ListItem>
                                <ListItem>
                                    <TextField id="date-of-meeting" label="Date Of Meeting" variant="outlined" />
                                </ListItem>
                                <ListItem>
                                    <TextField id="details" label="Details" variant="outlined" />
                                </ListItem>
                                <ListItem style={{display:'flex', justifyContent:'flex-end'}}>
                                    <Button variant="contained" color="primary">
                                        Submit
                                    </Button>
                                </ListItem>
                            </List>
                        </FormControl>
  
                    </div>
                </InfoWindow>) : null}
            </GoogleMap>
        </div>
    );
}

export default Playgroups
