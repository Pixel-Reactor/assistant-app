import { AnalizeVoice } from '@/functions/AnalizeVoiceComand';
import { FindTask } from '@/functions/FindTask';
import tasklist from '@/mock-data/tasklist.json';
import Voice from '@react-native-voice/voice';
import React, { FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
interface Props {
    children: ReactNode
}
interface VoiceRecognitionContextDataType {

    recognized: string;
    isListening: boolean;
    results: string[] | [];
    started: string;
    startRecognizing: () => void;
    stopRecognizing: () => void;
    List: any;
}

export const VoiceRecognitionContext = React.createContext<VoiceRecognitionContextDataType>({

    recognized: '',
    isListening: false,
    results: [],
    started: '',
    startRecognizing: () => { },
    stopRecognizing: () => {},
    List: []


})

export const useVoiceRecognitionContext = () => {
    return useContext(VoiceRecognitionContext)
}

const VoiceRecognitionProvider: FC<Props> = ({ children }) => {

    const [recognized, setRecognized] = useState('');
    const [started, setStarted] = useState('');
    const [results, setResults] = useState<string[] | []>([]);
    const [isListening, setisListening] = useState(false);
    const [List, setList] = useState(tasklist)
    useEffect(() => {
        try {
            Voice.onSpeechRecognized = () => {
                console.log('onSpeechRecognized')

            }
            Voice.onSpeechError = (e) => {
                console.error('speech error', e)
            }
            Voice.onSpeechResults = (result) => {
                console.log("Listener 'onSpeechResults' activado con resultados:", result);
                if (result && result?.value && result?.value[0]) {
                    setResults(result?.value);
                } else {
                    console.log('else')
                }

            };
            Voice.onSpeechEnd = (end) => {
                console.log("Listener 'onSpeechEnd' activado");
                setStarted('Reconocimiento de voz detenido');
                stopRecognizing()
                setisListening(false)
            };
        } catch (error) {
            console.error('error', error)
        }

        return () => {
            Voice.stop();
            Voice.removeAllListeners();
        };
    }, [])
    const startRecognizing = async () => {
        try {
            if (isListening) { return }
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
            console.log('stop recognizing')
            await Voice.stop();
            setStarted('Reconocimiento de voz detenido');
        } catch (e) {
            console.error(e);
        }
    };


    useEffect(() => {
        const response = AnalizeVoice(results)
        console.log('response from analizeVoice', response)
        const TaskListNames = List.map((item) => {
            return item.taskName
        })
        const taskFound = FindTask(TaskListNames, response.task);
        console.log('taskFound context', taskFound)

        

        const toggleTaskDone = (taskFound) => {
            setList(prevTasks =>
                prevTasks.map(task =>
                    task.taskName === taskFound
                        ? { ...task, done: true }
                        : task
                )
            );
        };
        // toggleTaskDone(taskFound)



        const ToggleTaskUndone = (taskFound) => {
            setList(prevTasks =>
                prevTasks.map(task =>
                    task.taskName === taskFound
                        ? { ...task, done: false }
                        : task
                )
            );
        };
        response.command === 'check' ? toggleTaskDone(taskFound) : ToggleTaskUndone(taskFound)

    }, [results])

    const value = useMemo(
        () => ({ startRecognizing, stopRecognizing, recognized, results, started, isListening, List }),
        [startRecognizing, stopRecognizing, recognized, results, started, isListening, List]
    )
    return (
        <VoiceRecognitionContext.Provider value={value}>
            {children}
        </VoiceRecognitionContext.Provider>
    )
}

export default VoiceRecognitionProvider