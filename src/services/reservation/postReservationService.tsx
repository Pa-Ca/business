import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse, ReservationDTO } from "objects";

/**
 * @brief Create reservation
 *
 * @param dto Reservation data
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: ReservationDTO,
  token: string
): Promise<FetchResponse<ReservationDTO>> => {
  const uri = `${API_ENDPOINT}/reservation`;
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
