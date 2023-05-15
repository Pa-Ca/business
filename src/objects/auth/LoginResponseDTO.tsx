type LoginResponseDTO = {
  /**
   * New User ID
   */
  id: number;
  /**
   * User token
   */
  token: string;
  /**
   * User token refresh
   */
  refresh: string;
  /**
   * Indicate if user is "client" or "business"
   */
  role: "client" | "business";
};

export { type LoginResponseDTO as default };
