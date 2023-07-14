import { API_ENDPOINT } from "../../config";
import GuestDTO from "../../objects/reservation/GuestDTO";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Get the guest data given its identity document
 *
 * @param identityDocument Identity document
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
    identityDocument: string,
    token: string
): Promise<FetchResponse<GuestDTO>> => {
  const uri = `${API_ENDPOINT}/guest/identity-document/${identityDocument}`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: GuestDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};