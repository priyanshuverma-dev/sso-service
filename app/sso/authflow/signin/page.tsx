import LoginAuthFlow from "@/components/login-flow";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
const LoginForm = (props: Props) => {
  const searchParams = props.searchParams;
  return <LoginAuthFlow searchParams={searchParams} />;
};

export default LoginForm;
