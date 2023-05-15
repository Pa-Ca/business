type BusinessDTO = {
  /**
   * Business id
   */
  id: number;
  /**
   * Id of the user that corresponds to the business
   */
  userId: number;
  /**
   * User token
   */
  token: string;
  /**
   * User token refresh
   */
  refresh: string;
  /**
   * Email of the user that corresponds to the Business
   */
  email: string;
  /**
   * Business name
   */
  name: string;
  /**
   * Indicates if the business is verified
   */
  verified: boolean;
  /**
   * Business tier
   */
  tier: number;
  /**
   * Business phone number
   */
  phoneNumber: string;
};

export { type BusinessDTO as default };
