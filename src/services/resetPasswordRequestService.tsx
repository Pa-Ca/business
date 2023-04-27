import { API_ENDPOINT } from "../config";
import FetchResponse from "../objects/FetchResponse";
import ExceptionResponse from "../objects/ExceptionResponse";

type ResetPasswordResponse = {
  /**
   * Reset password token
   */
  token: string;
};

/**
 * @brief Create a password change request
 *
 * @param email Email of the user requesting the password change
 *
 * @returns API response
 */
export default async (email: string): Promise<FetchResponse<ResetPasswordResponse>> => {
  const uri = `${API_ENDPOINT}/auth/reset-password-request`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
      console.log(response)

    if (response.status === 200) {
      const data: ResetPasswordResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
