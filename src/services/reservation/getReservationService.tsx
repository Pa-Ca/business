import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse, ReservationDTO } from "objects";

/**
 * @brief Get the reservation given its id
 *
 * @param id Reservation id
 * @param token Authorization token
 *
 * @returns API response
 */
export default async (
  id: number,
  token: string
): Promise<FetchResponse<ReservationDTO>> => {
  const uri = `${API_ENDPOINT}/reservation/${id}`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: ReservationDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
