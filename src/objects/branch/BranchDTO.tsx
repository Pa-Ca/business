import DefaultTaxDTO from "./DefaultTaxDTO";

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
   * Branch name
   */
  name: string;
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
   * Branch Google Maps URL
   */
  mapsLink: string;
  /**
   * Branch location
   */
  location: string;
  /**
   * Branch overview
   */
  overview: string;
  /**
   * Indicates if the branch will be publicly visible
   */
  visibility: boolean;
  /**
   * Indicates if reservations can be made
   */
  reserveOff: boolean;
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
  /**
   * Average time a reservation lasts
   */
  averageReserveTime: Duration;
  /**
   * Exchange between the dollar and the local currency
   */
  dollarExchange: number;
  /**
   * Indicate if the branch is deleted
   */
  deleted: boolean;
};

export { type BranchDTO as default };
