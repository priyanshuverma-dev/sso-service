import React from "react";

const EmailStep = () => {
  return (
    <div className="flex p-2 m-2 justify-center flex-col">
      <input
        className="w-[300px] bg-gray-50 p-2 rounded-md border-2 outline-none transition-colors focus:border-blue-400"
        name="email"
        placeholder="Email"
        type="email"
      />
      <label htmlFor="email" className="p-1 text-sm">
        Email or Username
      </label>
    </div>
  );
};

export default EmailStep;
