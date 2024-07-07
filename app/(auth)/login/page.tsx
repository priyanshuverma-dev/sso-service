"use client";

import { LOGIN_API_ROUTE } from "@/app/api/auth/login/route";
import { ValidateEmail } from "@/lib/core";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <input
        className="auth-input"
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        disabled={loading}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="auth-input"
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        disabled={loading}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        className="p-4 border-2 rounded-md outline-none w-[50vw]"
        type="submit"
        disabled={loading}
        onClick={handleSubmit}
      >
        Login
      </button>

      <span>
        Don't have an account?{" "}
        <Link className="text-blue-500" href="/register">
          Register
        </Link>
      </span>
    </div>
  );
}
