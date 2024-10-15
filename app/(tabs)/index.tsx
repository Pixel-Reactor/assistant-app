import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppContext } from '@/contexts/appContext';
import * as Speech from 'expo-speech';
import { FindTask } from '@/functions/FindTask';
// const listaCadenas = ['manzana', 'naranja', 'banana', 'mandarina'];
// const input = 'manznaa';  // Cadena con un error
import tasklist from '@/mock-data/tasklist.json'
export default function HomeScreen() {

  const { List, recognized, startRecognizing, started, isListening, results } = useAppContext()
  const [TaskList, setTaskList] = useState(List)


  useEffect(() => {
    const speak = () => {
      const thingToSay = 'Hola Equipo';
      Speech.speak(thingToSay, { language: 'es-ES' });
    };

    // speak()
    const TaskListNames = tasklist.map((item) => {
      return item.taskName
    })
    console.log('tasklist', TaskListNames)
    FindTask(TaskListNames, 'repostar')
  }, [])


  useEffect(() => {
    setTaskList(List)
  }, [List])
  
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: 'white' }]}>{started}</Text>
      {/* <Text style={[styles.text,{color:'white'}]}>{recognized}recognizzed</Text> */}
      <View style={styles.listContainer}>
        {TaskList && TaskList.map((item:any,i:any) => {
          return (
            <View key={i} style={styles.listRow}>
              <Text style={[styles.text, { color: 'white',textAlign:'left',maxWidth:'90%' }]}>{item.taskName}</Text>
             
                {item.done ?
                  <MaterialCommunityIcons name="checkbox-marked" size={24} color="white" /> :
                  <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="white" />
                }
            
            </View>
          )
        })}

      </View>
      <Text style={[styles.resultsText, { backgroundColor: results && results.length ? 'white' : 'transparent' }]}>
        {(results && results.length) ? `Tu: ${results[0]}` : ''}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#0E0E0E"
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: "black",
    padding: 10,
    borderRadius: 20
  },
  buttonSpeech: {
    color: "white",
    backgroundColor: "rgba(18, 58, 204, 1)",
    width: 200,
    height: 200,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "white",
  },
  listContainer: {
    borderWidth: 1,
    flex: 1,
    width: '100%',
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'white',
    alignItems:'center',
    paddingHorizontal:5
  },
  resultsText:{
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: "black",
    padding: 10,
    borderRadius: 20,
    position:'absolute',
    bottom:70
  }
});