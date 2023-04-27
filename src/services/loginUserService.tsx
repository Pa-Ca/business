import { API_ENDPOINT } from "../config";
import FetchResponse from "../objects/FetchResponse";
import ExceptionResponse from "../objects/ExceptionResponse";

type LoginResponse = {
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
 * @param email New user email
 * @param password New user password
 *
 * @returns API response when creating a user
 */
export default async (
  email: string,
  password: string
): Promise<FetchResponse<LoginResponse>> => {
  const uri = `${API_ENDPOINT}/auth/login`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      const data: LoginResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
