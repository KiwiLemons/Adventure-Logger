import { StyleSheet, Dimensions, View } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text } from '../../components/Themed';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../../environments';
import Constants from 'expo-constants';

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

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        provider={PROVIDER_GOOGLE} 
        initialRegion={INTIAL_POSITION} 
      />
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete 
          styles={{ textInput: styles.input }}
          placeholder='Search' 
          onPress={(data, details = null) => {
            console.log(data, details);
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en',
          }}
        />
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
    top: Constants.statusBarHeight,
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {width: 2, height:2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
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
