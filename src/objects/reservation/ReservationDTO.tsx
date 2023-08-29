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
   * Id of the invoice
   */
  invoiceId: number;
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
   * Reservation price
   */
  price: number;
  /**
   * Reservation status
   */
  status: number;
  /**
   * Number of tables in this reservation
   */
  tableNumber: number;
  /**
   * Number of clients in this reservation
   */
  clientNumber: number;
  /**
   * Reservation occasion
   */
  occasion: string;
  /**
   * If reservation was created by client or business
   */
  byClient: boolean;
};

export { type ReservationDTO as default };