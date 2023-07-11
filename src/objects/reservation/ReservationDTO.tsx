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
  const dateIn = new Date(reservation.reservationDateIn);
  const start = dateIn.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  const dateOut = new Date(reservation.reservationDateOut);
  const end = dateOut.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    id: reservation.id,
    start: start,
    end: end,
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
};

export { type ReservationDTO as default };
