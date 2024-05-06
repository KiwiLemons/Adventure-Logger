import { StatusBar } from 'expo-status-bar';
import Feather from '@expo/vector-icons/Feather';
import { Platform, StyleSheet, Button, TouchableOpacity, Pressable, useColorScheme } from 'react-native';
import { useNavigation } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import { getUser_id } from './globals';


export default function ModalScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [user_id, setuser_id] = useState('');
  const [routeName, setRouteName] = useState('');

  useEffect(() => {
    setuser_id(getUser_id());
  }, []);

  const createRoute = async () => {
    //Validate info
    if (routeName == '')
      return;

    const newRoute = {
      user_id: user_id,
      name: routeName
    };

    const url = 'https://webserver-image-ccuryd6naa-uc.a.run.app/api/routes/create';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRoute),
    });
    if (response.status == 404 || response.status == 400) {
      //seterrorVisible(true);
      return;
    }
    if (response.status != 201) {
      console.log(response)
      return;
    }

    response.text().then((data) => {
      //setUser_id(data);
      navigation.goBack();
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <View style={styles.header}>
        <Text style={styles.title}>
          New Route
        </Text>
      </View>


      <View style={styles.viewItem}>
        <Text style={styles.title}>Route Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={text => setRouteName(text)}
        />
        <TouchableOpacity style={styles.button} onPress={createRoute}>
          <Text style={styles.buttonText}>Create Route</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    flex: 0.1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
  },
  viewItem: {
    backgroundColor: 'white',
    padding: 30
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
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
});
