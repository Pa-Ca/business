import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { BranchReserves, ReservationProps } from "paca-ui";
import useInputForm from "paca-ui/src/stories/hooks/useInputForm";
import OptionObject from "paca-ui/src/stories/utils/objects/OptionObject";
import { setCurrentBranch } from "../src/context/slices/branches";
import { useAppSelector } from "../src/context/store";
import postReservationService from "../src/services/reservations/postReservationService";
import getReservationsService from "../src/services/reservations/getReservationsService";
import acceptReservationService from "../src/services/reservations/acceptReservationService";
import cancelReservationService from "../src/services/reservations/cancelReservationService";
import validateName from "../src/utils/validateName";
import validateEmail from "../src/utils/validateEmail";
import fetchAPI from "../src/services/fetchAPI";
import { setToken } from "../src/context/slices/auth";
import ReservationDTO from "../src/objects/reservations/ReservationDTO";
import logout from "../src/utils/logout";
import generateValidHours from "../src/utils/generateValidHours";
import validatePhone from "../src/utils/validatePhone";
import rejectReservationService from "../src/services/reservations/rejectReservationService";

export default function BranchReservations() {

  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.auth);

  const branches = useAppSelector((state) => state.branches).branches;
  const branch = branches[useAppSelector((state) => state.branches).current];

  const [reservations, setReservations] = useState<ReservationProps[]>([]);  


  // Reservation data
  const date = useInputForm<Date >(new Date());
  const hourIn = useInputForm<OptionObject >({ value: "", name: "" });
  const hourOut = useInputForm<OptionObject >({ value: "", name: "" });
  const persons = useInputForm<string >("");
  const occasion = useInputForm<string >("");
  
  // Client data
  const firstName = useInputForm("");
  const lastName = useInputForm("");
  const phone = useInputForm("");
  const email = useInputForm("");
  const [showModal, setshowModal] = useState(false);

  const addDatePlusHour = (date : Date, hour : string) => {
    const [hours, minutes, seconds] = hour.split(":").map(Number);
    date.setHours(hours, minutes, seconds);
    return  date.toISOString();
  }

  const getUpdatedReservation = (): ReservationDTO => {
    if (typeof hourIn.value.value === "number"){
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
    status: 0,
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

    // firstName validations
    const firstNameValidation = validateName(firstName.value);
    if (firstNameValidation.code !== 0) {
      valid = false;
      firstName.setError(true);
      switch (firstNameValidation.code) {
        case 1:
          firstName.setErrorMessage("El nombre debe tener al menos 2 caracteres.");
          break;
        default:
          firstName.setErrorMessage("Nombre inválido.");
      }
    }

    // lastName validations
    const lastNameValidation = validateName(lastName.value);
    if (lastNameValidation.code !== 0) {
      valid = false;
      lastName.setError(true);
      switch (lastNameValidation.code) {
        case 1:
          lastName.setErrorMessage("El apellido debe tener al menos 2 caracteres.");
          break;
        default:
          lastName.setErrorMessage("Apellido inválido.");
      }
    }

    // Email validation
    const emailValidation = validateEmail(email.value);
    if (emailValidation.code !== 0) {
      valid = false;
      email.setError(true);
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
      phone.setError(true);
      switch (phoneValidation.code) {
        case 1:
          phone.setErrorMessage("Formato de teléfono inválido.");
          break;
        default:
          phone.setErrorMessage("Teléfono inválido.");
      }
    }

    // Persons validation
    if (!persons.value || persons.value === ""){
      valid = false;
      persons.setError(true);
      persons.setErrorMessage("Indique el número de personas");
    }  
    // Hour In validation
    if (!hourIn.value.value || hourIn.value.value === ""){
      valid = false;
      hourIn.setError(true);
      hourIn.setErrorMessage("Indique la hora de llegada");
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

    if (response.isError) {
      if (!!response.exception) {
      }
    } else {
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

    
    if (!!response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
    } else {
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

  const onSubmit = () => {
    if (validateData()){
      console.log("Data is VALID")
      console.log(getUpdatedReservation())
      createReservation();
      setshowModal(false);
    }
    else{
      console.log("INVALID RESERVATION")
    }
    
  };
  
  const validHoursIn = generateValidHours(branch.hourIn,branch.hourOut).map(x => {return {value: x, name: x}});
  const validHoursOut = validHoursIn.slice(1);
  validHoursIn.pop();

  const userRole: "business" = "business";
  const header={
    logged: true,
    onPacaClick: () => {},
    onLogout: () => logout(auth.token!, auth.refresh!, dispatch, router, undefined, undefined, () => {}),
    onEditProfile: () => router.push("/profile"),
    onRightSectionClick: () => router.push("/branch-reservations"),
    userRole: userRole,
    currentBranch: !!branch ? `${branch.name!} | ${branch.location}` : "",
    branchOptions: branches.map((branch, index) => {
      return {
        name: `${branch.name!} | ${branch.location}`,
        func: () => {
          dispatch(setCurrentBranch(index));
          router.reload();
        },
      };
    }),
    picture: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?cs=srgb&dl=pexels-chan-walrus-941861.jpg&fm=jpg",
    name: "Sempre Dritto",
    color: "#EF7A08",
  };


  useEffect(()=> {
    const getReservations_ = async () => {

      const aux = (await getReservations()).map(
        r => {return {
          start : r.reservationDate.substring(
            r.reservationDate.indexOf("T") + 1, 
            r.reservationDate.lastIndexOf(".")
          ),
          owner: r.name + "" + r.surname,
          ownerPhone: r.phoneNumber,
          persons: r.clientNumber,
          tables: 1,
          state: r.status,
          date: r.reservationDate,
          onCloseReservation: () => cancelReservation(r.id),
          onReject: () => rejectReservation(r.id),
          onAccept: () => acceptReservation(r.id),
        }}
      );
      setReservations(aux);
    }
    getReservations_();
  }, []);

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