import * as React from "react";

interface ForgetPasswordEmailProps {
  firstName: string;
  otp: string;
}

export const ForgetPasswordEmail: React.FC<ForgetPasswordEmailProps> = ({
  firstName,
  otp,
}) => (
  <div className="bg-white p-4 rounded-md shadow-md">
    <h1 className="text-2xl font-bold mb-4">Password Reset</h1>
    <p className="mb-2">Hello, {firstName}!</p>
    <p className="mb-2">
      We received a request to reset your password. Use the following OTP to
      reset your password.
    </p>
    <div className="bg-gray-100 p-4 rounded-lg text-center">
      <h2 className="text-4xl font-bold">{otp}</h2>
      <p className="text-sm">This OTP will expire in 10 minutes.</p>
    </div>
    <p className="mt-4">
      If you didn't request this, you can ignore this email - your password will
      not be changed.
    </p>
  </div>
);
