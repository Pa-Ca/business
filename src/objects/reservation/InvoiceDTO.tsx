type InvoiceDTO = {
  /**
   * Invoice Identifier
   */
  id: number;
  /**
   * Pay date
   */
  payDate: string;
  /**
   * Price
   */
  price: number;
  /**
   * Payment name
   */
  payment: string;
  /**
   * Payment code
   */
  paymentCode: string;
};

export { type InvoiceDTO as default };
