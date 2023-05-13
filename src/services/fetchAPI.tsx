import refreshService from "./auth/refreshService";
import FetchResponse from "../objects/FetchResponse";

/**
 * @brief Given the refresh token, get a new token
 *
 * @param refresh User token refresh
 *
 * @returns API response when refresh
 */
export default async function<T>(
  token: string,
  refreshToken: string,
  setToken: (token: string) => void,
  fetchFunction: (token: string) => Promise<FetchResponse<T>>
): Promise<FetchResponse<T | string>> {
  try {
    const response = await fetchFunction(token);

    // If we get forbidden (code 9), we try to refresh the token
    if (
      response.isError &&
      response.exception !== undefined &&
      response.exception.code === 9
    ) {
      const refreshResponse = await refreshService(refreshToken);

      if (refreshResponse.isError || refreshResponse.data === undefined) {
        return refreshResponse;
      }

      // We save the new token and the fetch is performed with the new token
      setToken(refreshResponse.data);
      return await fetchFunction(refreshResponse.data);
    } else {
      return response;
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
