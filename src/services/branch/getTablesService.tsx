import { API_ENDPOINT } from "../../config";
import TableDTO from "../../objects/branch/TableDTO";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

type TablesResponse = {
  tables: TableDTO[];
};

/**
 * @brief Get the tabless of a branch given its id
 *
 * @param id Branch id
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  id: number,
  token: string
): Promise<FetchResponse<TablesResponse>> => {
  const uri = `${API_ENDPOINT}/branch/${id}/tables`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: TablesResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
