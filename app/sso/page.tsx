import React from "react";
import SSOCover from "@/providers/sso-provider";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/core";
import AuthFlow from "@/components/auth-flow";

const SSOPage = () => {
  const cookie = cookies();
  const authToken = cookie.get(AUTH_COOKIE);

  return (
    <SSOCover authToken={authToken?.value}>
      <AuthFlow />
    </SSOCover>
  );
};

export default SSOPage;
