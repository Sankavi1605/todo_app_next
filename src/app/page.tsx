import { redirect } from "next/navigation";
import AddTodo from "@/components/todos/AddTodo";
import Todo from "@/components/todos/Todo";
import SignOutButton from "@/components/auth/SignOutButton";
import { getCurrentSession } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import {
  canViewAllTodos,
  describeRole,
  getTodoPermissions,
  Role,
} from "@/utils/rbac";

export const dynamic = "force-dynamic";

async function getData({ role, userId }: { role: Role; userId: string }) {
  const where = canViewAllTodos(role)
    ? {}
    : {
        userId,
      };

  const data = await prisma.todo.findMany({
    where,
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data.map((todo) => ({
    id: todo.id,
    title: todo.title,
    isCompleted: todo.isCompleted,
    createdAt: todo.createdAt,
    userId: todo.userId ?? null,
    ownerEmail: todo.user?.email ?? (todo.userId ? "No owner assigned" : "Unassigned"),
    permissions: getTodoPermissions(role, userId, todo.userId ?? ""),
    isOwner: todo.userId === userId,
  }));
}

export default async function Home() {
  const session = await getCurrentSession();
  if (!session?.session || !session?.user) {
    redirect("/login");
  }
  const role = (session.user.role || "USER") as Role;
  const userId = session.user.id as string;
  const data = await getData({ role, userId });
  return (
    <div className=" w-screen py-20 flex justify-center flex-col items-center">
      <div className="flex w-full max-w-3xl items-center justify-between px-6">
        <div>
          <span className="text-4xl font-extrabold uppercase">Todo App</span>
          <p className="mt-2 text-sm text-slate-400">
            You are signed in as <strong>{describeRole(role)}</strong>
          </p>
        </div>
        <SignOutButton />
      </div>
      <div className="flex justify-center flex-col items-center">
        <AddTodo />

        <div className="flex flex-col gap-5 items-center justify-center mt-10 w-screen">
          {data.map((todo, id) => (
            <div className="w-full" key={id}>
              <Todo todo={todo} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
