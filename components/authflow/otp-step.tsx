import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import OtpInput from "react-otp-input";
import React from "react";

interface IProps {
  id: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  onChange: (otp: string) => void;
}

const OtpStep = (props: IProps) => {
  const { register, errors, disabled, id, required, onChange } = props;

  return (
    <div className="flex p-2 m-2 justify-center flex-col">
      <OtpInput
        {...register(id, { required })}
        onChange={onChange}
        numInputs={6}
        inputType="text"
        inputStyle="inputStyle"
        renderInput={(props) => <input {...props} />}
        containerStyle={``}
        shouldAutoFocus
      />
      <label htmlFor="otp" className="p-1 text-sm">
        Verification Code
      </label>
      {errors[id]?.message && (
        <label htmlFor="otp" className="p-1 text-sm text-red-600">
          {errors[id]?.message?.toString()}
        </label>
      )}
    </div>
  );
};

export default OtpStep;
