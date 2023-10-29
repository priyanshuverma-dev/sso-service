import LoginAuthFlow from "@/components/login-flow";
import { AUTH_COOKIE } from "@/lib/core";
import SSOCover from "@/providers/sso-provider";
import { cookies } from "next/headers";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
const LoginForm = (props: Props) => {
  const cookie = cookies();
  const authToken = cookie.get(AUTH_COOKIE);
  const searchParams = props.searchParams;

  return (
    <SSOCover authToken={authToken?.value}>
      <LoginAuthFlow searchParams={searchParams} />;
    </SSOCover>
  );
};

export default LoginForm;
