import { ReservationProps } from "paca-ui";
import getReservationStatusObject from "../../utils/getReservationStatusObject";

type ReservationDTO = {
  /**
   * Reservation Identifier
   */
  id: number;
  /**
   * Id of the branch associated with the Reservation
   */
  branchId: number;
  /**
   * Id of the guest
   */
  guestId: number;
  /**
   * Date the Reservation was requested
   */
  requestDate: string;
  /**
   * Date the Reservation occurs Start Hour
   */
  reservationDateIn: string;
  /**
   * Date the Reservation occurs End Hour
   */
  reservationDateOut: string;
  /**
   * Number of clients in this reservation
   */
  clientNumber: number;
  /**
   * Number of clients in this reservation
   */
  tableNumber: number;
  /**
   * Reservation payment code
   */
  payment: string;
  /**
   * Reservation status
   */
  status: number;
  /**
   * Date when it was payed
   */
  payDate: string;
  /**
   * Reservation price
   */
  price: number;
  /**
   * Reservation occasion
   */
  occasion: string;
  /**
   * If reservation was created by client or business
   */
  byClient: boolean;
  /**
   * If reservation was created by guest or
   */
  haveGuest: boolean;
  /**
   * Owner name
   */
  name: string;
  /**
   * Owner surname
   */
  surname: string;
  /**
   * Owner email
   */
  email: string;
  /**
   * Owner phone number
   */
  phoneNumber: string;
  /**
   * Owner identity document
   */
  identityDocument: string;
};

export const toReservationProps = (
  reservation: ReservationDTO
): ReservationProps => {
  function hourMinFormat(hour: string)  {
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
  function yearMonthDayFormat(hour: string)  {
    if(hour === "" || hour === null){
      return "";
    }else{
      const date = new Date(hour);
      return date.toLocaleTimeString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
  }
  console.log(reservation.reservationDateIn);
  const result = {
    id: reservation.id,
    start: hourMinFormat(reservation.reservationDateIn),
    end: hourMinFormat(reservation.reservationDateOut),
    requestDate: yearMonthDayFormat(reservation.requestDate),
    date: reservation.reservationDateIn,
    owner: reservation.name + " " + reservation.surname,
    ownerEmail: reservation.email,
    ownerOccasion: reservation.occasion,
    ownerPhone: reservation.phoneNumber,
    persons: reservation.clientNumber,
    tables: reservation.tableNumber,
    status: getReservationStatusObject(reservation.status),
    identityDocument: reservation.identityDocument,
  };
  return result;
};

export { type ReservationDTO as default };