import { findMostLikelyWord, getWordWithDistance } from "./FindTask"

const mark = ['marca', 'marcar', 'check', 'apunta', 'apuntar', 'selecciona', 'seleccionar']
const unmark = ['desmarca', 'desmarcar', 'uncheck', 'desapunta', 'desapuntar', 'deselecciona', 'deseleccionar']
const read = ['lee', 'leer', 'cuenta']
const check = ['comprobar','revisar']

/**
 * Cada comando de voz tiene asociado un conjunto de palabras que lo identifican
 * 1 Accion N palabras
 */
export enum VoiceCommandAction {
    Mark = 'mark',
    Unmark = 'unmark',
    Read = 'read',
    Check = 'check',
}

// Definir las palabras asociadas a cada comando de forma más compacta
const commandWordsGroups: { [key in VoiceCommandAction]: string[] } = {
    [VoiceCommandAction.Mark]: mark,
    [VoiceCommandAction.Unmark]: unmark,
    [VoiceCommandAction.Read]: read,
    [VoiceCommandAction.Check]: check
};

const getAllCommands = () => {
    return Object.values(commandWordsGroups).flat()
}

// Crear un diccionario dinámicamente a partir de los grupos de palabras
const commandWords: { [key: string]: VoiceCommandAction } = Object.entries(commandWordsGroups)
    .reduce((acc, [action, words]) => {
        words.forEach(word => acc[word] = action as VoiceCommandAction);
        return acc;
    }, {} as { [key: string]: VoiceCommandAction });

/**
 * Función para obtener el comando de voz asociado a una palabra.
 */
function getVoiceCommandAction(word: string): VoiceCommandAction | null {
    return commandWords[word] || null;
}


export interface VoiceAnalysisResult {
    commandAction: VoiceCommandAction,
    command: string,
    task: string
}


const getVoiceCommand = (voicetext: string) => {

    const allCommands = getAllCommands()
    const voiceWords = voicetext.split(' ')

    /**
     * De las palabras detectadas en el texto de voz, se obtiene la distancia de cada una de ellas con los comandos
     */
    const wordsWithDistance = voiceWords.map((text, i) => {
        return getWordWithDistance(allCommands, text)
    }).flat().sort((a, b) => a.distance - b.distance)
    console.log('wordsWithDistance', wordsWithDistance)

    const matchedWords = wordsWithDistance.filter((item) => {
        return item.distance == 0
    })

    if (matchedWords.length == 0) {

        if (wordsWithDistance.length > 0) {
            const commandFound = findMostLikelyWord(allCommands, wordsWithDistance[0].word)
            if (commandFound) {
                return commandFound
            }
        }
        else {
            //console.error('No se ha detectado un comando válido')
        }
    }
    else if (matchedWords.length == 1) {
        return matchedWords[0].keyword
    }
    else {
        console.error('Se ha detectado más de un comando válido')
        ///¿que hacemos en este caso ¿miramos cual se ha dicho antes?
    }

    return null
}

const getTaskName = (voicetext: string, command: string) => {

    //Split the voicetext by the command, so all the right part of the command must be the task name
    return voicetext.slice(voicetext.indexOf(command) + 1);

}

export const analizeVoice = (voicetext: string[]) => {

    if (voicetext === undefined) {
        console.log('no hay voice text')
        return
    }
    if (!voicetext || !voicetext.length) {
        console.log('voice input not detected')
        return
    }


    const voicetextInput = voicetext[0] || ''

    const command = getVoiceCommand(voicetextInput)

    console.log("command", command)

    if (!command) {
        console.error('No se ha detectado un comando válido')
        return
    }

    const tasknameDetected = getTaskName(voicetextInput, command)

    // console.log('voiceText', voicetext[0])
    // console.log('indices de comando y tarea', indexCommandMark, indextaskCommand)

    return {
        commandAction: getVoiceCommandAction(command),
        command: command,
        task: tasknameDetected
    } as VoiceAnalysisResult

}