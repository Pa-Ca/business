import { API_ENDPOINT } from "../../config";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Delete product sub-category
 *
 * @param id Product sub-category id
 * @param token Authorization token
 *
 * @returns API response
 */
export default async (id: number, token: string): Promise<FetchResponse<null>> => {
  const uri = `${API_ENDPOINT}/product-sub-category/${id}`;

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