type ProductSubCategoryDTO = {
  /**
   * Sub-category id
   */
  id: number;
  /**
   * Id of the branch that corresponds to the sub-category
   */
  branchId: number;
  /**
   * Id of the category that corresponds to the sub-category
   */
  categoryId: number;
  /**
   * SubCategory name
   */
  name: string;
};

export { type ProductSubCategoryDTO as default };
