import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ChecklistRow } from '@/components/checklist/ChecklistRow';
import { black, gray, orange, white } from '@/constants/Colors';
import { useVoiceRecognitionContext } from '@/contexts/VoiceRecognitionContext';

export default function HomeScreen() {

  const { procedure, started, results } = useVoiceRecognitionContext()

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
    backgroundColor: gray,
    flex:1,
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
    fontFamily: 'Repsol-Regular',
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