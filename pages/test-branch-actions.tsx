import React, { useEffect, useState } from "react";
import acceptReservationService from "../src/services/reservations/acceptReservationService";
import cancelReservationService from "../src/services/reservations/cancelReservationService";
import rejectReservationService from "../src/services/reservations/rejectReservationService";
import getReservationService from "../src/services/reservations/getReservationService";

import { useDispatch } from "react-redux";
import { setToken } from "../src/context/slices/auth";
import { useAppSelector } from "../src/context/store"
import ReservationDTO from "../src/objects/reservations/ReservationDTO";
import fetchAPI from "../src/services/fetchAPI";

export default function TestBrachActions () {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reservation, setReservation] = useState<ReservationDTO>()
    const dispatch = useDispatch();
    const auth = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!reservation) {
            fetchReservation()
            console.table(reservation)
        }
    }, []);

    const reservationStatus = [
        'unset',
        'pending',
        'rejected',
        'paid',
        'accepted',
        'canceled',
        'closed',
        'returned'
    ]

    const fetchReservation = async () => {
        if (auth) {
            setLoading(true)

            const response = await fetchAPI(
                auth.token!,
                auth.refresh!,
                (token: string) => dispatch(setToken(token)),
                (token: string) => getReservationService(1, auth.token || '')
            );

            if (!!response.isError) {
                console.log(response)
                setError(true);
                return;
            }

            setReservation(response.data);
            setLoading(false)
        }

    }

    const onAcceptReservation = async () => {
        if (auth) {
            setLoading(true)
            setError(false);

            const response = await fetchAPI(
                auth.token!,
                auth.refresh!,
                (token: string) => dispatch(setToken(token)),
                (token: string) => acceptReservationService(1, auth.token || '')
            );

            if (!!response.isError) {
                console.log(response)
                setError(true);
                return;
            }

            fetchReservation()
        }
    }

    const onRejectReservation = async () => {
        if (auth) {
            setLoading(true)
            setError(false);

            const response = await fetchAPI(
                auth.token!,
                auth.refresh!,
                (token: string) => dispatch(setToken(token)),
                (token: string) => rejectReservationService(1, auth.token || '')
            );

            if (!!response.isError) {
                console.log(response)
                setError(true);
                return;
            }

            fetchReservation()
        }
    }

    const onCancelReservation = async () => {
        if (auth) {
            setLoading(true)
            setError(false);

            const response = await fetchAPI(
                auth.token!,
                auth.refresh!,
                (token: string) => dispatch(setToken(token)),
                (token: string) => cancelReservationService(1, auth.token || '')
            );

            if (!!response.isError) {
                console.log(response)
                setError(true);
                return;
            }

            fetchReservation()
        }
    }

    if (loading) return <>Loading...</>

    if (error) return <>Error</>

    return (
        <>
            <button onClick={onAcceptReservation}>Accept reservation</button>
            <button onClick={onRejectReservation}>Reject reservation</button>
            <button onClick={onCancelReservation}>Cancel reservation</button>

            <h2>Reservation</h2> <button onClick={onAcceptReservation}>refresh</button>
            <br/><br/>
            ID: {reservation?.id || 'empty'}<br/>
            Status: {reservation ? reservationStatus[reservation?.status] : 'empty'}
        </>
    );
}