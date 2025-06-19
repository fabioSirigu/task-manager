import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Task } from "./TaskForm"

interface TaskItemProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
}

export const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
  return (
    <li className="p-4 border rounded-lg shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <Badge variant="outline">{task.status}</Badge>
      </div>
      {task.description && (
        <p className="text-sm text-gray-700">{task.description}</p>
      )}
      <div className="flex gap-2 pt-2">
        <Button variant="secondary" onClick={onEdit}>
          Modifica
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Elimina
        </Button>
      </div>
    </li>
  )
}
