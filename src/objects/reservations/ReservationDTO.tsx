import { ReservationProps } from "paca-ui";

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
   * Date the Reservation occurs
   */
  reservationDate: string;
  /**
   * Number of clients in this reservation
   */
  clientNumber: number;
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
};

export const toReservationProps = (
  reservation: ReservationDTO
): ReservationProps => ({
  id: reservation.id,
  start: reservation.reservationDate.substring(
    reservation.reservationDate.indexOf("T") + 1,
    reservation.reservationDate.lastIndexOf(".")
  ),
  owner: reservation.name + "" + reservation.surname,
  ownerPhone: reservation.phoneNumber,
  persons: reservation.clientNumber,
  tables: 1,
  state: reservation.status,
  date: reservation.reservationDate,
});

export { type ReservationDTO as default };
