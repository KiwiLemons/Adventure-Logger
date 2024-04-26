import { StatusBar } from 'expo-status-bar';
import Feather from '@expo/vector-icons/Feather';
import { Platform, StyleSheet, Button, Switch, Pressable, useColorScheme } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ModalScreen() {
  const colorScheme = useColorScheme();
  useEffect(() => {

  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <View style={styles.header}>
        <Text style={styles.title}>
          <Pressable style={{marginTop: -10}}>
          {({ pressed }) => (
            <Feather
              name="x"
              size={35}
              color={Colors[colorScheme ?? 'light'].text}
              style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
        New Route
        </Text>
      </View>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flex: 0.1,
    backgroundColor: 'grey',
    justifyContent:'space-between',
    alignItems:'flex-start'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -10
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
