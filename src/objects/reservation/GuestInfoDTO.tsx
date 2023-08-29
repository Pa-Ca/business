import GuestDTO from "./GuestDTO";

type GuestInfoDTO = {
  /**
   * Guest data
   */
  guest: GuestDTO;
  /**
   * Client guest id
   */
  clientGuestId: number;
};

export { type GuestInfoDTO as default };
