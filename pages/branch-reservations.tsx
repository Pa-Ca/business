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
  validateIdentityDocument,
  generateValidHours,
} from "utils";
import {
  alertService,
  getGuestService,
  getBranchReservations,
  postReservationService,
  closeReservationService,
  startReservationService,
  acceptReservationService,
  cancelReservationService,
  rejectReservationService,
  retireReservationService,
} from "services";

export default function BranchReservations({ header, fetchAPI }: PageProps) {
  const branches = useAppSelector((state) => state.branches).branches;
  const branch = branches[useAppSelector((state) => state.branches).current];

  const [applyFilter, setApplyFilter] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pastReservationsNumber, setPastReservationsNumber] = useState<number>(10);
  const [totalHistoricElements,setTotalHistoricElements] = useState<number>(10);

  const [pendingReservationList, setPendingReservationList] = useState<ReservationProps[]>(
    []
  );

  const [startedReservationList, setStartedReservationList] = useState<ReservationProps[]>(
    []
  );

  const [acceptedReservationList, setAcceptedReservationList] = useState<ReservationProps[]>(
    []
  );

  const [historicReservationList, setHistoricReservationList] = useState<ReservationProps[]>(
    []
  );

  const filterStartDate = useInputForm<Date|null>(null);
  const filterEndDate = useInputForm<Date|null>(null);
  const filterStatus = useInputForm<OptionObject<string | null>>({
    label: "",
    value: null,
  });
  const filterStatusOptions: OptionObject<string>[] = [
    {label: "Cerrada", value: "6"},
    {label: "Retirada", value: "4"},
    {label: "Rechazada", value: "2"},
  ];
  const filterIdentityDocument = useInputForm<string>("");
  const filterIdentityDocumentType = useInputForm<OptionObject<string | null>>({
    label: "",
    value: "",
  });
  const filterIdentityDocumentTypeOpt: OptionObject<string>[] = [
    {label: "V", value: "V"},
    {label: "E", value: "E"},
    {label: "J", value: "J"},
    {label: "G", value: "G"},
    {label: "P", value: "P"},
  ];
  const filterFullName = useInputForm<string>("");
  
  // Client data
  const firstName = useInputForm<string>("");
  const lastName = useInputForm<string>("");
  const phone = useInputForm<string>("");
  const email = useInputForm<string>("");
  const identityDocument = useInputForm<string>("");
  const identityDocumentType = useInputForm<OptionObject<string | null>>({
    value: "V",
    label: "V",
  });
  const [identityDocumentChecked, setIdentityDocumentChecked] = useState("");

  // Reservation data
  const tables = useInputForm<string>("");
  const persons = useInputForm<string>("");
  const occasion = useInputForm<string>("");
  const date = useInputForm<Date | null>(new Date());
  const hourIn = useInputForm<OptionObject<string | null>>({
    value: "",
    label: "",
  });
  const hourOut = useInputForm<OptionObject<string | null>>({
    value: "",
    label: "",
  });
  
  const [validHoursIn, setValidHoursIn] = useState<OptionObject<string>[]>(
    []
  );
  const [validHoursOut, setValidHoursOut] = useState<OptionObject<string>[]>(
    []
  );

  const [showModal, setshowModal] = useState(false);

  const addDatePlusHour = (date: Date, hour: string) => {
    if (hour === ""){
      return "";
    }
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
      reservationDateIn: addDatePlusHour(date.value!, hourIn.value.value!),
      reservationDateOut: addDatePlusHour(date.value!, hourOut.value.value!),
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
      identityDocument: identityDocumentType.value.value! + identityDocument.value,
      tableNumber: parseInt(tables.value),
    };
  };

  const validateData = () => {
    let valid = true;
    identityDocument.setCode(0);
    firstName.setCode(0);
    lastName.setCode(0);
    email.setCode(0);
    phone.setCode(0);
    tables.setCode(0);
    persons.setCode(0);
    hourIn.setCode(0);


    // identity Document validation
    const currentIdentityDocument = identityDocumentType.value.value! + identityDocument.value.trim();
    const identityDocumentValidation = validateIdentityDocument(
      identityDocumentType.value.value!, identityDocument.value.trim());
    if (currentIdentityDocument !== identityDocumentChecked){
      valid = false;
      identityDocument.setCode(4);
      identityDocument.setMessage(
        "Haga click en Obtener Usuario");
    }

    if (identityDocumentValidation.code !== 0) {
      valid = false;
      identityDocument.setCode(4);
      switch (identityDocumentValidation.code) {
        case 1:
          identityDocument.setMessage(
            "Introduzca un número de documento de identidad");
          break;
        case 2:
          identityDocument.setMessage(
            "Introduzca un documento de identidad con solo números");
          break;
        default:
          identityDocument.setMessage("Documento inválido.");
      }
    }

    // firstName validations
    const firstNameValidation = validateName(firstName.value);
    if (firstNameValidation.code !== 0) {
      valid = false;
      firstName.setCode(4);
      switch (firstNameValidation.code) {
        case 1:
          firstName.setMessage("Debe tener al menos 2 caracteres.");
          break;
        default:
          firstName.setMessage("Nombre inválido.");
      }
    }

    // lastName validations
    const lastNameValidation = validateName(lastName.value);
    if (lastNameValidation.code !== 0) {
      valid = false;
      lastName.setCode(4);
      switch (lastNameValidation.code) {
        case 1:
          lastName.setMessage("Debe tener al menos 2 caracteres.");
          break;
        default:
          lastName.setMessage("Apellido inválido.");
      }
    }

    // Email validation
    const emailValidation = validateEmail(email.value);
    if (emailValidation.code !== 0) {
      valid = false;
      email.setCode(4);
      switch (emailValidation.code) {
        case 1:
          email.setMessage("Formato de correo inválido.");
          break;
        default:
          email.setMessage("Correo inválido.");
      }
    }

    // Phone validation
    const phoneValidation = validatePhone(phone.value);
    if (phoneValidation.code !== 0) {
      valid = false;
      phone.setCode(4);
      switch (phoneValidation.code) {
        case 1:
          phone.setMessage("Formato de teléfono inválido.");
          break;
        default:
          phone.setMessage("Teléfono inválido.");
      }
    }

    // Persons validation
    if (!persons.value || persons.value === "") {
      valid = false;
      persons.setCode(4);
      persons.setMessage("Indique el número de personas");
    } else {
      try {
        parseInt(persons.value);
      } catch (error) {
        valid = false;
        persons.setCode(4);
        persons.setMessage("Indique un número postivo");
      }
      if (parseInt(persons.value) < 1) {
        valid = false;
        persons.setCode(4);
        persons.setMessage("Indique al menos una persona");
      }
    }

    // Table validation
    if (!tables.value || tables.value === "") {
      valid = false;
      tables.setCode(4);
      tables.setMessage("Indique el número de mesas");
    } else {
      try {
        parseInt(tables.value);
      } catch (error) {
        valid = false;
        tables.setCode(4);
        tables.setMessage("Indique un número postivo");
      }
      if (parseInt(tables.value) < 1) {
        valid = false;
        tables.setCode(4);
        tables.setMessage("Indique al menos una mesa");
      }
    }

    // Hour In validation
    if (!hourIn.value.value) {
      valid = false;
      hourIn.setCode(4);
      hourIn.setMessage("Indique la hora de llegada");
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
        hourIn.setCode(4);
        hourIn.setMessage("La llegada no puede ser igual a la salida");
      }
    }

    return valid;
  };

  const getGuest = async (identityDocument: string) => {
    const response = await fetchAPI(
      (token: string) => getGuestService(identityDocument, token)
    );
    
    if (!!response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
      return [];
    } else {
      return response.data!;
    }
  };

  const getReservationsFiltered = async () => {
    const response = await fetchAPI((token: string) =>
      getBranchReservations(
        branch.id,
        token,
        page - 1,
        pastReservationsNumber,
        filterStartDate.value,
        filterEndDate.value,
        filterFullName.value,
        (filterIdentityDocumentType.value.value || "") + filterIdentityDocument.value,
        filterStatus.value.value === null ? null : [filterStatus.value.value],
      ));

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error al obtener las ventas: ${message}`);
    } else {

      const rejectReservation = async (id: number) => {
        const response = await fetchAPI(
          (token: string) => rejectReservationService(id, token)
        );
    
        if (!!response.isError || typeof response.data === "string") {
          if (!!response.exception) {
          }
        } else {
          // Change state of reservation
          getReservationsFiltered();
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
          getReservationsFiltered();
        }
      };
    
      const retireReservation = async (id: number) => {
        const response = await fetchAPI(
          (token: string) => retireReservationService(id, token)
        );
    
        if (!!response.isError || typeof response.data === "string") {
          const message = !!response.exception
            ? response.exception.message
            : response.error?.message;
          alertService.error(`Error rechazando la reserva: ${message}`);
        } else {
          // Change state of reservation
          getReservationsFiltered();
        }
      };
    
      const startReservation = async (id: number) => {
        const response = await fetchAPI(
          (token: string) => startReservationService(id, token)
        );
    
        if (!!response.isError || typeof response.data === "string") {
          const message = !!response.exception
            ? response.exception.message
            : response.error?.message;
          alertService.error(`Error cancelando la reserva: ${message}`);
        } else {
          // Change state of reservation
          getReservationsFiltered();
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
          getReservationsFiltered();
        }
      };
      const pending = response.data?.pendingReservations!.map((reservationInfo) => {
        return {
            ...toReservationProps(reservationInfo),
            onReject: () => rejectReservation(reservationInfo.id),
            onAccept: () => acceptReservation(reservationInfo.id),
        };
      });
      const accepted = response.data?.acceptedReservations!.map((reservationInfo) => {
        return {
            ...toReservationProps(reservationInfo),
            onRetire: () => retireReservation(reservationInfo.id),
            onStart: () => startReservation(reservationInfo.id),
        };
      });
      const started = response.data?.startedReservations!.map((reservationInfo) => {
        return {
            ...toReservationProps(reservationInfo),
            onCloseReservation: () => closeReservation(reservationInfo.id),
        };
      });
      const historic = response.data?.historicReservations!.map((reservationInfo) => {
        return {
            ...toReservationProps(reservationInfo),
        };
      });
      setPendingReservationList(pending!.reverse());
      setAcceptedReservationList(accepted!.reverse());
      setStartedReservationList(started!.reverse());
      setHistoricReservationList(historic!);
      setTotalPages(response.data?.totalHistoricPages!);
      setTotalHistoricElements(response.data?.totalHistoricElements!);
    }
  };

  const createReservation = async () => {
    const response = await fetchAPI((token: string) =>
      postReservationService(getUpdatedReservation(), token)
    );
    if (response.isError || typeof response.data! === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error creando la reserva: ${message}`, {autoClose: false});
    } else {
      getReservationsFiltered();
    };
  };

  const cancelReservation = async (id: number) => {
    const response = await fetchAPI(
      (token: string) => cancelReservationService(id, token)
    );

    if (!!response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
    } else {
    }
  };

  const onGetGuest = () => {
    const getGuest_ = async () => {
      const currentIdentityDocument = identityDocumentType.value.value! + identityDocument.value.trim();
      const aux = (await getGuest(currentIdentityDocument));
      setIdentityDocumentChecked(currentIdentityDocument);
      if (Array.isArray(aux)) {
          identityDocument.setCode(3);
          identityDocument.setMessage("Usuario no encontrado en la base de datos, complete los datos");        
        }
        else{
          firstName.setValue(aux.name);
          lastName.setValue(aux.surname);
          email.setValue(aux.email);
          phone.setValue(aux.phoneNumber);
          identityDocument.setCode(1);
          identityDocument.setMessage("Usuario obtenido exitosamente");
      }
    };
    getGuest_();
  };

  const onSubmit = () => {
    if (validateData()) {
      createReservation();
      setshowModal(false);

      identityDocument.setValue("");
      identityDocumentType.setValue({
        value: "V",
        label: "V",
      });
      firstName.setValue("");
      lastName.setValue("");
      phone.setValue("");
      email.setValue("");

      hourIn.setValue({
        value: "",
        label: "",
      });
      hourOut.setValue({
        value: "",
        label: "",
      });
      persons.setValue("");
      tables.setValue("");
      occasion.setValue("");
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
    const validHoursOut_ = [validHoursIn_[1], ...validHoursIn_.slice(2)];
    validHoursIn_.pop();

    setValidHoursIn(validHoursIn_);
    setValidHoursOut(validHoursOut_);
  }, []);

  useEffect(() => {
    // Warning Persons
    try {
      parseInt(persons.value);
      if (parseInt(persons.value) > branch.capacity) {
        persons.setCode(3);
        persons.setMessage("Excede la capacidad del local");
      } else {
        if (persons.code != 1) persons.setCode(0);
      }
    } catch (error) {}
  }, [persons.value]);

  useEffect(() => {
    if (!applyFilter) return;
    setApplyFilter(false);
    getReservationsFiltered();
  }, [page, pastReservationsNumber,applyFilter]);

  const currenAverageReserveTime = moment.duration(branch?.averageReserveTime);
  const branchAverageReserveTimeHours = parseInt(
    formatTime(currenAverageReserveTime.hours().toString())
  );
  const branchAverageReserveTimeMinutes = parseInt(
    formatTime(currenAverageReserveTime.minutes().toString())
  );

  return (
    <BranchReserves
      //Reservation List
      pendingReservationList={pendingReservationList}
      acceptedReservationList={acceptedReservationList}
      startedReservationList={startedReservationList}
      //Historic
      historicReservationList={historicReservationList}
      historicCurrentPage={page}
      historicTotalPage={totalPages}
      historicReservationListTotalLenght={totalHistoricElements}
      // totalPages
      onNextPage={() => { setPage(page + 1); setApplyFilter(true); }}
      onPreviousPage={() => { setPage(page - 1); setApplyFilter(true); }}
      //Filter
      filterStartDate={filterStartDate}
      filterEndDate={filterEndDate}
      filterStatus={filterStatus}
      filterStatusOptions={filterStatusOptions}
      filterIdentityDocument={filterIdentityDocument}
      filterIdentityDocumentType={filterIdentityDocumentType}
      filterIdentityDocumentTypeOpt={filterIdentityDocumentTypeOpt}
      filterFullName={filterFullName}
      onGetReservationsFiltered={() => setApplyFilter(true)}
      //Reservation Details
      date={date}
      hourIn={hourIn}
      validHoursIn={validHoursIn}
      hourOut={hourOut}
      validHoursOut={validHoursOut}
      persons={persons}
      tables={tables}
      occasion={occasion}
      //Client Details
      firstName={firstName}
      lastName={lastName}
      phone={phone}
      email={email}
      identityDocument={identityDocument}
      identityDocumentType={identityDocumentType}
      durationHour={branchAverageReserveTimeHours}
      durationMin={branchAverageReserveTimeMinutes}
      //Cositas
      color={"#EF7A08"}
      submitButtonColor="#EF7A08"
      header={header}
      haveBranch={branch !== undefined}
      icon_size="450px"
      showModal={showModal}
      setShowModal={setshowModal}
      onSubmit={onSubmit}
      onGetGuest={onGetGuest}
      cancelButtonColor="Cancel"
    />
  );
}