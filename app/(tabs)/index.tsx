import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getTasks } from '@/api/api';
import { useVoiceRecognitionContext } from '@/contexts/VoiceRecognitionContext';
import { findTask } from '@/functions/FindTask';
import { TaskModel } from '@/models/TaskModel';
// const listaCadenas = ['manzana', 'naranja', 'banana', 'mandarina'];
// const input = 'manznaa';  // Cadena con un error
export default function HomeScreen() {

  const { setTaskList, taskList, recognized, started, isListening, results } = useVoiceRecognitionContext()


  useEffect(() => {
    const init = async () => {
      // const speak = () => {
      //   const thingToSay = 'Hola Equipo';
      //   Speech.speak(thingToSay, { language: 'es-ES' });
      // };

      // speak()

      try {
        const tasklist = await getTasks()
        console.log('tasklist', tasklist)
        setTaskList(tasklist)
        const TaskListNames = tasklist.map((item) => {
          return item.taskName
        })

        findTask(TaskListNames, 'repostar')
      }
      catch (error) {
        console.log('error', error)
      }

    }
    init()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: 'white' }]}>{started}</Text>
      {/* <Text style={[styles.text,{color:'white'}]}>{recognized}recognizzed</Text> */}
      <View style={styles.listContainer}>
        {taskList ? taskList.map((item: TaskModel, i: number) => {
          return (
            <View key={item.taskName} style={styles.listRow}>
              <Text style={[styles.text, { color: 'white', textAlign: 'left', maxWidth: '90%' }]}>{item.taskName}</Text>

              {item.done ?
                <MaterialCommunityIcons name="checkbox-marked" size={24} color="white" /> :
                <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="white" />
              }

            </View>
          ) 
        })
        : null
      }

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
    alignItems: 'center',
    paddingHorizontal: 5
  },
  resultsText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: "black",
    padding: 10,
    borderRadius: 20,
    position: 'absolute',
    bottom: 70
  }
});