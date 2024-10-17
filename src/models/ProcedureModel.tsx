import { TaskModel } from "@/models/TaskModel";

export interface ProcedureModel {
    procedureName: string,
    tasks: TaskModel[]
}