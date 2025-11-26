"use client";

import * as actions from "@/actions";
import Form from "../form/Form";
import Input from "../input/Input";
import Button from "../button/Button";
import { useState } from "react";
import { todoProps } from "@/types";
import { MdEdit } from "react-icons/md";

const EditTodo = ({ todo }: { todo: todoProps }) => {
  const [editTodoState, setEditTodoState] = useState(false);
  const canEdit = todo.permissions.canEdit && !todo.isCompleted;
  const disabledTitle = !todo.permissions.canEdit
    ? "You can only edit your own todos."
    : todo.isCompleted
      ? "Completed todos cannot be edited."
      : undefined;

  const handleEdit = () => {
    if (!canEdit) {
      return;
    }
    setEditTodoState((prev) => !prev);
  };

  const handleSubmit = () => {
    setEditTodoState(false);
  };

  return (
    <div className="flex gap-5 items-center">
      <Button
        onClick={handleEdit}
        text={<MdEdit />}
        actionButton
        disabled={!canEdit}
        title={disabledTitle}
      />
      {editTodoState && canEdit ? (
        <Form action={actions.editTodo} onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input name="inputId" value={todo.id} type="hidden" readOnly />
          <div className="flex justify-center ">
            <Input type="text" name="newTitle" placeholder="Edit Todo..." required minLength={2} />
            <Button type="submit" text="save" bgColor="bg-emerald-500" />
          </div>
        </Form>
      ) : null}
    </div>
  );
};

export default EditTodo;
