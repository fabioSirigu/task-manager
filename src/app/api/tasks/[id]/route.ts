// app/api/tasks/[id]/route.ts
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { createTaskSchema } from "@/lib/validation/task"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID non valido" }, { status: 400 })
  }

  const body = await req.json()
  const parsed = createTaskSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("❌ Errore nella PUT:", error)
    return NextResponse.json({ error: "Task non trovato o errore interno" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID non valido" }, { status: 400 })
  }

  try {
    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ message: "Task eliminato con successo" })
  } catch (error) {
    console.error("❌ Errore nella DELETE:", error)
    return NextResponse.json({ error: "Task non trovato o errore interno" }, { status: 500 })
  }
}
