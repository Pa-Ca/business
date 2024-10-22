import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse, ResetPasswordDTO } from "objects";
/**
 * @brief Create a password change request
 *
 * @param email Email of the user requesting the password change
 *
 * @returns API response
 */
export default async (
  email: string
): Promise<FetchResponse<ResetPasswordDTO>> => {
  const uri = `${API_ENDPOINT}/auth/reset-password-request`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.status === 200) {
      const data: ResetPasswordDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
