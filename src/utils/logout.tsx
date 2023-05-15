import { Dispatch } from "react";
import { AnyAction } from "redux";
import { NextRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";
import { logoutUser } from "../context/slices/auth";
import { unsetBranches } from "../context/slices/branches";
import { logoutBusiness } from "../context/slices/business";
import logoutUserService from "../services/auth/logoutUserService";

export default async (
  token: string,
  refresh: string,
  dispatch: Dispatch<AnyAction>,
  router: NextRouter,
  nextPage: string = "/login",
  parameters: ParsedUrlQueryInput = {}
) => {
  router.push({ pathname: nextPage, query: parameters });
  dispatch(logoutBusiness());
  dispatch(logoutUser());
  dispatch(unsetBranches());
  await logoutUserService(token, refresh);
};
