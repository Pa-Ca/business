type BranchDTO = {
  /**
   * Branch id
   */
  id: number;
  /**
   * Business id
   */
  businessId: number;
  /**
   * Branch address
   */
  address: string;
  /**
   * Exact location of the branch
   */
  coordinates: string;
  /**
   * Branch name
   */
  name: string;
  /**
   * Branch overview
   */
  overview: string;
  /**
   * Branch phone number. [TODO] agregar al back
   */
  phoneNumber: string;
  /**
   * Branch type. [TODO] agregar al back
   */
  type: string;
  /**
   * Branch score given by users
   */
  score: number;
  /**
   * Maximum number of clients that the branch can have at the same time
   */
  capacity: number;
  /**
   * Price of a reservation
   */
  reservationPrice: number;
  /**
   * Indicates if reservations can be made
   */
  reserveOff: boolean;
  /**
   * Average time a reservation lasts
   */
  averageReserveTime: number;
  /**
   * Indicates if the branch will be publicly visible
   */
  visibility: boolean;
};

export { type BranchDTO as default };
