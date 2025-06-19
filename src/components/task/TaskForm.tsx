"use client"

import { useState } from "react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

const taskSchema = z.object({
  title: z.string().min(1, "Il titolo è obbligatorio"),
  description: z.string().optional(),
  status: z.enum(["pending", "in progress", "done"]),
})

type Task = z.infer<typeof taskSchema>

interface TaskFormProps {
  onAddTask: (task: Task) => void
}

export const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [formData, setFormData] = useState<Task>({
    title: "",
    description: "",
    status: "pending",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof Task, string>>>({})

  const handleChange = (field: keyof Task, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = taskSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof Task, string>> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof Task
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    onAddTask(result.data)
    setFormData({ title: "", description: "", status: "pending" })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <Input
          placeholder="Titolo"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>
      <div>
        <Textarea
          placeholder="Descrizione (opzionale)"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
      <div>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">In attesa</SelectItem>
            <SelectItem value="in progress">In corso</SelectItem>
            <SelectItem value="done">Completato</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Aggiungi Task</Button>
    </form>
  )
}
