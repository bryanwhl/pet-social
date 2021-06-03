import React from 'react'
import { makeStyles, FormControl, InputLabel, Input, FormHelperText, Button, Divider, List, ListItem } from '@material-ui/core';
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
import "./Playgroups.css";

const useStyles = makeStyles((theme) => ({
    mapContainerStyle: {
        width: "100vw",
        height: "94vh"
    }
}));

const center = {
    lat: 1.3314930427408092,
    lng: 103.80778265368694
}

const mapStyle = {
    width: "100vw",
    height: "100vh",
}

const options = {
    disableDefaultUI: true,
};

const generateNewID = () => {
    const newID = uuidv4();
    return newID;
}

const libraries = ["places"];

const Playgroups = () => {

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

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(16);
      }, []);

    const mapRef = React.useRef();

    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, [])

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps...";

    return (
        <div>
            <Locate panTo={panTo} />
            <Search panTo={panTo} />
            <GoogleMap
                mapContainerStyle={mapStyle}
                zoom={12}
                center={center}
                onClick={onMapClick}
                options={options}
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

function Locate({ panTo }) {
    return (
      <button
        className="locate"
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => null
          );
        }}
      >
        <img src="/compass.svg" alt="compass" />
      </button>
    );
  }
  
  function Search({ panTo }) {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        location: { lat: () => 1.3314930427408092, lng: () => 103.80778265368694 },
        radius: 2 * 1000,
      },
    });

    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest
  
    const handleInput = (e) => {
      setValue(e.target.value);
    };
  
    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();
  
      try {
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        panTo({ lat, lng });
      } catch (error) {
        console.log("😱 Error: ", error);
      }
    };
  
    return (
      <div className="search">
        <Combobox onSelect={handleSelect}>
          <ComboboxInput
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Search your location"
          />
          <ComboboxPopover>
            <ComboboxList>
              {status === "OK" &&
                data.map(({ id, description }) => (
                  <ComboboxOption key={id} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
      </div>
    );
  }

export default Playgroups
