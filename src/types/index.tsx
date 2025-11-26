import {
  ButtonHTMLAttributes,
  FormHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { TodoPermissions } from "@/utils/rbac";

export interface inputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type: string;
}

export interface formProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  action: (formData: FormData) => void | Promise<void>;
}

export interface buttonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string | ReactNode;
  actionButton?: boolean;
  bgColor?: string;
}

export interface todoProps {
  id: string;
  title?: string | null;
  isCompleted: boolean;
  createdAt?: Date;
  userId: string | null;
  ownerEmail?: string | null;
  permissions: TodoPermissions;
  isOwner: boolean;
}
