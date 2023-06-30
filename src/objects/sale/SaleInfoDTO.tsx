import SaleDTO from "./SaleDTO";
import TaxDTO from "./TaxDTO";
import SaleProductDTO from "./SaleProductDTO";

type SaleInfoDTO = {
  /**
   * Sale info
   */
  sale: SaleDTO;
  /**
   * Sale taxes
   */
  taxes: TaxDTO[];
  /**
   * Sale products
   */
  products: SaleProductDTO[];
};

export { type SaleInfoDTO as default };
