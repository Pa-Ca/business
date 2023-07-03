import TaxDTO from "./TaxDTO";
import SaleProductDTO from "./SaleProductDTO";

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
   * Id of the table that corresponds to the sale
   */
  tableId: number;
  /**
   * Id of the reservation that corresponds to the sale
   */
  reservationId?: number;
  /**
   * Client quantity
   */
  clientQuantity: number;
  /**
   * Start datetime of the sale
   */
  startTime: string;
  /**
   * End datetime of the sale
   */
  endTime?: string;
  /**
   * Sale status
   */
  status: SaleStatus;
  /**
   * Table name
   */
  tableName: string;
  /**
   * Sale note
   */
  note: string;
  /**
   * Sale dollar to local currency exchange
   */
  dollarToLocalCurrencyExchange: number;
  /**
   * Sale products
   */
  products: SaleProductDTO[];
  /**
   * Sale taxes
   */
  taxes: TaxDTO[];
};

export { type SaleDTO as default };
