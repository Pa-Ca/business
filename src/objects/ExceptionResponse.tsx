type ExceptionResponse = {
  /**
   * Status name
   */
  status: string;
  /**
   * Exception timestamp
   */
  timestamp: string;
  /**
   * Exception code
   */
  code: number;
  /**
   * Exception message
   */
  message: string;
};

export { type ExceptionResponse as default };
