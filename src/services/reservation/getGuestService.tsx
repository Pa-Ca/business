import { API_ENDPOINT } from "../../config";
import GuestDTO from "../../objects/reservations/GuestDTO";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

type GuestResponse = {
  guest: GuestDTO;
};

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
): Promise<FetchResponse<GuestResponse>> => {
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
      const data: GuestResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};