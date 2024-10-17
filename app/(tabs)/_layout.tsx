import { Tabs } from 'expo-router';
import React, { useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { blue, Colors, orange, white } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useVoiceRecognitionContext } from '@/contexts/VoiceRecognitionContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { recognized, startRecognizing, stopRecognizing, started, isListening, results, procedure } = useVoiceRecognitionContext()
  const [isCamaraOpen, setisCamaraOpen] = useState(false)
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: true,
          tabBarShowLabel: false,
          tabBarLabelStyle: {fontFamily: "Repsol-Regular"}
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          listeners={{
            focus: () => setisCamaraOpen(true),
            blur: () => setisCamaraOpen(false),
          }}
          options={{
            title: 'Scan',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons name="photo-camera" size={30} color={focused ? blue : 'gray'} />
            ),
          }}
        />
      </Tabs>
      {!isCamaraOpen && procedure && <TouchableOpacity style={[styles.buttonSpeech, { borderWidth: 5, borderColor: isListening ? orange : 'transparent' }]} onPress={isListening ? stopRecognizing : startRecognizing} >
        <Text style={styles.text}><FontAwesome name="microphone" size={30} color="white" /></Text>
      </TouchableOpacity>}
    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    position: 'relative',
   
  },
  buttonSpeech: {
    color: white,
    backgroundColor: blue,
    width: 80,
    height: 80,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: white,
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -40,
    borderWidth: 5,
    zIndex: 40,

  }, text: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: white,
    fontWeight: "bold"
  },
});
