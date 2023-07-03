import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse, LoginResponseDTO } from "objects";

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
): Promise<FetchResponse<LoginResponseDTO>> => {
  const uri = `${API_ENDPOINT}/auth/login`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      const data: LoginResponseDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
