import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Button, Switch, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, View } from '../components/Themed';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import Colors from '../constants/Colors';
import { useLocalSearchParams, useNavigation } from 'expo-router';

const LOCATION_TASK_NAME = 'background-location-task';
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;


const postRequest = async (locations: object) => {
  //Somehow get the route_id here yippie
  const url = 'https://webserver-image-ccuryd6naa-uc.a.run.app/api/routes/1';
  const bodyData = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: locations })
  }

  const response = await fetch(url, bodyData);
  if (response.status == 404 || response.status == 400) {
    //seterrorVisible(true);
    response.text().then(value => console.log(value))
    return;
  }
  if (response.status != 200) {
    console.log(response)
    return;
  }

  response.text().then((data) => {
  });
}

export default function ModalScreen() {
  //Get the passed param from the navigate function
  const route = useLocalSearchParams() as unknown as route;
  const navigation = useNavigation();
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [markers, setMarkers] = useState();
  console.log(route)

  const startStopBackgroundLocation = async (switchState: boolean) => {
    if (switchState) {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus === 'granted') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === 'granted') {
          console.log('Start task')
          setTrackingEnabled(true);
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Highest,
            deferredUpdatesInterval: 1000
          });
        }
      }
    }
    else {
      console.log('Stop task')
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      setTrackingEnabled(false);
    }
  };

  useEffect(() => {
    let TaskStatus = TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    TaskStatus.then((value) => {
      setTrackingEnabled(value)
    });
  }, [])

  const loadMap = () => {
    try {
      fetch("https://webserver-image-ccuryd6naa-uc.a.run.app/api/routes/1").then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch route data');
        }
        response.json().then(data => {
          var realdata = JSON.parse(data.data)
          //Put data in marker format
          navigation.navigate("viewRouteMap", realdata);
          //setMarkers(realdata);
          //console.log(realdata); 
        });
      });
    }
    catch (error) {
      console.error('Error fetching route data:', error);
    } 
    
    //navigation.navigate("viewRouteMap")
  }

  console.log(trackingEnabled);
  return (
    <View style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Text style={styles.title}>Tracking</Text>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Switch
        trackColor={{ false: '#595959', true: '#05c141' }}
        ios_backgroundColor="#3e3e3e"
        thumbColor={'#bac1bc'}
        onValueChange={startStopBackgroundLocation}
        value={trackingEnabled}
      ></Switch>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {route.distance == 0 ?
        <TouchableOpacity style={styles.button} onPress={() => loadMap()}>
          <Text style={styles.buttonText}>View on Map</Text>
        </TouchableOpacity> :
        <TouchableOpacity style={styles.disabledButton} disabled>
          <Text style={styles.disabledbuttonText}>View on Map</Text>
        </TouchableOpacity>
      }
    </View>
  );
}



TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error.message)
    return;
  }
  if (data) {
    const { locations } = data;
    console.log(locations)

    postRequest(locations);
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledbuttonText: {
    color: '#ddd',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

type route = {
  distance: number;
  name: string;
  route_id: number;
}
