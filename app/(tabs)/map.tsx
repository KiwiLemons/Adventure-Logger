import React, { useRef, useState } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import { Text } from '../../components/Themed';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../../environments';
import MapViewDirections from 'react-native-maps-directions';

//const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INTIAL_POSITION = {
  latitude: 32.532073,
  longitude: -92.661315,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

type InputAutocompleteProps = {
  label: string;
  placeholder?: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
}

function InputAutocomplete({
  label,
  placeholder,
  onPlaceSelected,
}: InputAutocompleteProps) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete 
          styles={{ textInput: styles.input }}
          placeholder={placeholder || ""}
          fetchDetails
          onPress={(data, details = null) => {
            onPlaceSelected(details);
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en',
          }}
        />
    </>
  );
}

export default function TabTwoScreen() {
  const [origin, setOrigin] = useState<LatLng | null>()
  const [destination, setDestination] = useState<LatLng | null>()
  const [showDirections, setShowDirections] = useState(false)
  const [distance, setDistance] = useState<number | null>(null); // State to hold distance
  const mapRef = useRef<MapView>(null)

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera()
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, {duration: 1000})
    }
  }

  const edgePadding = {
    top: 100,
    bottom: 100,
    right: 100,
    left: 100,
  }

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true)
      mapRef.current?.fitToCoordinates([origin, destination], {edgePadding})
      // Calculate distance between origin and destination
      const routeDistance = calculateDistance(origin.latitude, origin.longitude, destination.latitude, destination.longitude);
      setDistance(routeDistance);
    }
  }

  const onPlaceSelected = (details: GooglePlaceDetail | null, flag: "origin" | "destination") => {
    const set = flag === "origin" ? setOrigin : setDestination
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0
    }
    set(position)
    moveTo(position)
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1); 
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
              Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const d = R * c; // Distance in km
    // Convert km to miles
    const miles = d * 0.621371;
    return miles;
  }
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        provider={PROVIDER_GOOGLE} 
        initialRegion={INTIAL_POSITION} 
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeColor='#6644ff'
            strokeWidth={4}
          />
        )}
      </MapView>
      
      <View style={styles.searchContainer}>
        <InputAutocomplete label="Origin" placeholder='Origin Point' onPlaceSelected={(details) => {onPlaceSelected(details, "origin")}} />
        <InputAutocomplete label="Destination" placeholder='Destination Point' onPlaceSelected={(details) => {onPlaceSelected(details, "destination")}} />
        
        <TouchableOpacity style={styles.button} onPress={traceRoute}>
          <Text style={styles.buttonText}>Trace Route</Text>
        </TouchableOpacity>
        
        {distance && <Text style={styles.distanceText}>Distance: {distance.toFixed(2)} mi</Text>}
      </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }, 
  searchContainer: {
    position: "absolute",
    left: 20,
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {width:2, height:2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
    padding: 8,
    borderRadius: 8,
    top: 10,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#bbb",
    paddingVertical: 8,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: "center",
  },
  distanceText: {
    textAlign: "center",
    marginTop: 8,
  },
});
