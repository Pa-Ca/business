export type Duration = `PT${number}H${number}M${number}S`;
export type LocalTime = `${number}:${number}:${number}`;

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
   * Branch location
   */
  location: string;
  /**
   * Branch Google Maps URL
   */
  mapsLink: string;
  /**
   * Branch name
   */
  name: string;
  /**
   * Branch overview
   */
  overview: string;
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
  averageReserveTime: Duration;
  /**
   * Indicates if the branch will be publicly visible
   */
  visibility: boolean;
  /**
   * Branch phone number
   */
  phoneNumber: string;
  /**
   * Branch type
   */
  type: string;
  /**
   * Branch hour in which it opens
   */
  hourIn: LocalTime;
  /**
   * Branch hour in which it closes
   */
  hourOut: LocalTime;
};

export { type BranchDTO as default };
