import { API_ENDPOINT } from "../../config";
import SaleDTO from "../../objects/sale/SaleDTO";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

type SaleResponse = {
  ongoingSales: SaleDTO[];
  historicSales: SaleDTO[];
  page: number;
  totalPages: number;
};

/**
 * @brief Get the sales of a branch given its id
 *
 * @param id Branch id
 * @param token Authorization token
 * @param pageIndex Index of the page
 * @param pageSize Size of the page
 *
 * @returns API response when refresh
 */
export default async (
  id: number,
  token: string,
  pageIndex: number = 0,
  pageSize: number = 10
): Promise<FetchResponse<SaleResponse>> => {
  const uri = `${API_ENDPOINT}/branch/${id}/sale?page=${pageIndex}&size=${pageSize}`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: SaleResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
