import { API_ENDPOINT } from "../../config";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";
import { SaleInfoDTO, TableDTO } from "objects";

type TableListDTO = {
  tables: TableDTO[];
};

/**
 * @brief Start reservation
 *
 * @param id reservation id
 *
 * @returns API response
 */
export default async (
  id: number,
  dto: TableListDTO,
  token: string
): Promise<FetchResponse<SaleInfoDTO>> => {
  const uri = `${API_ENDPOINT}/reservation/${id}/start`;

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
