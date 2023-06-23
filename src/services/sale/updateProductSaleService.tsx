import { API_ENDPOINT } from "../../config";
import FetchResponse from "../../objects/FetchResponse";
import SaleProductDTO from "../../objects/sale/SaleProductDTO";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Change the data of a sale product. Undefined variables will be ignored
 *
 * @param dto Sale product data
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: Partial<SaleProductDTO>,
  token: string
): Promise<FetchResponse<SaleProductDTO>> => {
  const uri = `${API_ENDPOINT}/sale/${dto.saleId}/product/${dto.id}`;

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
      const data: SaleProductDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
