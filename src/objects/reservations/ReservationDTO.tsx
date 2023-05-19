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
    reservationDate : string;
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
     * Guest name 
     */
    name: string;
    /**
     * Guest surname 
     */
    surname: string;
    /**
     * Guest email 
     */
    email: string;
    /**
     * Guest phone number 
     */
    phoneNumber: string;

};

export { type ReservationDTO as default };