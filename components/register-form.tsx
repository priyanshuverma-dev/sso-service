"use client";

import React from "react";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FORM_VALIDATE_API_ROUTE } from "@/app/api/sso/form/route";
import toast from "react-hot-toast";
import { REGISTER_API_ROUTE } from "@/app/api/register/route";
import TextStep from "./authflow/text-step";
import EmailStep from "./authflow/email-step";
import PasswordStep from "./authflow/password-step";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { BASE_PARAMS } from "@/lib/core";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
type Step = {
  id: number;
  component: React.ReactNode;
};

const RegisterStepForm = (props: Props) => {
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
        <TextStep
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          id="name"
          label="Name"
        />
      ),
    },
    {
      id: 2,
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
      id: 3,
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
      // !Name
      if (activeStep === 0) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      // !Email
      if (activeStep == 1) {
        const res = await fetch(FORM_VALIDATE_API_ROUTE, {
          method: "POST",
          body: JSON.stringify({
            type: "email",
            field: data.email,
            from: "register",
          }),
        });

        const payload = await res.json();

        if (res.status != 200) throw new Error(`email__${payload.message}`);

        console.log(data);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

        // data.name
      }

      // !Password
      if (activeStep === 2) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      // !Submission
      if (activeStep === FormSteps.length - 1) {
        if (!data.name) {
          setActiveStep(0);
        }

        if (!data.email) {
          setActiveStep(1);
        }

        if (!data.password) {
          setActiveStep(2);
        }

        const user = {
          name: data.name,
          email: data.email,
          password: data.password,
        };
        const res = await fetch(REGISTER_API_ROUTE, {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const body = await res.json();
        console.log(body);
        if (res.status !== 200) {
          throw new Error(`server__${body.message}`);
        }
        toast.success("User Created!");
        router.push(`/sso/authflow/signin?${BASE_PARAMS(searchParams)}`);
      }
      console.log(data);
    } catch (error: any) {
      console.log(` %c USER_REGISTER_CLIENT_SSO: ${error}`, "color: yellow");
      const des = error.message.split("__");
      if (des[0] === "email") {
        setError("email", {
          message: des[1],
        });
        toast.error(des[1]);
      }
      if (des[0] === "server") {
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
      router.push(`/sso/authflow/signin?${BASE_PARAMS(searchParams)}`);
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
            {activeStep === 0 ? "Login" : "Back"}
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

export default RegisterStepForm;
