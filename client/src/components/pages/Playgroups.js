import React from 'react'
import { makeStyles, FormControl, InputLabel, Input, FormHelperText, Button, Divider, List, ListItem, ListItemText, Drawer, Toolbar, Paper, IconButton,
InputBase } from '@material-ui/core';
import { GoogleMap, useLoadScript, InfoWindow, Marker } from "@react-google-maps/api";
import { v4 as uuidv4 } from 'uuid';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import DirectionsIcon from '@material-ui/icons/Directions';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

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
      background: 'lightGrey',
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

    const onMapClick = React.useCallback((e) => {
        setMarkers((current) => [
            ...current,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                id: generateNewID(),
            },
        ]);
    }, []);

    // const panTo = React.useCallback(({ lat, lng }) => {
    //     mapRef.current.panTo({ lat, lng });
    //     mapRef.current.setZoom(16);
    //   }, []);

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
                    popupIcon={<SearchIcon />}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Map" variant="outlined" fullWidth />
                      // <Paper component="form" className={classes.searchBarRoot}>
                      //   <InputBase
                      //     className={classes.input}
                      //     placeholder="Search Google Maps"
                      //     inputProps={{ 'aria-label': 'search google maps' }}
                      //   />
                      //   <IconButton type="submit" className={classes.iconButton} aria-label="search">
                      //     <SearchIcon />
                      //   </IconButton>
                      //   <Divider className={classes.divider} orientation="vertical" />
                      //   <IconButton color="primary" className={classes.iconButton} aria-label="directions">
                      //     <DirectionsIcon />
                      //   </IconButton>
                      // </Paper>
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
                onClick={onMapClick}
                onLoad={onMapLoad}
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
                            <List>
                                <ListItem>
                                    <FormHelperText id="create-playgroup"><h2>Create a Playgroup!</h2></FormHelperText>
                                </ListItem>
                                <ListItem>
                                    <InputLabel htmlFor="name-of-playgroup">Name Of Playgroup</InputLabel>
                                    <Input id="name-of-playgroup" aria-describedby="my-helper-text" />
                                </ListItem>
                                <ListItem>
                                    <InputLabel htmlFor="date-of-meeting">Date Of Meeting</InputLabel>
                                    <Input id="date-of-meeting" aria-describedby="my-helper-text" />
                                </ListItem>
                                <ListItem>
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

// function Locate({ panTo }) {
//     return (
//       <button
//         className="locate"
//         onClick={() => {
//           navigator.geolocation.getCurrentPosition(
//             (position) => {
//               panTo({
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude,
//               });
//             },
//             () => null
//           );
//         }}
//       >
//         <img src="/compass.svg" alt="compass" />
//       </button>
//     );
//   }
  
//   function Search({ panTo }) {
//     const {
//       ready,
//       value,
//       suggestions: { status, data },
//       setValue,
//       clearSuggestions,
//     } = usePlacesAutocomplete({
//       requestOptions: {
//         location: { lat: () => 1.3314930427408092, lng: () => 103.80778265368694 },
//         radius: 2 * 1000,
//       },
//     });

//     // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest
  
//     const handleInput = (e) => {
//       setValue(e.target.value);
//     };
  
//     const handleSelect = async (address) => {
//       setValue(address, false);
//       clearSuggestions();
  
//       try {
//         const results = await getGeocode({ address });
//         const { lat, lng } = await getLatLng(results[0]);
//         panTo({ lat, lng });
//       } catch (error) {
//         console.log("😱 Error: ", error);
//       }
//     };
  
//     return (
//       <div className="search">
//         <Combobox onSelect={handleSelect}>
//           <ComboboxInput
//             value={value}
//             onChange={handleInput}
//             disabled={!ready}
//             placeholder="Search your location"
//           />
//           <ComboboxPopover>
//             <ComboboxList>
//               {status === "OK" &&
//                 data.map(({ id, description }) => (
//                   <ComboboxOption key={id} value={description} />
//                 ))}
//             </ComboboxList>
//           </ComboboxPopover>
//         </Combobox>
//       </div>
//     );
//   }

export default Playgroups
