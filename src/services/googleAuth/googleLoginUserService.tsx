import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse } from "objects";

type GoogleLoginResponse = {
  /**
   * New User ID
   */
  id: number;
  /**
   * User token
   */
  token: string;
  /**
   * User token refresh
   */
  refresh: string;
  /**
   * Indicate if user is "client" or "business"
   */
  role: "client" | "business";
};

/**
 * @brief Create a new user
 *
 * @param token Google Access Token
 *
 * @returns API response when creating a user
 */
export default async (
  token: string
): Promise<FetchResponse<GoogleLoginResponse>> => {
  const uri = `${API_ENDPOINT}/auth/google/login`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, role: "business" }),
    });

    if (response.status === 200) {
      const data: GoogleLoginResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
