"use client";

import React, { useState } from "react";

const PasswordStep = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex p-2 m-2 justify-center flex-col">
      <input
        className="w-[300px] bg-gray-50 p-2 rounded-md border-2 outline-none transition-colors focus:border-blue-400"
        name="password"
        placeholder="Password"
        type={showPassword ? "text" : "password"} // Toggle input type
      />
      <label htmlFor="password" className="p-1 text-sm">
        Password
      </label>
      <button
        className="mt-2 p-1 text-blue-500 cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? "Hide" : "Show"} Password
      </button>
    </div>
  );
};

export default PasswordStep;
