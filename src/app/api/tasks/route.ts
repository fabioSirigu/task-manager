import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]),
  })

export async function GET() {
  const tasks = await prisma.task.findMany()
  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
    try {
      const json = await request.json()
      const data = taskSchema.parse(json)
  
      const newTask = await prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
        },
      })
  
      return NextResponse.json(newTask, { status: 201 })
    } catch (error) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }
  }
