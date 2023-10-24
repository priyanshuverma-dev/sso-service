"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { AUTH_COOKIE, ValidateEmail } from "@/lib/core";
import { LOGIN_API_ROUTE } from "../api/login/route";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async () => {
    if (!email || !password) return;

    const validateEmail = ValidateEmail(email);
    if (validateEmail.status === false) {
      toast.error(validateEmail.message);
      return;
    }

    const user = {
      email,
      password,
    };
    try {
      const res = await fetch(LOGIN_API_ROUTE, {
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
      toast.success("User LoggedIn!");
      window.location.reload();
    } catch (error: any) {
      console.log(` %c USER_LOGIN_CLIENT: ${error}`, "color: yellow");
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen space-y-4 ">
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
        Login
      </button>
      <Link href={"/register"} className="text-xs hover:underline">
        Go Register
      </Link>
    </div>
  );
};

export default LoginPage;
