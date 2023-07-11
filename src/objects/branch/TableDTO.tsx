type TableDTO = {
  /**
   * Table id
   */
  id: number;
  /**
   * Id of the branch that corresponds to the table
   */
  branchId: number;
  /**
   * Indicates if the product is deleted
   */
  deleted: boolean;
  /**
   * Table name
   */
  name: string;
};

export { type TableDTO as default };
