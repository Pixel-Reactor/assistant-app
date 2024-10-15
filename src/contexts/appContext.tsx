import React, { useContext, useEffect, useState, useMemo, Children, Dispatch, SetStateAction, ReactNode, FC } from 'react'
import Voice from '@react-native-voice/voice';
import tasklist from '@/mock-data/tasklist.json'
import { AnalizeVoice } from '@/functions/AnalizeVoiceComand';
import { FindTask } from '@/functions/FindTask';
interface Props {
    children: ReactNode
}
interface AppContextDataType {

    recognized: string;
    isListening: boolean;
    results: string[] | [];
    started: string;
    startRecognizing: () => void;
    List: any;
}

export const AppContext = React.createContext<AppContextDataType>({

    recognized: '',
    isListening: false,
    results: [],
    started: '',
    startRecognizing: () => { },
    List: []


})

export const useAppContext = () => {
    return useContext(AppContext)
}

const AppProvider: FC<Props> = ({ children }) => {

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
                console.log('speech error context', e);
                destroyVoice()
                setStarted('Reconocimiento de voz detenido');
                stopRecognizing()
               
               
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
                
            };
        } catch (error) {
            console.log('error', error)
        }

        return () => {
            Voice.stop()
            Voice.removeAllListeners();
        };
    }, [])

    const destroyVoice = async()=>{
        await Voice.destroy();
        await Voice.stop()
    }
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

            await Voice.stop();
            setStarted('Reconocimiento de voz detenido');
            setisListening(false)
        } catch (e) {
            console.error(e);
        }
    };


    useEffect(() => {
       
        if(results.length < 1){return}
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
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider