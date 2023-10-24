"use client";
import React, { useState } from "react";
import { REGISTER_API_ROUTE } from "../api/register/route";
import toast from "react-hot-toast";
import Link from "next/link";
import { ValidateEmail } from "@/lib/core";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) return;

    const validateEmail = ValidateEmail(email);
    if (!validateEmail.status) {
      toast.error(validateEmail.message);
      return;
    }

    const user = {
      name,
      email,
      password,
    };
    try {
      const res = await fetch(REGISTER_API_ROUTE, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();
      console.log(body);
      if (res.status !== 200) {
        throw new Error(body.message);
      }
      toast.success("User Created!");
    } catch (error: any) {
      console.log(` %c USER_REGISTER_CLIENT: ${error}`, "color: yellow");
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen space-y-4 ">
      <input
        className="p-4 border-2 m-2 rounded-md outline-none"
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        className="p-4 border-2 m-2 rounded-md outline-none"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="p-4 border-2 m-2 rounded-md outline-none"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button
        className="p-4 border-2 m-2 rounded-md outline-none "
        type="submit"
        onClick={handleSubmit}
      >
        Create User
      </button>
      <Link
        href={"/login"}
        className="text-xs hover:underline"
        onClick={() => {}}
      >
        Go Login
      </Link>
    </div>
  );
};

export default RegisterPage;
