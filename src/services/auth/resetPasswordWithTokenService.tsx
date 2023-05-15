import { API_ENDPOINT } from "../../config";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Change a user's password usin a JWT token
 *
 * @param newPassword New user password
 * @param token Token that authorizes the user to make the change
 *
 * @returns API response
 */
export default async (newPassword: string, token: string): Promise<FetchResponse<null>> => {
  const uri = `${API_ENDPOINT}/auth/reset-password/${token}`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    if (response.status === 200) {
      return { data: null, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
