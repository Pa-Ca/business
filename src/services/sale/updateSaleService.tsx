import { API_ENDPOINT } from "../../config";
import SaleDTO from "../../objects/sale/SaleDTO";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Change the data of a sale. Undefined variables will be ignored
 *
 * @param dto Sale product data
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: Partial<SaleDTO>,
  token: string
): Promise<FetchResponse<SaleDTO>> => {
  const uri = `${API_ENDPOINT}/sale/${dto.id}`;

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
      const data: SaleDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
