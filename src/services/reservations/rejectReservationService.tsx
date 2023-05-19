import { API_ENDPOINT } from "../../config";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Reject reservation
 *
 * @param id reservation id
 *
 * @returns API response
 */
export default async (id: number): Promise<FetchResponse<null>> => {
  const uri = `${API_ENDPOINT}/reservation/reject/${id}`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.status === 200) {
      return { isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};