"use client";
import clsx from "clsx";
import React, { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
interface IProps {
  id: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

const PasswordStep = (props: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, errors, disabled, id, required } = props;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex p-2 m-2 justify-center flex-col">
      <input
        {...register(id, { required })}
        className={clsx(
          `
        w-[300px] bg-gray-50 p-2 rounded-md border-2 outline-none transition-colors focus:border-blue-400`,
          errors[id] && "focus:ring-rose-500",
          disabled && "opacity-50 cursor-default"
        )}
        name="password"
        placeholder="Password"
        type={showPassword ? "text" : "password"} // Toggle input type
      />
      <label htmlFor="password" className="p-1 text-sm">
        Password
      </label>
      <div
        className="mt-2 p-1 text-blue-500 cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? "Hide" : "Show"} Password
      </div>
    </div>
  );
};

export default PasswordStep;
