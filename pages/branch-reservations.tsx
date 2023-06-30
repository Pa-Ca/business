import React, { useEffect, useState } from "react";
import moment from "moment";
import { useAppSelector } from "context";
import { PageProps, ReservationDTO, toReservationProps } from "objects";
import {
  useInputForm,
  OptionObject,
  BranchReserves,
  ReservationProps,
} from "paca-ui";
import {
  formatTime,
  validateName,
  validateEmail,
  validatePhone,
  generateValidHours,
} from "utils";
import {
  alertService,
  postReservationService,
  getReservationsService,
  closeReservationService,
  acceptReservationService,
  cancelReservationService,
  rejectReservationService,
} from "services";

export default function BranchReservations({ header, fetchAPI }: PageProps) {
  const branches = useAppSelector((state) => state.branches).branches;
  const branch = branches[useAppSelector((state) => state.branches).current];
  const [validHoursIn, setValidHoursIn] = useState<OptionObject<string>[]>([]);
  const [validHoursOut, setValidHoursOut] = useState<OptionObject<string>[]>(
    []
  );
  const [reservationsList, setReservationsList] = useState<ReservationProps[]>(
    []
  );

  // Reservation data
  const persons = useInputForm<string>("");
  const occasion = useInputForm<string>("");
  const date = useInputForm<Date>(new Date());
  const hourIn = useInputForm<OptionObject<string | null>>({
    value: null,
    label: "",
  });
  const hourOut = useInputForm<OptionObject<string | null>>({
    value: null,
    label: "",
  });

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
    return {
      id: 69,
      branchId: branch.id,
      guestId: 69,
      requestDate: new Date().toISOString(),
      reservationDate: addDatePlusHour(date.value, hourIn.value.value!),
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
          firstName.setErrorMessage("Debe tener al menos 2 caracteres.");
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
          lastName.setErrorMessage("Debe tener al menos 2 caracteres.");
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
    } else {
      try {
        parseInt(persons.value);
      } catch (error) {
        valid = false;
        persons.setError(1);
        persons.setErrorMessage("Indique un número postivo");
      }
      if (parseInt(persons.value) < 1) {
        valid = false;
        persons.setError(1);
        persons.setErrorMessage("Indique al menos una persona");
      }
    }

    // Hour In validation
    if (!hourIn.value.value) {
      valid = false;
      hourIn.setError(1);
      hourIn.setErrorMessage("Indique la hora de llegada");
    }

    // Check that hourIn is less than hourOut
    if (!!hourOut.value.value) {
      const [hourInHours, hourInMinutes] = hourIn.value
        .value!.split(":")
        .map(Number);
      const [hourOutHours, hourOutMinutes] = hourOut.value
        .value!.split(":")
        .map(Number);
      if (hourInHours === hourOutHours && hourInMinutes === hourOutMinutes) {
        valid = false;
        hourIn.setError(1);
        hourIn.setErrorMessage("La llegada no puede ser igual a la salida");
      }
    }

    return valid;
  };

  const createReservation = async () => {
    const response = await fetchAPI((token: string) =>
      postReservationService(getUpdatedReservation(), token)
    );

    if (response.isError || typeof response.data! === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error creando la reserva: ${message}`);
    } else {
      const id = response.data!.id;
      setReservationsList([
        ...reservationsList,
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
    const response = await fetchAPI((token: string) =>
      getReservationsService(branch.id, token)
    );

    if (!!response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error cargando las reservas: ${message}`);
      return [];
    } else {
      return response.data!.reservations;
    }
  };

  const acceptReservation = async (id: number) => {
    const response = await fetchAPI((token: string) =>
      acceptReservationService(id, token)
    );

    if (!!response.isError) {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error aceptando la reserva: ${message}`);
    } else {
      // Change state of reservation
      setReservationsList((r) => {
        return r.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              state: 2,
            };
          }
          return r;
        });
      });
    }
  };

  const rejectReservation = async (id: number) => {
    const response = await fetchAPI((token: string) =>
      rejectReservationService(id, token)
    );

    if (!!response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error rechazando la reserva: ${message}`);
    } else {
      // Change state of reservation
      setReservationsList((r) => {
        return r.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              state: 3,
            };
          }
          return r;
        });
      });
    }
  };

  const cancelReservation = async (id: number) => {
    const response = await fetchAPI((token: string) =>
      cancelReservationService(id, token)
    );

    if (!!response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error cancelando la reserva: ${message}`);
    } else {
    }
  };

  const closeReservation = async (id: number) => {
    const response = await fetchAPI((token: string) =>
      closeReservationService(id, token)
    );

    if (!!response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error cerrando la reserva: ${message}`);
    } else {
      // Change state of reservation
      setReservationsList((r) => {
        return r.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              state: 4,
            };
          }
          return r;
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

  useEffect(() => {
    if (!branch) return;
    const validHoursIn_ = generateValidHours(branch.hourIn, branch.hourOut).map(
      (x) => {
        return { value: x, label: x };
      }
    );
    const validHoursOut_ = [validHoursIn_[0], ...validHoursIn_.slice(2)];
    validHoursIn_.pop();

    setValidHoursIn(validHoursIn_);
    setValidHoursOut(validHoursOut_);
  }, []);

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
      setReservationsList(aux);
    };
    getReservations_();
  }, []);

  useEffect(() => {
    // Warning Persons
    try {
      parseInt(persons.value);
      if (parseInt(persons.value) > branch.capacity) {
        persons.setError(2);
        persons.setErrorMessage("Excede la capacidad del local");
      } else {
        if (persons.error != 1) persons.setError(0);
      }
    } catch (error) {}
  }, [persons.value]);

  const currenAverageReserveTime = moment.duration(branch?.averageReserveTime);
  const branchAverageReserveTimeHours = parseInt(
    formatTime(currenAverageReserveTime.hours().toString())
  );
  const branchAverageReserveTimeMinutes = parseInt(
    formatTime(currenAverageReserveTime.minutes().toString())
  );

  return (
    <BranchReserves
      durationHour={branchAverageReserveTimeHours}
      durationMin={branchAverageReserveTimeMinutes}
      reservations={reservationsList}
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
      cancelButtonColor="Cancel"
    />
  );
}
