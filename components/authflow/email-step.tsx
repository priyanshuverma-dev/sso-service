import clsx from "clsx";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
interface IProps {
  id: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}
const EmailStep = (props: IProps) => {
  const { register, errors, disabled, id, required } = props;
  return (
    <div className="flex p-2 m-2 justify-center flex-col">
      <input
        placeholder="Email"
        type="email"
        {...register(id, { required })}
        className={clsx(
          `
          w-[300px] bg-gray-50 p-2 rounded-md border-2 outline-none transition-colors focus:border-blue-400`,
          errors[id] && "focus:ring-rose-500",
          disabled && "opacity-50 cursor-default"
        )}
      />
      <label htmlFor="email" className="p-1 text-sm">
        Email or Username
      </label>
      {errors[id]?.message && (
        <label htmlFor="email" className="p-1 text-sm text-red-600">
          {errors[id]?.message?.toString()}
        </label>
      )}
    </div>
  );
};

export default EmailStep;
