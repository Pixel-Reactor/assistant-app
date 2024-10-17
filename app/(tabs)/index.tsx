import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getProcedure } from '@/api/api';
import { useVoiceRecognitionContext } from '@/contexts/VoiceRecognitionContext';
import { findTask } from '@/functions/FindTask';
import { TaskModel } from '@/models/TaskModel';
import { ChecklistRow } from '@/components/checklist/ChecklistRow';
import { black, blue, gray, orange, white } from '@/constants/Colors';
import { ProcedureModel } from '@/models/ProcedureModel';
// const listaCadenas = ['manzana', 'naranja', 'banana', 'mandarina'];
// const input = 'manznaa';  // Cadena con un error
export default function HomeScreen() {

  const { setProcedure, procedure, recognized, started, isListening, results } = useVoiceRecognitionContext()


  useEffect(() => {
    const init = async () => {
      // const speak = () => {
      //   const thingToSay = 'Hola Equipo';
      //   Speech.speak(thingToSay, { language: 'es-ES' });
      // };

      // speak()

      try {
        const procedure = await getProcedure()
        console.log('procedure', procedure)
        setProcedure(procedure)
        const TaskListNames = procedure.tasks.map((item) => {
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
    <SafeAreaView style={styles.container}>
      {
        procedure ? <>
          <Text style={[styles.text, { color: white }]}>{started}</Text>
          {/* <Text style={[styles.text,{color:'white'}]}>{recognized}recognizzed</Text> */}
          <Text style={[styles.title, { color: orange }]}>{procedure?.procedureName}</Text>

          <FlatList
            style={styles.listContainer}
            data={procedure.tasks}
            renderItem={({ item, index }) => <ChecklistRow task={item} index={index} />}
            // ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#EAEAEA", width: "25%", alignSelf: "center" }} />}
            keyExtractor={(item) => item.taskName}
          />

          <Text style={[styles.resultsText, { backgroundColor: results && results.length ? white : 'transparent' }]}>
            {(results && results.length) ? `Tu: ${results[0]}` : ''}
          </Text>
        </> :
          <View style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
            <Text style={[styles.text, { color: orange }]}>Escanea un procedimiento para continuar</Text>
          </View>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: gray
  },
  title: {
    fontFamily: 'Repsol-Regular',
    fontSize: 26,
    textAlign: 'center',
    color: orange,
    borderRadius: 20,
    marginBottom: 20
  },
  text: {
    fontFamily: 'Repsol-Regular',
    fontSize: 18,
    textAlign: 'center',
    color: black,
    padding: 10,
    borderRadius: 20
  },
  buttonSpeech: {
    color: white,
    backgroundColor: "rgba(18, 58, 204, 1)",
    width: 200,
    height: 200,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: white,
  },
  listContainer: {
    borderRadius: 8,
    width: '100%',
  },
  resultsText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: black,
    padding: 10,
    borderRadius: 20,
    position: 'absolute',
    bottom: 70
  }
});