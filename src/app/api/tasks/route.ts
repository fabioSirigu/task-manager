import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createTaskSchema } from '@/lib/validation/task';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Errore nel recupero dei task:', error);
    return new NextResponse('Errore del server', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = createTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ errors: result.error.flatten() }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: result.data,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Errore nella creazione del task:', error);
    return new NextResponse('Errore del server', { status: 500 });
  }
}
