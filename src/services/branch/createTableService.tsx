import { API_ENDPOINT } from "../../config";
import TableDTO from "../../objects/branch/TableDTO";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Create a new table
 *
 * @param dto Table data
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: Partial<TableDTO>,
  token: string
): Promise<FetchResponse<TableDTO>> => {
  const uri = `${API_ENDPOINT}/table`;

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
      const data: TableDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
