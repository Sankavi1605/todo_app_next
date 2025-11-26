import { todoProps } from "@/types";
import React from "react";
import Form from "../form/Form";
import Input from "../input/Input";
import Button from "../button/Button";
import { FaTrash } from "react-icons/fa";

import * as actions from "@/actions";
const DeleteTodo = ({ todo }: { todo: todoProps }) => {
  const disabled = !todo.permissions.canDelete;
  const title = disabled
    ? "Only admins can delete other users' todos."
    : undefined;
  return (
    <Form action={actions.deleteTodo}>
      <Input type="hidden" name="inputId" value={todo.id} readOnly />
      <Button
        actionButton
        type="submit"
        bgColor="bg-red-400"
        text={<FaTrash />}
        disabled={disabled}
        title={title}
      />
    </Form>
  );
};

export default DeleteTodo;
