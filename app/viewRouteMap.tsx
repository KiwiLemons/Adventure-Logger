import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Switch } from 'react-native';
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
  const [emptyRoute, setEmptyRoute] = useState(false)
  const [followRoute, setFollowRoute] = useState(true); // State to hold distance
  const [markers, setMarkers] = useState({route: []})
  const mapRef = useRef<MapView>(null)
  var route = useLocalSearchParams();
  var initialLat = 32.52363;
  var initialLong = -92.63904;

  const loadMapData = () => {
    try {
      //Get route coords data
      fetch(`https://webserver-image-ccuryd6naa-uc.a.run.app/api/routes/${route.route_id}`).then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch route data');
        }
        response.json().then(data => {
          if (data.data !== null){
            setMarkers({route: JSON.parse(data.data)})
          }
          else{
            setEmptyRoute(true);
          }
        });
      });
    }
    catch (error) {
      console.error('Error fetching route data:', error);
    } 
  }


  useEffect(() => {
    loadMapData();
    const updateMap = setInterval(() => {
      loadMapData();
    }, 3000);

    return () => clearInterval(updateMap);
  }, [])


  const startStopFollow = async (switchState:boolean) => {
    if (switchState) {

    }
    else {

    }
  };
 

  if (Object.keys(markers.route) == 0){
    markers.route = [];
    if (!emptyRoute){
      return(
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }
  }
  else{
    var last = markers.route.length - 1;
    initialLat = markers.route[last].coords.latitude;
    initialLong = markers.route[last].coords.longitude;
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
          coordinates={markers.route.map((marker) => {
            return {latitude: marker.coords.latitude, longitude: marker.coords.longitude}
          })}
          strokeWidth={10}
          strokeColor='red'
        />
        {markers.route.map((marker, index:number) => {
          // Check if the current marker is either the first or the last in the array
          if (index === 0 || index === markers.route.length - 1) {
            var coord = {latitude: marker.coords.latitude, longitude: marker.coords.longitude} as LatLng;
            return <Marker
              key={index}
              coordinate={coord}
              title={"Point " + (index === 0 ? "Start" : "End")}
              description={"description"}
            />
          }
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
