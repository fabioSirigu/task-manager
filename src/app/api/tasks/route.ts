import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]),
});

export async function GET() {
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = taskSchema.parse(json);

    const newTask = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const json = await request.json();
    const data = taskSchema.partial().parse(json); // partial per update parziale perchè magari sto aggiornando solo un valore e non tutti

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
