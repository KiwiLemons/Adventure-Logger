import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { setUser_id }  from './globals';

export default function LoginScreen() {
  const navigation = useNavigation(); // Initialize navigation hook
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [errorVisible, seterrorVisible] = useState(false);

  const handleLogin = async () => {
    // Navigate to other screens here
    // For example, navigate to HomeScreen

    //Validate login
    const user = {
      Username: Username,
      Password: Password
    };

    const url = 'https://webserver-image-ccuryd6naa-uc.a.run.app/api/users/login';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }); 
    if (response.status == 404 || response.status == 400){
      seterrorVisible(true);
      return;
    }
    if (response.status != 200){
      console.log(response.status)
      return;
    }

    response.text().then((data) => {
      setUser_id(data);
      navigation.navigate("(tabs)");
    });
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />
      {errorVisible ? (<Text style={styles.error}>Wrong Username or Password</Text>) : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    backgroundColor: '#2e78b7',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#fc3a3d',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
