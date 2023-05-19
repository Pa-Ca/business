import { API_ENDPOINT } from "../../config";
import ReservationDTO from "../../objects/branch/BranchDTO";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Get the reservation given its id
 *
 * @param id Reservation id
 *
 * @returns API response
 */
export default async (
  id: number,
  token: string,
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
      console.log(exception)
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};