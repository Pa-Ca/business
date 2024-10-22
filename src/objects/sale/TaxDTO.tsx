export enum TaxType {
  "%" = 0,
  "$" = 1,
}

type TaxDTO = {
  /**
   * Tax product id
   */
  id: number;
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

export { type TaxDTO as default };
