import { StyleSheet, Dimensions, View, Touchable } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text } from '../../components/Themed';

import MapView, { LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../../environments';
import Constants from 'expo-constants';
import { useRef, useState } from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
  const mapRef = useRef<MapView>(null)

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera()
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, {duration: 1000})
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

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        provider={PROVIDER_GOOGLE} 
        initialRegion={INTIAL_POSITION} 
      />
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_API_KEY}
        />
      )}

      <View style={styles.searchContainer}>
        <InputAutocomplete label="Origin" onPlaceSelected={(details) => {onPlaceSelected(details, "origin")}} />
        <InputAutocomplete label="Destination" onPlaceSelected={(details) => {onPlaceSelected(details, "destination")}} />
        
        <TouchableOpacity style={styles.button} onPress={() => setShowDirections(true)}>
          <Text style={styles.buttonText}>Trace Route</Text>
        </TouchableOpacity>
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
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#bbb",
    paddingVertical: 12,
    MarginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
   }, 
});
