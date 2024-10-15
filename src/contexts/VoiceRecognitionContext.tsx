import { analizeVoice } from '@/functions/AnalizeVoiceComand';
import { findTask } from '@/functions/FindTask';
import { TaskModel } from '@/models/TaskModel';
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
    taskList: TaskModel[];
    setTaskList: (tasks: TaskModel[]) => void
}

export const VoiceRecognitionContext = React.createContext<VoiceRecognitionContextDataType>({

    recognized: '',
    isListening: false,
    results: [],
    started: '',
    startRecognizing: () => { },
    stopRecognizing: () => { }, 
    taskList: [],
    setTaskList: (tasks: TaskModel[]) => {}

})

export const useVoiceRecognitionContext = () => {
    return useContext(VoiceRecognitionContext)
}

const VoiceRecognitionProvider: FC<Props> = ({ children }) => {

    const [recognized, setRecognized] = useState('');
    const [started, setStarted] = useState('');
    const [results, setResults] = useState<string[] | []>([]);
    const [isListening, setisListening] = useState(false);
    const [taskList, setTaskList] = useState<TaskModel[]>([])

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

    const destroyVoice = async () => {
        await Voice.destroy();
        await Voice.stop()
    }
    const startRecognizing = async () => {
        try {
            const available = await Voice.isAvailable();
            console.log('Voice Available?', available)
            if (isListening||!available) { return }
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

        if (results.length < 1) { return }
        const response = analizeVoice(results)
        console.log('response from analizeVoice', response)
        const TaskListNames = taskList.map((item: TaskModel) => {
            return item.taskName
        })
        const taskFound = findTask(TaskListNames, response.task);
        console.log('taskFound context', taskFound)

        const toggleTaskDone = (taskFound: string) => {
            setTaskList((prevTasks: any) => {
                return prevTasks.map(task =>
                    task.taskName === taskFound
                        ? { ...task, done: true }
                        : task
                )
            }
            );
        };
        // toggleTaskDone(taskFound)

        const toggleTaskUndone = (taskFound) => {
            setTaskList(prevTasks =>
                prevTasks.map(task =>
                    task.taskName === taskFound
                        ? { ...task, done: false }
                        : task
                )
            );
        };
        response.command === 'check' ? toggleTaskDone(taskFound) : toggleTaskUndone(taskFound)

    }, [results])

    const value = useMemo(
        () => ({ startRecognizing, stopRecognizing, setTaskList, recognized, results, started, isListening, taskList }),
        [startRecognizing, stopRecognizing, setTaskList,recognized, results, started, isListening, taskList]
    )
    return (
        <VoiceRecognitionContext.Provider value={value}>
            {children}
        </VoiceRecognitionContext.Provider>
    )
}

export default VoiceRecognitionProvider