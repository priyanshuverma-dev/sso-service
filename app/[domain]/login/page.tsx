"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async () => {};

  return (
    <div className="flex items-center justify-center flex-col min-h-screen space-y-4 ">
      <button
        className="p-4 border-2 m-2 rounded-md outline-none "
        type="submit"
        onClick={handleSubmit}
      >
        Login
      </button>
      <Link href={"/register"} className="text-xs hover:underline">
        Go Register
      </Link>
    </div>
  );
};

export default LoginPage;
