'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createTaskSchema, fullTaskSchema, NewTask, Task } from '@/lib/validation/task';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface TaskFormProps {
  onAddTask: (task: NewTask) => void;
  onUpdateTask?: (task: Task) => void;
  initialData?: Task | null;
  onCancelEdit?: () => void;
}

export const TaskForm = ({ onAddTask, onUpdateTask, initialData, onCancelEdit }: TaskFormProps) => {
  const [formData, setFormData] = useState<NewTask>({
    title: '',
    description: '',
    status: 'PENDING',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Task, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: '', description: '', status: 'PENDING' });
    }
  }, [initialData]);

  const handleChange = (field: keyof Task, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (initialData) {
      const taskToUpdate = { ...formData, id: initialData.id };

      const result = fullTaskSchema.safeParse(taskToUpdate);

      if (!result.success) {
        console.error(result.error);
        return;
      }

      onUpdateTask?.(result.data);
    } else {
      const result = createTaskSchema.safeParse(formData);

      if (!result.success) {
        console.error(result.error);
        return;
      }

      onAddTask(result.data);
    }

    setFormData({ title: '', description: '', status: 'PENDING' });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <Input
        placeholder="Titolo"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

      <Textarea
        placeholder="Descrizione - (Opzionale)"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />

      <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Stato" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">In attesa</SelectItem>
          <SelectItem value="IN_PROGRESS">In corso</SelectItem>
          <SelectItem value="DONE">Completato</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button type="submit">{initialData ? 'Salva modifiche' : 'Aggiungi Task'}</Button>
        {initialData && (
          <Button type="button" variant="outline" onClick={onCancelEdit}>
            Annulla
          </Button>
        )}
      </div>
    </form>
  );
};
