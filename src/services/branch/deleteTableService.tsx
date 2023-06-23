import { API_ENDPOINT } from "../../config";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Delete table
 *
 * @param id table id
 * @param token Authorization token
 *
 * @returns API response
 */
export default async (id: number, token: string): Promise<FetchResponse<null>> => {
  const uri = `${API_ENDPOINT}/table/${id}`;

  try {
    const response = await fetch(uri, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response)

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