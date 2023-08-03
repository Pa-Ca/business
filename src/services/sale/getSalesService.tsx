import { API_ENDPOINT } from "../../config";
import {
  TaxDTO,
  SaleDTO,
  FetchResponse,
  SaleProductDTO,
  ExceptionResponse,
} from "objects";

type SaleInfo = {
  sale: SaleDTO;
  taxes: TaxDTO[];
  products: SaleProductDTO[];
};

type SaleResponse = {
  ongoingSalesInfo: SaleInfo[];
  historicSalesInfo: SaleInfo[];
  currentHistoricPage: number;
  totalHistoricPages: number;
  totalHistoricElements: number;
};

/**
 * @brief Get the sales of a branch given its id
 *
 * @param id Branch id
 * @param token Authorization token
 * @param pageIndex Index of the page
 * @param pageSize Size of the page
 * @param startTime Start time of the sales
 * @param endTime End time of the sales
 * @param fullname Fullname of the customer
 * @param identityDocument Identity document of the customer
 *
 * @returns API response when refresh
 */
export default async (
  id: number,
  token: string,
  pageIndex: number = 1,
  pageSize: number = 10,
  startTime: Date | null = null,
  endTime: Date | null = null,
  fullname: string | null = null,
  identityDocument: string | null = null,
): Promise<FetchResponse<SaleResponse>> => {
  let uri = `${API_ENDPOINT}/branch/${id}/sale?page=${pageIndex}&size=${pageSize}`;

  if (!!startTime) {
    uri = uri.concat(`&startTime=${startTime.toISOString()}`);
  }
  if (!!endTime) {
    // Get endDateTime + 1 day
    const endTimePlusOne = new Date(endTime);
    endTimePlusOne.setDate(endTimePlusOne.getDate() + 1);
    uri = uri.concat(`&endTime=${endTimePlusOne.toISOString()}`);
  }
  if (!!fullname) {
    uri = uri.concat(`&fullname=${fullname}`);
  }
  if (!!identityDocument) {
    uri = uri.concat(`&identityDocument=${identityDocument}`);
  }

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
