export enum SaleStatus {
  CANCELED = 0,
  ONGOING = 1,
  CLOSED = 2,
}

type SaleDTO = {
  /**
   * Sale id
   */
  id: number;
  /**
   * Id of the branch that corresponds to the sale
   */
  branchId: number;
  /**
   * Id of the owner that corresponds to the sale
   */
  clientGuestId: number;
  /**
   * Id of the invoice that corresponds to the sale
   */
  invoiceId: number;
  /**
   * Client quantity
   */
  clientQuantity: number;
  /**
   * Sale status
   */
  status: SaleStatus;
  /**
   * Start datetime of the sale
   */
  startTime: string;
  /**
   * End datetime of the sale
   */
  endTime?: string;
  /**
   * Sale dollar to local currency exchange
   */
  dollarExchange: number;
  /**
   * Sale note
   */
  note: string;
};

export { type SaleDTO as default };
