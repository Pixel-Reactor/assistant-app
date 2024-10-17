import procedure from '@/mock-data/procedure.json'
import { ProcedureModel } from '@/models/ProcedureModel'

const getProcedure = async () => {
    return procedure as ProcedureModel
}

export {
    getProcedure
}
