import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse } from "objects";

/**
 * @brief Given the refresh token, get a new token
 *
 * @param refresh User token refresh
 *
 * @returns API response when refresh
 */
export default async (refresh: string): Promise<FetchResponse<string>> => {
  const uri = `${API_ENDPOINT}/auth/refresh`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (response.status === 200) {
      const data: { token: string } = await response.json();
      return { data: data.token, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
