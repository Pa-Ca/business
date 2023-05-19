import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import reservationsDTO from "../../objects/reservations/ReservationDTO";

interface ReservationProps {
  /**
   * List of branch reservations
   */
  reservations: reservationsDTO[];
}

const initialState: ReservationProps = {
  reservations: []
};

const reservations = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    unsetReservations: (state: ReservationProps) => {
      state.reservations = [];
    },
    setReservations: (state: ReservationProps, action: PayloadAction<reservationsDTO[]>) => {
      state.reservations = action.payload;
    }
  },
});

export const { unsetReservations, setReservations } = reservations.actions;
export default reservations.reducer;
