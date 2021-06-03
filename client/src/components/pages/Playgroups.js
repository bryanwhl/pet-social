import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { GoogleMap, useLoadScript, withGoogleMap, Marker } from "@react-google-maps/api";
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles((theme) => ({
    mapContainerStyle: {
        width: "100vw",
        height: "94vh"
    }
}));

let a = 1;

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
    const classes = useStyles();

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_KEY,
        libraries,
    })

    const [markers, setMarkers] = React.useState([]);

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

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps...";

    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapStyle}
                zoom={12}
                center={center}
                onClick={onMapClick}
                options={options}
            >
                {markers.map(marker =>
                    <Marker 
                        key={marker.id} 
                        position={{
                            lat: marker.lat,
                            lng: marker.lng
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
}

export default Playgroups
