import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse, DefaultTaxDTO } from "objects";

/**
 * @brief Create a new branch
 *
 * @param dto Tax data
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: DefaultTaxDTO,
  token: string
): Promise<FetchResponse<DefaultTaxDTO>> => {
  const uri = `${API_ENDPOINT}/defaulttax`;

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
      const data: DefaultTaxDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
