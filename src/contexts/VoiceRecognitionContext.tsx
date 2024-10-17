import { ProcedureModel } from '@/models/ProcedureModel';
import { analizeVoice, VoiceAnalysisResult, VoiceCommandAction } from '@/functions/AnalizeVoiceComand';
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
    procedure: ProcedureModel | undefined;
    setProcedure: (procedure: ProcedureModel) => void
}

export const VoiceRecognitionContext = React.createContext<VoiceRecognitionContextDataType>({

    recognized: '',
    isListening: false,
    results: [],
    started: '',
    startRecognizing: () => { },
    stopRecognizing: () => { },
    procedure: undefined,
    setProcedure: (procedure: ProcedureModel | undefined) => { }

})

export const useVoiceRecognitionContext = () => {
    return useContext(VoiceRecognitionContext)
}

const VoiceRecognitionProvider: FC<Props> = ({ children }) => {

    const [recognized, setRecognized] = useState('');
    const [started, setStarted] = useState('');
    const [results, setResults] = useState<string[] | []>([]);
    const [isListening, setisListening] = useState(false);
    const [procedure, setProcedure] = useState<ProcedureModel>()

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
            if (isListening || !available) { return }
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
        const voiceAnalysisResult: VoiceAnalysisResult | undefined = analizeVoice(results)

        if (voiceAnalysisResult) {
            console.log('response from analizeVoice', voiceAnalysisResult)
        }
        else {
            console.error('no response from analizeVoice')
            return
        }

        if (!procedure) {
            console.error('No se ha detectado un procedimiento')
            return
        }

        if (!procedure.tasks) {
            console.error('No se ha detectado una lista de tareas en el procedimiento actual')
            return
        }

        const TaskListNames = procedure.tasks.map((item: TaskModel) => {
            return item.taskName
        })
        const taskFound = findTask(TaskListNames, voiceAnalysisResult.task);

        if (!taskFound) {
            console.error('No se ha encontrado la tarea')
            return
        }

        const setTaskStatus = (taskFound: string, done: boolean) => {
            setProcedure((prevProcedure: any) => {
                return {
                    ...prevProcedure,
                    tasks: prevProcedure.tasks.map((task: TaskModel) =>
                        task.taskName === taskFound
                            ? { ...task, done: done }
                            : task
                    )
                }

            });
        };

        const dispatchVoiceCommand = (voiceAnalysisResult: VoiceAnalysisResult, taskFound: string) => {


            switch (voiceAnalysisResult.commandAction) {
                case VoiceCommandAction.Mark:
                    setTaskStatus(taskFound, true)
                    break;
                case VoiceCommandAction.Unmark:
                    setTaskStatus(taskFound, false)
                    break;
                case VoiceCommandAction.Read:
                    //TODO: Implementar lectura de tareas
                    console.log('Read command')
                    break;
                default:
                    console.error('Comando no reconocido')
            }
        }


        dispatchVoiceCommand(voiceAnalysisResult, taskFound)

    }, [results])

    const value = useMemo(
        () => ({ startRecognizing, stopRecognizing, setProcedure, recognized, results, started, isListening, procedure }),
        [startRecognizing, stopRecognizing, setProcedure, recognized, results, started, isListening, procedure]
    )
    return (
        <VoiceRecognitionContext.Provider value={value}>
            {children}
        </VoiceRecognitionContext.Provider>
    )
}

export default VoiceRecognitionProvider