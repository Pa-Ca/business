import loginUserService from "./loginUserService";
import { API_ENDPOINT } from "../../config";
import BusinessDTO from "../../objects/business/BusinessDTO";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Create a new Business
 *
 * @name Business name
 * @email Email of the user that corresponds to the Business
 * @password User password
 *
 * @returns API response when creating Business
 */
export default async (
  email: string,
  password: string
): Promise<FetchResponse<BusinessDTO>> => {
  // Create the user
  const userResponse = await loginUserService(email, password);

  // Verify that the user was created correctly
  if (userResponse.error || !userResponse.data) {
    return {
      exception: userResponse.exception,
      error: userResponse.error,
      isError: true,
    };
  }

  // Create the Business
  const uri = `${API_ENDPOINT}/business/user/${userResponse.data.id}`;
  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userResponse.data.token}`,
      },
    });

    if (response.status === 200) {
      const data: BusinessDTO = await response.json();
      data.token = userResponse.data.token;
      data.refresh = userResponse.data.refresh;
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
