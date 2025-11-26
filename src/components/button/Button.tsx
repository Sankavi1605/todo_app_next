import { buttonProps } from "@/types";
import clsx from "clsx";

const Button = ({
  type,
  text,
  onClick,
  actionButton,
  bgColor,
  disabled,
  className,
  ...props
}: buttonProps) => {
  return (
    <div>
      <button
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={clsx(
          actionButton &&
            "text-white hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none",
          bgColor
            ? `${bgColor} hover:${bgColor} font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none`
            : "font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none",
          disabled && "opacity-60 cursor-not-allowed",
          className,
        )}
        {...props}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
