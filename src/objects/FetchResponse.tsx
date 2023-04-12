import ExceptionResponse from "./ExceptionResponse"

export default interface FetchResponse<T> {
  /**
   * Indicate if the response has an error or exception
   */
  isError: boolean;
  /**
   * Response data
   */
  data?: T;
  /**
   * Response exception
   */
  exception?: ExceptionResponse;
  /**
   * Response error
   */
  error?: Error;
};

