import React from "react";

interface Props {
  children: React.ReactNode;
}

function AuthLayout(props: Props) {
  const { children } = props;

  return (
    <div className="flex justify-center items-center min-h-screen pt-40">
      {children}
    </div>
  );
}

export default AuthLayout;
