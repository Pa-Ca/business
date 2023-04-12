import { API_ENDPOINT } from "../config";
import FetchResponse from "../objects/FetchResponse";
import ExceptionResponse from "../objects/ExceptionResponse";

/**
 * @brief Logout current user
 *
 * @param token User token
 * @param refresh User token refresh
 *
 * @returns API response when logout
 */
export default async (
  token: string,
  refresh: string
): Promise<FetchResponse<null>> => {
  const uri = `${API_ENDPOINT}/auth/logout`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, refresh }),
    });

    if (response.status === 200) {
      return { isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
