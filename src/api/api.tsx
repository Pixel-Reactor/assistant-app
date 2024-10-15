import taklist from '@/mock-data/tasklist.json'
import { TaskModel } from '@/models/TaskModel'

const getTasks = async () => {
    return taklist as TaskModel[]
}

export {
    getTasks
}