import { API_ENDPOINT } from "../../config";
import {
  GuestDTO,
  GuestInfoDTO,
  FetchResponse,
  ExceptionResponse,
} from "objects";

/**
 * @brief Create a new guest
 *
 * @param dto Guest data
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: Partial<GuestDTO>,
  token: string
): Promise<FetchResponse<GuestInfoDTO>> => {
  const uri = `${API_ENDPOINT}/guest`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (response.status === 200) {
      const data: GuestInfoDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
