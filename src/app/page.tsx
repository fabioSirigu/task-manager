"use client"

import { useState } from "react"
import { TaskForm, Task } from "@/components/task/TaskForm"
import { TaskList } from "@/components/task/TaskList"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task])
  }

  const handleUpdateTask = (updatedTask: Task) => {
    if (editingIndex === null) return
    setTasks((prev) =>
      prev.map((task, i) => (i === editingIndex ? updatedTask : task))
    )
    setEditingIndex(null)
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
  }

  const handleDelete = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index))
    if (editingIndex === index) setEditingIndex(null)
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">La tua To-Do List</h1>

      <TaskForm
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        initialData={editingIndex !== null ? tasks[editingIndex] : null}
        onCancelEdit={() => setEditingIndex(null)}
      />

      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  )
}
