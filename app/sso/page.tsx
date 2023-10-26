import React from "react";
import LoginForm from "@/components/login-form";
import SSOCover from "@/providers/sso-provider";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/core";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
  authToken: string; // Add authToken prop
};

const SSOPage = (props: Props) => {
  const cookie = cookies();
  const authToken = cookie.get(AUTH_COOKIE);

  console.log(props.authToken);
  // const authToken = getCookie("__SecureAuth");

  return (
    <SSOCover authToken={authToken?.value}>
      <LoginForm />
    </SSOCover>
  );
};

export default SSOPage;
