import TaxDTO from "objects/sale/TaxDTO";
import BranchDTO from "objects/branch/BranchDTO";

type BranchInfoDTO = {
  /**
   * Tax product id
   */
  branch: BranchDTO;
  /**
   * Default taxtes
   */
  defaultTaxes: TaxDTO[];
};

export { type BranchInfoDTO as default };
