import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Task } from '@/lib/validation/task';
import { useTranslations } from 'next-intl';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
  const t = useTranslations('commons.buttons');

  const statusClassMap: Record<Task['status'], string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 border border-blue-300',
    DONE: 'bg-green-100 text-green-800 border border-green-300',
  };
  return (
    <li className="p-4 border rounded-lg shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <Badge className={statusClassMap[task.status]}>{task.status}</Badge>
      </div>
      {task.description && <p className="text-sm text-gray-700">{task.description}</p>}
      <div className="flex gap-2 pt-2">
        <Button variant="secondary" onClick={onEdit}>
          {t('edit')}
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          {t('delete')}
        </Button>
      </div>
    </li>
  );
};
