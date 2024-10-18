import { ProcedureModel } from '@/models/ProcedureModel';
import { analizeVoice, VoiceAnalysisResult, VoiceCommandAction } from '@/functions/AnalizeVoiceComand';
import { findTask } from '@/functions/FindTask';
import { TaskModel } from '@/models/TaskModel';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import React, { FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import * as Speech from 'expo-speech';

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
    assistedListCheck: () => void
}

export const VoiceRecognitionContext = React.createContext<VoiceRecognitionContextDataType>({

    recognized: '',
    isListening: false,
    results: [],
    started: '',
    startRecognizing: () => { },
    stopRecognizing: () => { },
    procedure: undefined,
    setProcedure: (procedure: ProcedureModel | undefined) => { },
    assistedListCheck: () => { }
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
    const [automatedCheckList, setautomatedCheckList] = useState(false)

    const language = 'es-ES'

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
    }, [automatedCheckList])

    const destroyVoice = async () => {
        await Voice.destroy();
        await Voice.stop()
    }
    const startRecognizing = async () => {
        try {
            const available = await Voice.isAvailable();
            console.log('Voice Available?', available)
            if (isListening || !available) { return }
            await Voice.start(language);
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

        if(voiceAnalysisResult.commandActionOptions?.minTaskLength&&voiceAnalysisResult.task.length<voiceAnalysisResult.commandActionOptions?.minTaskLength){
            console.warn('No se ha detectado una tarea valida: ' +voiceAnalysisResult.task)
            return
        }

        const taskFound = findTask(TaskListNames, voiceAnalysisResult.task);

        if (!taskFound) {
            console.error('No se ha encontrado la tarea')
            return
        }



        const dispatchVoiceCommand = (voiceAnalysisResult: VoiceAnalysisResult, taskFound: string) => {
            if (automatedCheckList) { return }

            switch (voiceAnalysisResult.commandAction) {
                case VoiceCommandAction.Mark:
                    setTaskStatus(taskFound, true)
                    break;
                case VoiceCommandAction.Unmark:
                    setTaskStatus(taskFound, false)
                    break;
                case VoiceCommandAction.Check:
                    assistedListCheck()
                    break;
                default:
                    console.error('Comando no reconocido')
            }
        }


        dispatchVoiceCommand(voiceAnalysisResult, taskFound)

    }, [results])

    const assistedListCheck = () => {

        const waitForVoiceResponse = () => {
            return new Promise<SpeechResultsEvent>(async (resolve, reject) => {
                // Inicia el reconocimiento de voz
                Voice.onSpeechResults = async (result) => {
                    console.log('speech results bucle')
                    await Voice.stop();
                    setisListening(false);
                    // console.log('Reconocimiento de voz detenido. Resultado:', result);
                    resolve(result)
                }
                Voice.onSpeechError = (e) => {
                  console.log('speech error bucle',e)
                  Voice.destroy();
                  Voice.stop();
                  resolve({value:'no'})
                }
                Voice.onSpeechEnd=()=>{
                    console.log('speech end bucle')
                }
                await Voice.start(language);
                setisListening(true);
            });
        };

        const runLoop = async () => {

            if (!procedure || !procedure?.tasks) { return }

            setautomatedCheckList(true)
            for (let i = 0; i < procedure.tasks.length; i++) {
                console.log(`Has completado la tarea: ${procedure.tasks[i].taskName}?`);

                // Espera a que el texto se haya hablado antes de iniciar el reconocimiento de voz
                await new Promise(resolve => {
                    Speech.speak(`Has completado la tarea: ${procedure.tasks[i].taskName}`, {
                        onDone:resolve
                    });
                });


                const userResponse:SpeechResultsEvent = await waitForVoiceResponse();
                
                console.log('respuesta del usuario',userResponse)
                if (userResponse.value && (userResponse?.value[0].includes('sí') || userResponse?.value[0].includes('si'))) {

                    console.log(`Marcando la tarea ${procedure.tasks[i]} como completada.`);
                    await new Promise(resolve => {
                        Speech.speak(`Marcando si`, {
                            onDone:resolve
                        });
                    });
                    setTaskStatus(procedure.tasks[i].taskName, true);
                } else {
                    console.log(`La tarea ${procedure.tasks[i].taskName} no fue marcada como completada.`);
                    await new Promise(resolve => {
                        Speech.speak(`Marcando no `, {
                            onDone:resolve
                        });
                    });
                }
            }

            console.log("Bucle completado");
            setautomatedCheckList(false)
        };

        runLoop();

    };

    const value = useMemo(
        () => ({ startRecognizing, stopRecognizing, setProcedure, recognized, results, started, isListening, procedure, assistedListCheck }),
        [startRecognizing, stopRecognizing, setProcedure, recognized, results, started, isListening, procedure, assistedListCheck]
    )
    return (
        <VoiceRecognitionContext.Provider value={value}>
            {children}
        </VoiceRecognitionContext.Provider>
    )
}

export default VoiceRecognitionProvider