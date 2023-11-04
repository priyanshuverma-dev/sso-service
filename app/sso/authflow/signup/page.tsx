import RegisterAuthFlow from "@/components/register-flow";
import React from "react";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
const CreateAccountPage = (props: Props) => {
  const searchParams = props.searchParams;
  return <RegisterAuthFlow searchParams={searchParams} />;
};

export default CreateAccountPage;
