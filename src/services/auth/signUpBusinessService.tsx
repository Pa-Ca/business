import { API_ENDPOINT } from "../../config";
import { signUpUserService } from "services";
import { FetchResponse, ExceptionResponse, BusinessDTO } from "objects";

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
  name: string,
  email: string,
  password: string
): Promise<FetchResponse<BusinessDTO>> => {
  // Create the user
  const userResponse = await signUpUserService(email, password);

  // Verify that the user was created correctly
  if (userResponse.isError || userResponse.data === undefined) {
    return {
      exception: userResponse.exception,
      error: userResponse.error,
      isError: true,
    };
  }

  // Create the Business
  const uri = `${API_ENDPOINT}/business`;
  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userResponse.data.token}`,
      },
      body: JSON.stringify({ email, name, verified: false, tier: "basic" }),
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
