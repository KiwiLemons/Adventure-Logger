import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { setUser_id, getUser_id } from './globals';

export default function LoginScreen() {
  const navigation = useNavigation(); // Initialize navigation hook
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [errorVisible, seterrorVisible] = useState(false);
  const [loading, setLoading] = useState(true);


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
    if (response.status == 404 || response.status == 400) {
      seterrorVisible(true);
      return;
    }
    if (response.status != 200) {
      console.log(response.status)
      return;
    }

    response.text().then((data) => {
      setUser_id(data);
      navigation.navigate("(tabs)");
    });
  };

  useLayoutEffect(() => {
    getUser_id().then((value) => {
      console.log(value);
      if (value !== null) {
        navigation.navigate("(tabs)");
      }
      else {
        setLoading(false);
      }
    })
  }, []);

  //if user is already logged in, log them in again
  if (loading) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Adventure_Logger_Logo.jpg')}
        style={styles.logo}
      />
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
      <TouchableOpacity onPress={() => navigation.navigate("createAcc")}>
        <Text style={styles.registerText}>Don't have an account? Register here</Text>
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
  error: {
    color: '#fc3a3d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20, 
  },  
});
