import { black, gray, white } from "@/constants/Colors"
import { TaskModel } from "@/models/TaskModel"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"

export interface ChecklistRowProps {
    task: TaskModel
    index: number
}

export const ChecklistRow = ({ task, index }: ChecklistRowProps) => {
    return (
        <View style={[styles.listRow, { backgroundColor: index % 2 === 0 ? white : gray }]}>
            <Text style={[styles.text]}>{task.taskName}</Text>

            {task.done ?
                <MaterialCommunityIcons name="checkbox-marked" size={24} color={black} /> :
                <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color={black} />
            }

        </View>
    )
}


const styles = StyleSheet.create({
    text: {
        fontFamily: 'Repsol-Regular',
        fontSize: 18,
        marginVertical: 10,
        padding: 10,
        borderRadius: 20,
        color: black,
        textAlign: 'left',
        maxWidth: '90%'
    },
    listRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 8
    }
});