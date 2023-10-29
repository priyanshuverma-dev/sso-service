import RegisterAuthFlow from "@/components/register-flow";
import { AUTH_COOKIE } from "@/lib/core";
import SSOCover from "@/providers/sso-provider";
import { cookies } from "next/headers";
import React from "react";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
const CreateAccountPage = (props: Props) => {
  const cookie = cookies();
  const authToken = cookie.get(AUTH_COOKIE);
  const searchParams = props.searchParams;
  return <RegisterAuthFlow searchParams={searchParams} />;
};

export default CreateAccountPage;
