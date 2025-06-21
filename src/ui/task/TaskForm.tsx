'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { Button } from '@/ui/button';
import { createTaskSchema, fullTaskSchema, NewTask, Task } from '@/lib/validation/task';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/ui/select';
import { useTranslations } from 'next-intl';

interface TaskFormProps {
  onAddTask: (task: NewTask) => void;
  onUpdateTask?: (task: Task) => void;
  initialData?: Task | null;
  onCancelEdit?: () => void;
}

export const TaskForm = ({ onAddTask, onUpdateTask, initialData, onCancelEdit }: TaskFormProps) => {
  const t = useTranslations('');

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
        const fieldErrors: Partial<Record<keyof Task, string>> = {};
        result.error.errors.forEach((err) => {
          const field = err.path[0] as keyof Task;
          fieldErrors[field] = err.message;
        });
        console.log('🚀 ~ handleSubmit ~ fieldErrors:', fieldErrors);
        setErrors(fieldErrors);
        return;
      }

      onUpdateTask?.(result.data);
    } else {
      const result = createTaskSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: Partial<Record<keyof Task, string>> = {};
        result.error.errors.forEach((err) => {
          const field = err.path[0] as keyof Task;
          fieldErrors[field] = err.message;
        });
        console.log('🚀 ~ handleSubmit ~ fieldErrors:', fieldErrors);
        setErrors(fieldErrors);
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
        placeholder={t(`home.form.title`)}
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />

      {errors.title && <p className="text-sm text-red-500">{t(`errors.${errors.title}`)}</p>}

      <Textarea
        placeholder={t(`home.form.description`)}
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />

      <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Stato" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">{t(`home.form.status.pending`)}</SelectItem>
          <SelectItem value="IN_PROGRESS">{t(`home.form.status.in_progress`)}</SelectItem>
          <SelectItem value="DONE">{t(`home.form.status.done`)}</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button type="submit">
          {t(initialData ? 'commons.buttons.save' : 'commons.buttons.addTask')}
        </Button>
        {initialData && (
          <Button type="button" variant="outline" onClick={onCancelEdit}>
            {t(`commons.buttons.cancel`)}
          </Button>
        )}
      </div>
    </form>
  );
};
