import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse, ReservationDTO } from "objects";

type ReservationResponse = {
  reservations: ReservationDTO[];
};

/**
 * @brief Get the branches of a business given its id
 *
 * @param id Business id
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  id: number,
  token: string
): Promise<FetchResponse<ReservationResponse>> => {
  const uri = `${API_ENDPOINT}/branch/${id}/reservation`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: ReservationResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
