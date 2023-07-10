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
): ReservationProps => {
  const date = new Date(reservation.reservationDate);
  const start = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    id: reservation.id,
    start: start,
    date: reservation.reservationDate,
    end: "",
    owner: reservation.name + " " + reservation.surname,
    ownerEmail: reservation.email,
    ownerOccasion: reservation.occasion,
    ownerPhone: reservation.phoneNumber,
    persons: reservation.clientNumber,
    tables: 1,
    status: {
      number: 1,
      name: "",
      nameShow: "",
      icon: "pa-ca",
    },
    identityDocument: "",
  };
};

export { type ReservationDTO as default };
