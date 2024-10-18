import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useVoiceRecognitionContext } from '@/contexts/VoiceRecognitionContext';
import { getProcedure } from '@/api/api';
import { black, blue, orange, white } from '@/constants/Colors';
export default function TabTwoScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);  // Referencia a la cámara para capturar la foto
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLoading, setisLoading] = useState(false)
  const [photoUri, setPhotoUri] = useState(null); // Estado para guardar la URI de la foto
  const { setProcedure } = useVoiceRecognitionContext()

  if (!permission) {

    return <View />;
  }

  if (!permission.granted) {

    return (
      <View style={[styles.container, {alignItems: 'center'}]}>
        <View style={{backgroundColor: white, borderRadius: 8, width: "80%", padding: 10}}>
          <Text style={styles.message}>Necesitamos permisos para acceder a tu cámara</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.button} >
            <Text style={styles.buttonText}>Conceder Permisos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  const ShotAndUpload = async () => {
    setisLoading(true);

    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef?.current?.takePictureAsync({ base64: true });
        console.log("photo uri", photo.uri)
        const procedure = await getProcedure(photo.uri)

        setTimeout(() => {
          setProcedure(procedure)
          router.navigate('/(tabs)/')
          setisLoading(false)
        }, 3000);

      } catch (error) {
        console.log(error)
      } finally {
        setIsCapturing(false);
      }
    }
  }
  return (
    <View style={styles.container}>
      {isLoading && <View style={styles.loadContainer}>
        <Text style={styles.loaderText}>{isCapturing ? 'Capurando la imagen' : 'Subiendo y procesando la imagen...'}</Text>
      </View>}
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={toggleCameraFacing}>
            <MaterialCommunityIcons name="camera-flip" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.shotButton} onPress={ShotAndUpload}>
          <View style={styles.shotCircle}></View>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  message: {
    fontFamily: 'Repsol-Regular',
    fontSize: 18,
    color: black,
    textAlign: 'left',
    marginBottom: 10
  },
  button: {
    backgroundColor: blue,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 8
  },
  buttonText: {
    fontFamily: 'Repsol-Regular',
    textAlignVertical: 'center',
    fontSize: 18,
    color: white,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
    position: "relative"
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 0,
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderWidth: 1,
    borderColor: 'white',
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 50
  },
  shotButton: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 50,
    position: 'absolute',
    bottom: 5,
    left: '50%',
    marginLeft: -40,
    zIndex: 50,
    backgroundColor: 'transparent',
    padding: 8,
    borderWidth: 1,
    borderColor: 'white',

  },
  shotCircle: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  text: {
    fontFamily: 'Repsol-Regular',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  loadContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    position: 'absolute',
  },
  loaderText: {
    fontFamily: 'Repsol-Regular',
    fontSize: 20,
    color: orange,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,

  }
});