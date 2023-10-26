"use client";

import React from "react";
import EmailStep from "./email-step";
import PasswordStep from "./password-step";
import TextStep from "./text-step";

type Step = {
  id: number;
  component: React.ReactNode;
};

const MultiStepForm = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const FormSteps: Step[] = [
    {
      id: 1,
      component: (
        <TextStep name="name" placeholder="Name" label="Enter you name" />
      ),
    },
    {
      id: 2,
      component: <EmailStep />,
    },
    {
      id: 3,
      component: <PasswordStep />,
    },
  ];

  const handleNext = () => {
    if (activeStep == FormSteps.length - 1) return;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep == 0) return;
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="m-2 h-full flex flex-col items-center justify-center">
      {FormSteps[activeStep].component}

      <div className="flex justify-between flex-row items-center w-full m-12 ">
        <button
          onClick={handleBack}
          className={`text-blue-600 hover:bg-blue-50 transition-colors bg-opacity-5 p-2 rounded-md `}
        >
          {activeStep === 0 ? "Create New" : "Back"}
        </button>

        <button
          onClick={handleNext}
          className="text-white bg-blue-500 transition-colors hover:bg-blue-600 p-2 px-3 rounded-md"
        >
          {activeStep === FormSteps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default MultiStepForm;
