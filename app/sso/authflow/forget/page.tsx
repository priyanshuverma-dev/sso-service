import ForgetPasswordFlow from "@/components/forget-password-flow";
import React from "react";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
const ForgetPasswordPage = (props: Props) => {
  const searchParams = props.searchParams;
  return <ForgetPasswordFlow searchParams={searchParams} />;
};

export default ForgetPasswordPage;
