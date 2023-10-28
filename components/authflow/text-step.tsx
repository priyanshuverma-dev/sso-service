import React from "react";

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface IProps {
  label?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

const TextStep = (props: IProps) => {
  const {
    label,
    id,
    register,
    required,
    errors,
    type = "text",
    disabled,
  } = props;

  return (
    <div>
      <div className="flex p-2 m-2 justify-center flex-col">
        <input
          id={id}
          type={type}
          autoComplete={id}
          placeholder={label}
          disabled={disabled}
          {...register(id, { required })}
          className={clsx(
            `
            w-[300px] bg-gray-50 p-2 rounded-md border-2 outline-none transition-colors focus:border-blue-400`,
            errors[id] && "focus:ring-rose-500",
            disabled && "opacity-50 cursor-default"
          )}
        />
      </div>
    </div>
  );
};

export default TextStep;
