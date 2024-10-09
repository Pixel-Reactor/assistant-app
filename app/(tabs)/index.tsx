import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Voice from '@react-native-voice/voice';


export default function HomeScreen() {
  const [recognized, setRecognized] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState<string[] | []>([]);
  const [isListening, setisListening] = useState(false)
  useEffect(() => {
    try {
      Voice.onSpeechRecognized = () => {
        console.log('onSpeechRecognized')

      }
      Voice.onSpeechError = (e) => {
        console.log('speech error', e)
      }
      Voice.onSpeechResults = (result) => {
        console.log("Listener 'onSpeechResults' activado con resultados:", result);
        if (result && result?.value && result?.value[0]) {
          setResults(result?.value);
        }

      };
      Voice.onSpeechEnd = (end) => {
        console.log("Listener 'onSpeechEnd' activado");
        setStarted('Reconocimiento de voz detenido');
        stopRecognizing()
        setisListening(false)


      };
    } catch (error) {
      console.log('error', error)
    }

    return () => {
      // Limpiar los listeners para evitar fugas de memoria
      Voice.removeAllListeners();
    };
  }, [])

  const startRecognizing = async () => {
    try {

      await Voice.start('es-ES');
      setRecognized('');
      setResults([]);
      setStarted('Escuchando...');
      setisListening(true)
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {

      await Voice.stop();
      setStarted('Reconocimiento de voz detenido');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setResults([])
    }, 5000);
    return () => {
      clearTimeout(timer)
    }
  }, [results])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{started}</Text>
      <Text style={styles.text}>{recognized}</Text>
      <TouchableOpacity style={[styles.buttonSpeech,{borderWidth:15,borderColor:isListening ? 'green': 'transparent'}]} onPress={startRecognizing} >
        <Text style={styles.text}>Pulsa para hablar</Text>
      </TouchableOpacity>

      <Text style={styles.text}>
        {(results && results.length) ? results[0] : ''}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 20,
    backgroundColor: "#0E0E0E"
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: "white",
    fontWeight: "bold"
  },
  buttonSpeech: {
    color: "white",
    backgroundColor: "rgba(18, 58, 204, 1)",
    width: 200,
    height: 200,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "white",
  }
});