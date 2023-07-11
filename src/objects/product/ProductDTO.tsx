type ProductDTO = {
  /**
   * Product id
   */
  id: number;
  /**
   * Id of the sub-category that corresponds to the product
   */
  subCategoryId: number;
  /**
   * Indicates if the product is disabled
   */
  disabled: boolean;
  /**
   * Product name
   */
  name: string;
  /**
   * Product price
   */
  price: number;
  /**
   * Product description
   */
  description: string;
};

export { type ProductDTO as default };
