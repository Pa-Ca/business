type SaleProductDTO = {
  /**
   * Sale product id
   */
  id: number;
  /**
   * Sale id of the sale product
   */
  saleId: number;
  /**
   * Product id of the sale product
   */
  productId: number;
  /**
   * Amount of the product
   */
  amount: number;
  /**
   * Price of the product
   */
  price: number;
  /**
   * Product name
   */
  name: string;
};

export { type SaleProductDTO as default };
