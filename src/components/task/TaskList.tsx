import { Task } from "./TaskForm";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const TaskList = ({ tasks, onEdit, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return <p className="text-gray-500">Nessun task ancora aggiunto.</p>;
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task, index) => (
        <li key={index} className="p-4 border rounded-lg shadow-sm space-y-2">
          <TaskItem
            key={index}
            task={task}
            onEdit={() => onEdit(index)}
            onDelete={() => onDelete(index)}
          />
        </li>
      ))}
    </ul>
  );
};
