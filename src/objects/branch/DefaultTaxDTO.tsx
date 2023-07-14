import { TaxType } from "objects/sale/TaxDTO";

type DefaultTaxDTO = {
  /**
   * Tax product id
   */
  id: number;
  /**
   * Branch id
   */
  branchId: number;
  /**
   * Tax name
   */
  name: string;
  /**
   * Tax type
   */
  type: TaxType;
  /**
   * Tax value
   */
  value: number;
};

export { type DefaultTaxDTO as default };
