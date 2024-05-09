import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import { Text } from '../components/Themed';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
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


export default function TabTwoScreen() {
  const [origin, setOrigin] = useState<LatLng | null>()
  const [destination, setDestination] = useState<LatLng | null>()
  const [showDirections, setShowDirections] = useState(false)
  const [distance, setDistance] = useState<number | null>(null); // State to hold distance
  const mapRef = useRef<MapView>(null)
  var markers = useLocalSearchParams();
  var initialLat = 32.52363;
  var initialLong = -92.63904;

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera()
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 })
    }
  }

  if (Object.keys(markers) == 0){
    markers = [];
  }
  else{
    var last = markers.length - 1;
    initialLat = markers[last].coords.latitude
    initialLong = markers[last].coords.longitude;
  }


  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: initialLat,
          longitude: initialLong,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Polyline
          coordinates={markers.map((marker) => {
            return {latitude: marker.coords.latitude, longitude: marker.coords.longitude}
          })}
          strokeWidth={3}
          strokeColor='red'
        />
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
