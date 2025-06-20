'use client';

import { useEffect, useState } from 'react';
import { TaskForm } from '@/components/task/TaskForm';
import { TaskList } from '@/components/task/TaskList';
import { Task } from '@/lib/validation/task';
import { UserNav } from '@/components/ui/login';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data);
  };

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
    } else {
      const err = await res.json();
      console.error('Errore POST:', err);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    if (editingIndex === null) return;
    const id = tasks[editingIndex].id;

    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });

    if (res.ok) {
      const saved = await res.json();
      setTasks((prev) => prev.map((task, i) => (i === editingIndex ? saved : task)));
      setEditingIndex(null);
    } else {
      console.error('Errore durante l’aggiornamento', await res.json());
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleDelete = async (index: number) => {
    const taskToDelete = tasks[index];
    if (!taskToDelete) return;

    const res = await fetch(`/api/tasks/${taskToDelete.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setTasks((prev) => prev.filter((_, i) => i !== index));
      if (editingIndex === index) setEditingIndex(null);
    } else {
      const err = await res.json();
      console.error('Errore DELETE:', err);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <UserNav />
      <h1 className="text-2xl font-bold mb-4">La tua To-Do List</h1>

      <TaskForm
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        initialData={editingIndex !== null ? tasks[editingIndex] : null}
        onCancelEdit={() => setEditingIndex(null)}
      />

      <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
    </main>
  );
}
