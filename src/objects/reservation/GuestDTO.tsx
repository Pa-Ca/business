type GuestDTO = {
    /**
     * Reservation Identifier
     */
    id: number;
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
     * Owner phone number
     */
    identityDocument: string;
};

export { type GuestDTO as default };