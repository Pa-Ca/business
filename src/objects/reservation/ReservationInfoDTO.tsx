import { ReservationProps } from "paca-ui";
import GuestDTO from "./GuestDTO";
import InvoiceDTO from "./InvoiceDTO";
import ReservationDTO from "./ReservationDTO";
import ClientDTO from "objects/client/ClientDTO";
import getReservationStatusObject from "../../utils/getReservationStatusObject";

type ReservationInfoDTO = {
  /**
   * Reservation data
   */
  reservation: ReservationDTO;
  /**
   * Invoice data
   */
  invoice: InvoiceDTO | null;
  /**
   * Guest data if exists
   */
  guest: GuestDTO | null;
  /**
   * Client owner data if exists
   */
  owner: ClientDTO | null;
};

export const toReservationProps = (
  reservationInfo: ReservationInfoDTO,
): ReservationProps => {
  const { reservation, invoice, guest, owner } = reservationInfo;
  const ownerData = reservation.byClient ? owner! : guest!;

  function hourFormat(hour: string)  {
    if(hour === "" || hour === null){
      return "";
    }else{
      const date = new Date(hour);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  const result = {
    id: reservation.id,
    requestDate: reservation.requestDate,
    start: hourFormat(reservation.reservationDateIn),
    end: hourFormat(reservation.reservationDateOut),
    tables: reservation.tableNumber,
    persons: reservation.clientNumber,
    date: reservation.reservationDateIn,
    owner: ownerData.name + " " + ownerData.surname,
    ownerEmail: ownerData.email,
    ownerOccasion: reservation.occasion,
    ownerPhone: ownerData.phoneNumber,
    identityDocument: ownerData.identityDocument,
    status: getReservationStatusObject(reservation.status),
  };
  return result;
};

export { type ReservationInfoDTO as default };