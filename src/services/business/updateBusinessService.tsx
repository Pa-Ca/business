import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse, BusinessDTO } from "objects";

/**
 * @brief Change the name of the business
 *
 * @param dto Business DTO
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: Partial<BusinessDTO>,
  token: string
): Promise<FetchResponse<BusinessDTO>> => {
  const uri = `${API_ENDPOINT}/business/${dto.id}`;

  try {
    const response = await fetch(uri, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
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
