import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse } from "objects";

/**
 * @brief Delete sale product
 *
 * @param id product id
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  id: number,
  token: string
): Promise<FetchResponse<null>> => {
  const uri = `${API_ENDPOINT}/sale-product/${id}`;

  try {
    const response = await fetch(uri, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
