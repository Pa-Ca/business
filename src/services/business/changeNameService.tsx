import { API_ENDPOINT } from "../../config";
import FetchResponse from "../../objects/FetchResponse";
import BusinessDTO from "../../objects/business/BusinessDTO";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Get the branches of a business given its id
 *
 * @param id Business id
 * @param name New business name
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  id: number,
  name: string,
  token: string
): Promise<FetchResponse<BusinessDTO>> => {
  const uri = `${API_ENDPOINT}/business/${id}`;

  try {
    const response = await fetch(uri, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, name }),
    });

    if (response.status === 200) {
      const data: BusinessDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
