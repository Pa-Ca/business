import { API_ENDPOINT } from "../../config";
import {
  FetchResponse, 
  ExceptionResponse,
  ReservationDTO,
} from "objects";

type ReservationsResponse = {
    /**
     * List of reservations with started status
     */
    startedReservations: ReservationDTO[];
    /**
     * List of reservations with started status
     */
    acceptedReservations: ReservationDTO[];
    /**
     * List of reservations with accepted status
     */
    pendingReservations: ReservationDTO[];
    /**
     * List of reservations with final status (rejected, retired, closed)
     */
    historicReservations: ReservationDTO[];
    /**
     * Current page of historic
     */
    currentHistoricPage: number;
    /**
     * number of total historic pages
     */
    totalHistoricPages: number;
    /**
     * All matches of current filter over historic reserves
     */
    totalHistoricElements: number;
};

/**
 * @brief Get the reservations of a branch given its id and filters
 *
 * @param id Branch id
 * @param token Authorization token
 * @param pageIndex Index of the page
 * @param pageSize Size of the page
 * @param startTime Start time of the reservation
 * @param endTime End time of the reservation
 * @param fullname Fullname of the customer
 * @param identityDocument Identity document of the customer
 * @param status Status of the reservation
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
  status: number[] | null = null,
): Promise<FetchResponse<ReservationsResponse>> => {
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
  if (!!status) {
    uri = uri.concat(`&status=${status}`);//Verificar que se pase como: 1,2,3
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
      const data: ReservationsResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};