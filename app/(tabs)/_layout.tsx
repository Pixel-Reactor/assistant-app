import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet,View,Text,TouchableOpacity } from 'react-native';
import { useAppContext } from '@/contexts/appContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {menuOn,recognized,startRecognizing,started,isListening,results} = useAppContext()

  return (
    <View style={styles.container}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
    <TouchableOpacity style={[styles.buttonSpeech,{borderWidth:15,borderColor:isListening ? 'green': 'transparent'}]} onPress={startRecognizing} >
        <Text style={styles.text}><FontAwesome name="microphone" size={40} color="white" /></Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
 
  container: {
  flex:1,
  position:'relative',
  
 
  },
  buttonSpeech: {
    color: "white",
    backgroundColor: "rgba(18, 58, 204, 1)",
    width: 100,
    height: 100,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "white",
    position: 'absolute',
    bottom: 20,      
    left: '50%',     
    marginLeft: -50,
    borderWidth: 15,
    
  },text: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: "white",
    fontWeight: "bold"
  },
});
