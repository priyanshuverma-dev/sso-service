import * as React from "react";

interface PasswordChangedEmailProps {
  firstName: string;
}

export const PasswordChangedEmail: React.FC<PasswordChangedEmailProps> = ({
  firstName,
}) => (
  <div className="bg-gray-100 p-4 rounded-md shadow-md max-w-md mx-auto">
    <div className="text-center">
      <h1 className="text-2xl font-bold mt-4">Password Changed</h1>
    </div>
    <div className="mt-6">
      <p className="text-gray-700">Hello, {firstName}!</p>
      <p className="text-gray-700 mt-2">
        We're writing to inform you that your password has been successfully
        changed.
      </p>
      <p className="text-gray-700 mt-2">
        If you did not initiate this change, please contact our support team
        immediately.
      </p>
    </div>
    <div className="text-gray-500 mt-8">
      <p>Best regards,</p>
      <p>GateSync</p>
      <p>
        <a href="#" className="text-blue-600 hover:underline">
          Visit Our Website
        </a>
      </p>
    </div>
  </div>
);
