import { API_ENDPOINT } from "../../config";
import TaxDTO from "../../objects/sale/TaxDTO";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Create a new tax
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
    const uri = `${API_ENDPOINT}/sale/${dto.saleId}/tax`;

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
