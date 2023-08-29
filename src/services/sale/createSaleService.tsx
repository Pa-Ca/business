import { API_ENDPOINT } from "../../config";
import {
  SaleInfoDTO,
  FetchResponse,
  ExceptionResponse,
} from "objects";

/**
 * @brief Create a new sale
 *
 * @param dto Sale data
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: Partial<SaleInfoDTO>,
  token: string
): Promise<FetchResponse<SaleInfoDTO>> => {
  const uri = `${API_ENDPOINT}/sale`;

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
      const data: SaleInfoDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
