import React from "react";

interface IProps {
  name: string;
  placeholder: string;
  type?: string | "text";
  label?: string;
}

const TextStep = (props: IProps) => {
  return (
    <div className="flex p-2 m-2 justify-center flex-col">
      <input
        className="w-[300px] bg-gray-50 p-2 rounded-md border-2 outline-none transition-colors focus:border-blue-400"
        name={props.name}
        placeholder={props.placeholder}
        type={props.type}
      />
      <label htmlFor={props.name} className="p-1 text-sm">
        {props.label}
      </label>
    </div>
  );
};

export default TextStep;
