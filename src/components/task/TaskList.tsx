import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Task } from "./TaskForm"

interface TaskListProps {
  tasks: Task[]
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

export const TaskList = ({ tasks, onEdit, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return <p className="text-gray-500">Nessun task ancora aggiunto.</p>
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task, index) => (
        <li key={index} className="p-4 border rounded-lg shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <Badge variant="outline">{task.status}</Badge>
          </div>
          {task.description && (
            <p className="text-sm text-gray-700">{task.description}</p>
          )}
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={() => onEdit(index)}>
              Modifica
            </Button>
            <Button variant="destructive" onClick={() => onDelete(index)}>
              Elimina
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
