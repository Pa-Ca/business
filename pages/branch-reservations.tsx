import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import fetchAPI from "../src/services/fetchAPI";
import PageProps from "../src/objects/PageProps";
import validateName from "../src/utils/validateName";
import { setToken } from "../src/context/slices/auth";
import { useAppSelector } from "../src/context/store";
import validateEmail from "../src/utils/validateEmail";
import validatePhone from "../src/utils/validatePhone";
import { BranchReserves, ReservationProps } from "paca-ui";
import generateValidHours from "../src/utils/generateValidHours";
import useInputForm from "paca-ui/src/stories/hooks/useInputForm";
import OptionObject from "paca-ui/src/stories/utils/objects/OptionObject";
import postReservationService from "../src/services/reservations/postReservationService";
import getReservationsService from "../src/services/reservations/getReservationsService";
import closeReservationService from "../src/services/reservations/closeReservationService";
import acceptReservationService from "../src/services/reservations/acceptReservationService";
import cancelReservationService from "../src/services/reservations/cancelReservationService";
import rejectReservationService from "../src/services/reservations/rejectReservationService";
import ReservationDTO, {
  toReservationProps,
} from "../src/objects/reservations/ReservationDTO";

export default function BranchReservations({ header }: PageProps) {
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.auth);
  const branches = useAppSelector((state) => state.branches).branches;
  const branch = branches[useAppSelector((state) => state.branches).current];
  const [reservations, setReservations] = useState<ReservationProps[]>([]);

  // Reservation data
  const persons = useInputForm<string>("");
  const occasion = useInputForm<string>("");
  const date = useInputForm<Date>(new Date());
  const hourIn = useInputForm<OptionObject>({ value: "", name: "" });
  const hourOut = useInputForm<OptionObject>({ value: "", name: "" });

  // Client data
  const firstName = useInputForm("");
  const lastName = useInputForm("");
  const phone = useInputForm("");
  const email = useInputForm("");
  const [showModal, setshowModal] = useState(false);

  const addDatePlusHour = (date: Date, hour: string) => {
    const [hours, minutes, seconds] = hour.split(":").map(Number);
    date.setHours(hours, minutes, seconds, 0);
    return date.toISOString();
  };

  const getUpdatedReservation = (): ReservationDTO => {
    if (typeof hourIn.value.value === "number") {
      throw new Error("hourIn must be string");
    }
    return {
      id: 69,
      branchId: branch.id,
      guestId: 69,
      requestDate: new Date().toISOString(),
      reservationDate: addDatePlusHour(date.value, hourIn.value.value),
      clientNumber: parseInt(persons.value),
      payment: "",
      status: 1,
      payDate: "",
      price: 0,
      occasion: occasion.value,
      byClient: false,
      haveGuest: true,
      name: firstName.value,
      surname: lastName.value,
      email: email.value,
      phoneNumber: phone.value,
    };
  };

  const validateData = () => {
    let valid = true;
    firstName.setError(0);
    lastName.setError(0);
    email.setError(0);
    phone.setError(0);
    persons.setError(0);
    hourIn.setError(0);

    // firstName validations
    const firstNameValidation = validateName(firstName.value);
    if (firstNameValidation.code !== 0) {
      valid = false;
      firstName.setError(1);
      switch (firstNameValidation.code) {
        case 1:
          firstName.setErrorMessage(
            "El nombre debe tener al menos 2 caracteres."
          );
          break;
        default:
          firstName.setErrorMessage("Nombre inválido.");
      }
    }

    // lastName validations
    const lastNameValidation = validateName(lastName.value);
    if (lastNameValidation.code !== 0) {
      valid = false;
      lastName.setError(1);
      switch (lastNameValidation.code) {
        case 1:
          lastName.setErrorMessage(
            "El apellido debe tener al menos 2 caracteres."
          );
          break;
        default:
          lastName.setErrorMessage("Apellido inválido.");
      }
    }

    // Email validation
    const emailValidation = validateEmail(email.value);
    if (emailValidation.code !== 0) {
      valid = false;
      email.setError(1);
      switch (emailValidation.code) {
        case 1:
          email.setErrorMessage("Formato de correo inválido.");
          break;
        default:
          email.setErrorMessage("Correo inválido.");
      }
    }

    // Email validation
    const phoneValidation = validatePhone(phone.value);
    if (phoneValidation.code !== 0) {
      valid = false;
      phone.setError(1);
      switch (phoneValidation.code) {
        case 1:
          phone.setErrorMessage("Formato de teléfono inválido.");
          break;
        default:
          phone.setErrorMessage("Teléfono inválido.");
      }
    }

    // Persons validation
    if (!persons.value || persons.value === "") {
      valid = false;
      persons.setError(1);
      persons.setErrorMessage("Indique el número de personas");
    }
    else{
      try {
        parseInt(persons.value)
      } catch (error) {
        valid = false;
        persons.setError(1);
        persons.setErrorMessage("Indique un número postivo");
      }
      if (parseInt(persons.value) < 1){
        valid = false;
        persons.setError(1);
        persons.setErrorMessage("Indique al menos una persona");
      }
    }

    // Hour In validation
    if (!hourIn.value.value || hourIn.value.value === "") {
      valid = false;
      hourIn.setError(1);
      hourIn.setErrorMessage("Indique la hora de llegada");
    }

    // Check that hourIn is less than hourOut
    if (!!hourOut.value.value || hourOut.value.value !== "") {
      if (typeof hourIn.value.value === "number") return false;
      if (typeof hourOut.value.value === "number") return false;
      const [hourInHours, hourInMinutes] = hourIn.value.value
        .split(":")
        .map(Number);
      const [hourOutHours, hourOutMinutes] = hourOut.value.value
        .split(":")
        .map(Number);
      if (hourInHours === hourOutHours &&  hourInMinutes === hourOutMinutes) {
        valid = false;
        hourIn.setError(1);
        hourIn.setErrorMessage("La llegada no puede ser igual a la salida");
      }
    }

    return valid;
  };

  const createReservation = async () => {
    const response = await fetchAPI(
      auth.token!,
      auth.refresh!,
      (token: string) => dispatch(setToken(token)),
      (token: string) => postReservationService(getUpdatedReservation(), token)
    );

    if (response.isError || typeof response.data! === "string") {
      if (!!response.exception) {
      }
    } else {
      const id = response.data!.id;
      setReservations([
        ...reservations,
        {
          ...toReservationProps(response.data!),
          onCloseReservation: () => closeReservation(id),
          onReject: () => rejectReservation(id),
          onAccept: () => acceptReservation(id),
        },
      ]);
    }
  };

  const getReservations = async () => {
    const response = await fetchAPI(
      auth.token!,
      auth.refresh!,
      (token: string) => dispatch(setToken(token)),
      (token: string) => getReservationsService(branch.id, token)
    );

    if (!!response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
      return [];
    } else {
      return response.data!.reservations;
    }
  };

  const acceptReservation = async (id: number) => {
    const response = await fetchAPI(
      auth.token!,
      auth.refresh!,
      (token: string) => dispatch(setToken(token)),
      (token: string) => acceptReservationService(id, token)
    );

    if (!!response.isError) {
      if (!!response.exception) {
      }
    } else {
      // Change state of reservation
      setReservations((reservations) => {
        return reservations.map((reservation) => {
          if (reservation.id === id) {
            return {
              ...reservation,
              state: 2,
            };
          }
          return reservation;
        });
      });
    }
  };

  const rejectReservation = async (id: number) => {
    const response = await fetchAPI(
      auth.token!,
      auth.refresh!,
      (token: string) => dispatch(setToken(token)),
      (token: string) => rejectReservationService(id, token)
    );

    if (!!response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
    } else {
      // Change state of reservation
      setReservations((reservations) => {
        return reservations.map((reservation) => {
          if (reservation.id === id) {
            return {
              ...reservation,
              state: 3,
            };
          }
          return reservation;
        });
      });
    }
  };

  const cancelReservation = async (id: number) => {
    const response = await fetchAPI(
      auth.token!,
      auth.refresh!,
      (token: string) => dispatch(setToken(token)),
      (token: string) => cancelReservationService(id, token)
    );

    if (!!response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
    } else {
    }
  };

  const closeReservation = async (id: number) => {
    const response = await fetchAPI(
      auth.token!,
      auth.refresh!,
      (token: string) => dispatch(setToken(token)),
      (token: string) => closeReservationService(id, token)
    );

    if (!!response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
    } else {
      // Change state of reservation
      setReservations((reservations) => {
        return reservations.map((reservation) => {
          if (reservation.id === id) {
            return {
              ...reservation,
              state: 4,
            };
          }
          return reservation;
        });
      });
    }
  };

  const onSubmit = () => {
    if (validateData()) {
      createReservation();
      setshowModal(false);
    } else {
    }
  };

  const validHoursIn = generateValidHours(branch.hourIn, branch.hourOut).map(
    (x) => {
      return { value: x, name: x };
    }
  );
  const validHoursOut = [validHoursIn[0], ...validHoursIn.slice(2)];
  validHoursIn.pop();

  useEffect(() => {
    const getReservations_ = async () => {
      const aux = (await getReservations()).map((r) => {
        return {
          ...toReservationProps(r),
          onCloseReservation: () => closeReservation(r.id),
          onReject: () => rejectReservation(r.id),
          onAccept: () => acceptReservation(r.id),
        };
      });
      setReservations(aux);
    };
    getReservations_();

    // Warning Persons
    try {
      parseInt(persons.value)
      if (parseInt(persons.value) > branch.capacity){
        persons.setError(2);
        persons.setErrorMessage("Excede la capacidad del local");
      }
      else {
        if (persons.error != 1) persons.setError(0);
      }
    } catch (error) {
    }
  }, [persons]);

  return (
    <BranchReserves
      reservations={reservations}
      color={"#EF7A08"}
      submitButtonColor="#EF7A08"
      header={header}
      date={date}
      hourIn={hourIn}
      validHoursIn={validHoursIn}
      hourOut={hourOut}
      validHoursOut={validHoursOut}
      persons={persons}
      occasion={occasion}
      firstName={firstName}
      lastName={lastName}
      phone={phone}
      email={email}
      haveBranch={branch !== undefined}
      icon_size="450px"
      showModal={showModal}
      setShowModal={setshowModal}
      onSubmit={onSubmit}
    />
  );
}
