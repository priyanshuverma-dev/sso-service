"use client";

import { LOGIN_API_ROUTE } from "@/app/api/login/route";
import { BASE_PARAMS, ValidateEmail } from "@/lib/core";
import Link from "next/link";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import EmailStep from "./authflow/email-step";
import PasswordStep from "./authflow/password-step";
import { FORM_VALIDATE_API_ROUTE } from "@/app/api/sso/form/route";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import LastStep from "./authflow/last-step";

type Step = {
  id: number;
  component: React.ReactNode;
};

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
const LoginStepForm = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(false); // Add loading state
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const FormSteps: Step[] = [
    {
      id: 1,
      component: (
        <EmailStep
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          id="email"
        />
      ),
    },
    {
      id: 2,
      component: (
        <PasswordStep
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          id="password"
        />
      ),
    },
  ];

  const searchParams = props.searchParams;
  const [activeStep, setActiveStep] = React.useState(0);
  const router = useRouter();

  const handleNext: SubmitHandler<FieldValues> = async (data) => {
    try {
      if (activeStep == FormSteps.length) return;
      setIsLoading(true);

      // !Email
      if (activeStep == 0) {
        const res = await fetch(FORM_VALIDATE_API_ROUTE, {
          method: "POST",
          body: JSON.stringify({
            type: "email",
            field: data.email,
            from: "login",
          }),
        });

        const payload = await res.json();

        if (res.status != 200) throw new Error(`email__${payload.message}`);

        console.log(data);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      // !Password
      if (activeStep === 1) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      // !Submission
      if (activeStep === FormSteps.length - 1) {
        if (!data.email) {
          setActiveStep(0);
        }

        if (!data.password) {
          setActiveStep(1);
        }

        const user = {
          email: data.email,
          password: data.password,
        };
        const res = await fetch(LOGIN_API_ROUTE, {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const body = await res.json();
        console.log(body);
        if (res.status !== 200) {
          throw new Error(`password__${body.message}`);
        }
        toast.success("User LoggedIn!");
      }
    } catch (error: any) {
      console.log(` %c USER_LOGIN_CLIENT_SSO: ${error}`, "color: yellow");
      const des = error.message.split("__");
      if (des[0] === "email") {
        setError("email", {
          message: des[1],
        });
        toast.error(des[1]);
      }
      if (des[0] === "password") {
        setActiveStep(1);
        setError("password", {
          message: des[1],
        });
        toast.error(des[1]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (activeStep == 0) {
      router.push(`/sso/authflow/signup?${BASE_PARAMS(searchParams)}`);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <form onSubmit={handleSubmit(handleNext)}>
      <div className="m-2 h-full flex flex-col items-center justify-center">
        {FormSteps[activeStep] === undefined && (
          <div className="flex items-center">
            <Skeleton className="h-10 w-[250px]" />
          </div>
        )}
        {FormSteps[activeStep]?.component}

        <div className="flex justify-between flex-row items-center w-full m-12 ">
          <button
            onClick={handleBack}
            type="button"
            className={`text-blue-600 hover:bg-blue-50 transition-colors bg-opacity-5 p-2 rounded-md `}
          >
            {activeStep === 0 ? "Create New" : "Back"}
          </button>

          <button
            type="submit"
            disabled={isLoading} // Disable button when loading
            className={`${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            } text-white bg-blue-500 transition-colors hover:bg-blue-600 p-2 px-3 rounded-md`}
          >
            {isLoading
              ? "Loading..."
              : activeStep === FormSteps.length - 1
              ? "Submit"
              : "Next"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginStepForm;
