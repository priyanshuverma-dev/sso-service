// "use client";
import { AUTH_COOKIE, ValidateEmail } from "@/lib/core";
import { redirect, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { SSO_API_ROUTE } from "../api/sso/route";
import { getCookie, getCookies } from "cookies-next";
import Link from "next/link";
import toast from "react-hot-toast";
import { LOGIN_API_ROUTE } from "../api/login/route";
import { cookies } from "next/headers";
import LoginForm from "@/components/login-form";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const SSOPage = (props: Props) => {
  const cookie = cookies(); // => 'value'
  const searchParams = props.searchParams;
  const clientId = searchParams.clientId;
  const next = searchParams.next;
  const clientSecret = searchParams.clientSecret;
  const callback = searchParams.callback;

  const authToken = cookie.get(AUTH_COOKIE);

  if (authToken) {
    fetch(SSO_API_ROUTE, {
      method: "POST",
      body: JSON.stringify({
        domain: next,
        clientId,
        token: authToken.value,
      }),
    }).then(async (res) => {
      const body = await res.json();
      if (res.status === 200) {
        console.log(body);
      }
      console.log(body);
    });

    // redirect(`${callback}?code=`);
  }

  return <LoginForm />;
};

export default SSOPage;
