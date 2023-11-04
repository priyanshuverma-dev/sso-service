import * as React from "react";

interface HelloEmailProps {
  firstName: string;
}

export const HelloEmail: React.FC<Readonly<HelloEmailProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
  </div>
);
