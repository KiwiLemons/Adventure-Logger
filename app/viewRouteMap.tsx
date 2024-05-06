import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import { Text } from '../components/Themed';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../environments';
import MapViewDirections from 'react-native-maps-directions';
import { getUser_id } from './globals';
import { useLocalSearchParams } from 'expo-router';

//const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



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
  const markers = useLocalSearchParams();
  //console.log(markers);

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera()
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 })
    }
  }


  const edgePadding = {
    top: 100,
    bottom: 100,
    right: 100,
    left: 100,
  }
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: markers[0].coords.latitude,
          longitude: markers[0].coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {markers.map((marker, index:number) => {
          var coord = {latitude: marker.coords.latitude, longitude: marker.coords.longitude} as LatLng;
          return <Marker
            key={index}
            coordinate={coord}
            title={"title"}
            description={"description"}
          />
        })}
      </MapView>
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
    shadowOffset: { width: 2, height: 2 },
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
    backgroundColor: "#FF6347",
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