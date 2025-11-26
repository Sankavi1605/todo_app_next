import { todoProps } from "@/types";

import ChangeTodo from "./ChangeTodo";
import EditTodo from "./EditTodo";
import DeleteTodo from "./DeleteTodo";

const Todo = ({ todo }: { todo: todoProps }) => {
  const todoStyle = {
    textDecoration: todo.isCompleted ? "line-through" : "none",
    opacity: todo.isCompleted ? 0.5 : 1,
  };

  const ownerLabel = todo.isOwner ? "Assigned to you" : `Owner: ${todo.ownerEmail}`;

  return (
    <div
      style={todoStyle}
      className="w-10/12 mx-auto flex items-center justify-between bg-slate-900 py-4 px-6 rounded-2xl"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <ChangeTodo todo={todo} />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-bold uppercase">{todo.title}</span>
          <span className="text-xs text-slate-400 truncate">{ownerLabel}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <EditTodo todo={todo} />
        <DeleteTodo todo={todo} />
      </div>
    </div>
  );
};

export default Todo;
