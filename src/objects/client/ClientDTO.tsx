type ClientDTO = {
  /**
   * Reservation Identifier
   */
  id: number;
  /**
   * User id
   */
  userId: number;
  /**
   * User email
   */
  email: string;
  /**
   * Client name
   */
  name: string;
  /**
   * Client surname
   */
  surname: string;
  /**
   * Client identity document
   */
  identityDocument: string;
  /**
   * Client address
   */
  address: string;
  /**
   * Client phone number
   */
  phoneNumber: string;
  /**
   * Client stripe customer id
   */
  stripeCustomerId: string;
  /**
   * Date of birth
   */
  dateOfBirth: string;
};

export { type ClientDTO as default };
