import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse } from "objects";
import googleSignUpUserService from "./googleSignUpUserService";

type BusinessSaveResponse = {
  /**
   * Business id
   */
  id: number;
  /**
   * Id of the user that corresponds to the business
   */
  userId: number;
  /**
   * User token
   */
  token: string;
  /**
   * User token refresh
   */
  refresh: string;
  /**
   * Email of the user that corresponds to the Business
   */
  email: string;
  /**
   * Business name
   */
  name: string;
  /**
   * Indicates if the business is verified
   */
  verified: boolean;
  /**
   * Business tier
   */
  tier: number;
};

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
  token: string | undefined
): Promise<FetchResponse<BusinessSaveResponse>> => {
  // Create the user
  const userResponse = await googleSignUpUserService(token);

  // Verify that the user was created correctly
  if (userResponse.isError || userResponse.data === undefined) {
    return { exception: userResponse.exception, error: userResponse.error, isError: true };
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
      body: JSON.stringify({ email: userResponse.data.email, name, verified: false, tier: "basic" }),
    });

    if (response.status === 200) {
      const data: BusinessSaveResponse = await response.json();
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
