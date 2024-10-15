export const AnalizeVoice = (voicetext: string[]) => {

    if (voicetext === undefined) {
        console.log('no hay voice text')
        return
    }
    if (!voicetext || !voicetext.length) {
        console.log('voice input not detected')
        return
    }

    let command 
    let tasknamedetected


    const voicetextInput = voicetext[0] || ''
    // console.log('voice text input', voicetextInput)
    const commandMark = 'marca'
    const commandUnmark = 'desmarca'
    const task = 'tarea'

    const indexCommandMark = voicetextInput.indexOf(commandMark);
    const indexCommandUnmark = voicetextInput.indexOf(commandUnmark);
    const indextaskCommand = voicetextInput.indexOf(task)

    if (indextaskCommand) {
        const TaskName = voicetextInput.slice(indextaskCommand + 1);
        tasknamedetected = TaskName
        // console.log('task found', TaskName)
    }
    indexCommandMark > indexCommandUnmark ? command = 'check' : 'uncheck'

    // console.log('voiceText', voicetext[0])
    // console.log('indices de comando y tarea', indexCommandMark, indextaskCommand)

    return {
        command: command,
        task: tasknamedetected
    }

}