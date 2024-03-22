import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Button, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, View } from '../components/Themed';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import Colors from '../constants/Colors';

const LOCATION_TASK_NAME = 'background-location-task';
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const postRequest = async (requestOptions:object) => {
  try {
    await fetch(
      `${BACKEND_URL}/api/routes`, requestOptions)
      .then(response => {
        response.json()
          .then(data => {
            alert("Post created");
            console.log(data);
          });
      })
  }
  catch (error) {
    console.error(error);
  }
}

export default function ModalScreen() {
  const [trackingEnabled, setTrackingEnabled] = useState(false);

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

  console.log(trackingEnabled);
  return (
    <View style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Text style={styles.title}>Enable Tracking</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Switch
        trackColor={{ false: '#595959', true: '#05c141' }}
        ios_backgroundColor="#3e3e3e"
        thumbColor={'#bac1bc'}
        onValueChange={startStopBackgroundLocation}
        value={trackingEnabled}
      ></Switch>
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
    let route_id = 1;
    let requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {route_id, locations}
    };

    postRequest(requestOptions);
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
});
