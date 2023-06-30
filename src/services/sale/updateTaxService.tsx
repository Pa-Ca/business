import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse, TaxDTO } from "objects";

/**
 * @brief Change the data of a tax. Undefined variables will be ignored
 *
 * @param dto Tax data
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: Partial<TaxDTO>,
  token: string
): Promise<FetchResponse<TaxDTO>> => {
  const uri = `${API_ENDPOINT}/tax/${dto.id}`;
  console.log(dto)

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
      const data: TaxDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
