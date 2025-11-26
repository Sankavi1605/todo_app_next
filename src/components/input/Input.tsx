import { inputProps } from "@/types";
import clsx from "clsx";

const Input = ({ className, ...props }: inputProps) => {
  return (
    <div>
      <input
        {...props}
        className={clsx(
          "block w-full p-4 mx-2 border rounded-lg text-base bg-gray-700 border-gray-600 placeholder-gray-400 text-white",
          className,
        )}
      />
    </div>
  );
};

export default Input;
