import React from "react";
import { Spinner } from "paca-ui";
import { useAppSelector } from "context";

export default function Signup() {
  const app = useAppSelector((state) => state.app);

  return <Spinner visible={app.spinner} />;
}
