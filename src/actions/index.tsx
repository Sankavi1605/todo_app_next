"use server";

import { prisma } from "@/utils/prisma";
import { getCurrentSession } from "@/utils/auth";
import { ensureTodoPermission, Role } from "@/utils/rbac";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await getCurrentSession();
  const user = session?.user as Record<string, any> | undefined;
  if (!user?.id) {
    throw new Error("You must be signed in to continue.");
  }

  return {
    id: user.id as string,
    role: (user.role || "USER") as Role,
  };
}

export async function createTodo(formData: FormData) {
  const { id: userId } = await requireUser();
  const input = (formData.get("input") as string) ?? "";
  const title = input.trim();
  if (!title) {
    return;
  }

  await prisma.todo.create({
    data: {
      title,
      userId,
    },
  } as any);

  revalidatePath("/");
}

export async function changeStatus(formData: FormData) {
  const { id: userId, role } = await requireUser();
  const inputId = formData.get("inputId") as string;
  const todo = (await prisma.todo.findUnique({
    where: { id: inputId },
    select: { id: true, isCompleted: true, userId: true },
  } as any)) as { id: string; isCompleted: boolean; userId: string | null } | null;

  if (!todo) {
    throw new Error("Todo not found.");
  }

  ensureTodoPermission(role, userId, todo.userId ?? "", "toggle");

  await prisma.todo.update({
    where: { id: inputId },
    data: { isCompleted: !todo.isCompleted },
  } as any);

  revalidatePath("/");
}

export async function editTodo(formData: FormData) {
  const { id: userId, role } = await requireUser();
  const newTitle = (formData.get("newTitle") as string) ?? "";
  const title = newTitle.trim();
  if (!title) {
    return;
  }
  const inputId = formData.get("inputId") as string;

  const todo = (await prisma.todo.findUnique({
    where: { id: inputId },
    select: { id: true, userId: true },
  } as any)) as { id: string; userId: string | null } | null;

  if (!todo) {
    throw new Error("Todo not found.");
  }

  ensureTodoPermission(role, userId, todo.userId ?? "", "edit");

  await prisma.todo.update({
    where: { id: inputId },
    data: { title },
  } as any);

  revalidatePath("/");
}

export async function deleteTodo(formData: FormData) {
  const { id: userId, role } = await requireUser();
  const inputId = formData.get("inputId") as string;

  const todo = (await prisma.todo.findUnique({
    where: { id: inputId },
    select: { id: true, userId: true },
  } as any)) as { id: string; userId: string | null } | null;

  if (!todo) {
    throw new Error("Todo not found.");
  }

  ensureTodoPermission(role, userId, todo.userId ?? "", "delete");

  await prisma.todo.delete({
    where: { id: inputId },
  });

  revalidatePath("/");
}
