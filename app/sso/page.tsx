import React from "react";
import SSOCover from "@/providers/sso-provider";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/core";
import AuthFlow from "@/components/auth-flow";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const SSOPage = (props: Props) => {
  const cookie = cookies();
  const authToken = cookie.get(AUTH_COOKIE);
  const searchParams = props.searchParams;

  return (
    <SSOCover authToken={authToken?.value}>
      <AuthFlow searchParams={searchParams} />
    </SSOCover>
  );
};

export default SSOPage;
