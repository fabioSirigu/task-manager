import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Titolo Obbligatorio"),
  description: z.string().min(1, "Descrizione obbligatoria"),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]),
});

export const fullTaskSchema = createTaskSchema.extend({
  id: z.number(),
});

export type Task = z.infer<typeof fullTaskSchema>;
export type NewTask = z.infer<typeof createTaskSchema>;
