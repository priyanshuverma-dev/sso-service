"use client";
import React from "react";

import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { FORM_VALIDATE_API_ROUTE } from "@/app/api/sso/form/route";
import toast from "react-hot-toast";
import { REGISTER_API_ROUTE } from "@/app/api/register/route";
import EmailStep from "./authflow/email-step";
import PasswordStep from "./authflow/password-step";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { BASE_PARAMS } from "@/lib/core";
import OTPInput from "react-otp-input";
import clsx from "clsx";
import { SEND_OTP_API_ROUTE } from "@/app/api/sso/sendotp/route";
import { FORGET_PASSWORD_VERIFY_API_ROUTE } from "@/app/api/sso/recove/verify/route";
import { FORGET_PASSWORD_RESET_API_ROUTE } from "@/app/api/sso/recove/password/route";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
type Step = {
  id: number;
  component: React.ReactNode;
};

const ForgetPasswordForm = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(false); // Add loading state

  const email = props.searchParams.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    control,
  } = useForm<FieldValues>({
    defaultValues: {
      email: email,
      password: "",
      otp: null,
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
        <Controller
          name="otp"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <div>
              <div className="w-[300px] p-2 mb-3">
                <span>
                  Please enter the OTP sent to your email{" "}
                  <b> {getValues("email")}</b>.
                </span>
              </div>
              <OTPInput
                value={field.value}
                onChange={field.onChange}
                numInputs={6}
                shouldAutoFocus
                inputType="text"
                renderInput={(props) => (
                  <input
                    disabled={isLoading}
                    {...props}
                    className={clsx(
                      `
                      text-xl !w-[3rem] bg-gray-50 p-2 rounded-md border-2 outline-none transition-colors focus:border-blue-400 mx-1.5`,
                      isLoading && "opacity-50 cursor-default"
                    )}
                  />
                )}
              />
              {errors.otp && (
                <span className="p-1 text-sm text-red-600">
                  This field is required.
                </span>
              )}

              <div className="w-[300px] p-2 mt-3">
                <span>
                  Didn't get{" "}
                  <button
                    type="submit"
                    disabled={isLoading} // Disable button when loading
                    className={`text-blue-600 hover:bg-blue-50 transition-colors bg-opacity-5 p-2 rounded-md `}
                  >
                    Resend
                  </button>
                </span>
              </div>
            </div>
          )}
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

      // !Email
      if (activeStep == 0) {
        const res = await fetch(FORM_VALIDATE_API_ROUTE, {
          method: "POST",
          body: JSON.stringify({
            type: "email",
            field: data.email,
            from: "forget-password",
          }),
        });

        const payload = await res.json();

        if (res.status != 200) throw new Error(`email__${payload.message}`);

        const sendOTP = await fetch(SEND_OTP_API_ROUTE, {
          method: "POST",
          body: JSON.stringify({
            email: data.email,
            state: searchParams.state,
          }),
        });

        const sentOTPRes = await sendOTP.json();

        if (sendOTP.status != 200)
          throw new Error(`otp__${sentOTPRes.message}`);

        console.log(sentOTPRes);

        toast.success(sentOTPRes.message);

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      // !OTP
      if (activeStep === 1) {
        const verifyOTP = await fetch(FORGET_PASSWORD_VERIFY_API_ROUTE, {
          method: "POST",
          body: JSON.stringify({
            email: data.email,
            state: searchParams.state,
            otp: data.otp,
          }),
        });

        const body = await verifyOTP.json();

        if (verifyOTP.status != 200) throw new Error(`otp__${body.message}`);

        console.log(body);

        toast.success(body.message);

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      // !Submission
      if (activeStep === FormSteps.length - 1) {
        if (!data.email) {
          setActiveStep(1);
        }

        if (!data.password) {
          setActiveStep(2);
        }

        const payload = {
          email: data.email,
          state: searchParams.state,
          otp: data.otp,
          password: data.password,
        };
        const res = await fetch(FORGET_PASSWORD_RESET_API_ROUTE, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const body = await res.json();

        if (res.status !== 200) {
          throw new Error(`server__${body.message}`);
        }

        console.log(body);
        toast.success(body.message);

        router.push(`/sso/authflow/signin?${BASE_PARAMS(searchParams)}`);
      }
      console.log(data);
    } catch (error: any) {
      console.log(
        ` %c USER_FORGET_PASSWORD_CLIENT_SSO: ${error}`,
        "color: yellow"
      );
      const des = error.message.split("__");
      if (des[0] === "email") {
        setError("email", {
          message: des[1],
        });
        toast.error(des[1]);
      }
      if (des[0] === "otp") {
        setError("otp", {
          message: des[1],
        });
        toast.error(des[1]);
      }
      if (des[0] === "server") {
        setActiveStep(2);
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

export default ForgetPasswordForm;
