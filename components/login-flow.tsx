import React from "react";
import LoginStepForm from "./login-form";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
const LoginAuthFlow = (props: Props) => {
  const searchParams = props.searchParams;
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className=" border-2  rounded-lg">
        <div className="flex border-b-2 p-2 justify-between">
          <div className="flex flex-row">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-door-open m-1"
                viewBox="0 0 16 16"
              >
                <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
                <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-800 text-left ">
              Sign with GateSync
            </span>
          </div>
          <div>
            <span>v1</span>
          </div>
        </div>
        <div className="w-full h-full">
          <div className="text-center m-2 font-bold text-xl text-gray-800 font-sans">
            Login To Your Account
          </div>
          <LoginStepForm searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
};

export default LoginAuthFlow;
