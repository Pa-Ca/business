import TaxDTO from "./TaxDTO";
import SaleDTO from "./SaleDTO";
import SaleProductDTO from "./SaleProductDTO";
import TableDTO from "objects/branch/TableDTO";
import ClientDTO from "objects/client/ClientDTO";
import GuestDTO from "objects/reservation/GuestDTO";

type SaleInfoDTO = {
  /**
   * Sale information
   */
  sale: SaleDTO;
  /**
   * True if the sale is insite
   */
  insite: boolean;
  /**
   * Reservation id
   */
  reservationId: number | null;
  /**
   * Guest information
   */
  guest: GuestDTO | null,
  /**
   * Client information
   */
  client: ClientDTO | null;
  /**
   * Taxes applied to the sale
   */
  taxes: TaxDTO[];
  /**
   * Tables of the sale
   */
  tables: TableDTO[];
  /**
   * Products of the sale
   */
  products: SaleProductDTO[];
};

export { type SaleInfoDTO as default };
