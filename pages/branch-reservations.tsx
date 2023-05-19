import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Box, BranchReserves } from "paca-ui";
import useInputForm from "paca-ui/src/stories/hooks/useInputForm";
import OptionObject from "paca-ui/src/stories/utils/objects/OptionObject";
import { MAIN_COLOR, SECONDARY_COLOR, GREEN } from "../src/config";
import { useAppSelector } from "../src/context/store";
import postReservationService from "../src/services/reservations/postReservationService";
import validateName from "../src/utils/validateName";
import validateEmail from "../src/utils/validateEmail";
import fetchAPI from "../src/services/fetchAPI";
import { setToken } from "../src/context/slices/auth";
import ReservationDTO from "../src/objects/reservations/ReservationDTO";
import { error } from "console";
import logout from "../src/utils/logout";

export default function BranchReservations() {

  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.auth);

  const branches = useAppSelector((state) => state.branches).branches;
  const branch = branches[useAppSelector((state) => state.branches).current];


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
    status: 4,
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
    // const phoneValidation = validateEmail(phone.value);
    // if (phoneValidation.code !== 0) {
    //   valid = false;
    //   phone.setError(true);
    //   switch (phoneValidation.code) {
    //     case 1:
    //       phone.setErrorMessage("Formato de teléfono inválido.");
    //       break;
    //     default:
    //       phone.setErrorMessage("Teléfono inválido.");
    //   }
    // }

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

  const onSubmit = () => {
    if (validateData()){
      console.log("Data is VALID")
      console.log(getUpdatedReservation())
      createReservation();
    }
    else{
      console.log("INVALID RESERVATION")
    }
    
  };

  const reservations = [
    {
      date: "12 de Febrero",
      reservations: [
        {
          start: "6:00 PM",
          owner: "Bernardo López",
          ownerPhone: "0416-4813706",
          persons: 4,
          tables: 1,
          state: 1,
        },
        {
          start: "6:00 PM",
          owner: "Juan Escudero",
          ownerPhone: "0414-387911",
          persons: 8,
          tables: 2,
          state: 1,
        },
        {
          start: "7:00 PM",
          owner: "Carlos Ribero",
          ownerPhone: "0424-3050325",
          persons: 10,
          tables: 1,
          state: 1,
        },
        {
          start: "7:30 PM",
          owner: "Daniel Sotillo",
          ownerPhone: "0426-4897739",
          persons: 12,
          tables: 2,
          state: 1,
        },
        {
          start: "8:30 PM",
          owner: "Domingo Rastelli",
          ownerPhone: "0412-5723079",
          persons: 12,
          tables: 3,
          state: 1,
        },
      ],
    },
    {
      date: "13 de Febrero",
      reservations: [
        {
          start: "8:00 PM",
          owner: "Emilio Duque",
          ownerPhone: "0416-8352614",
          persons: 2,
          tables: 1,
          state: 0,
        },
        {
          start: "8:30 PM",
          owner: "Juliana Leon",
          ownerPhone: "0426-8352314",
          persons: 2,
          tables: 1,
          state: 0,
        },
        {
          start: "8:30 PM",
          owner: "Rafael Rodriguez",
          ownerPhone: "0412-9357317",
          persons: 4,
          tables: 1,
          state: 0,
        },
        {
          start: "9:00 PM",
          owner: "Elena Rodrigo",
          ownerPhone: "0412-3357447",
          persons: 6,
          tables: 1,
          state: 0,
        },
        {
          start: "9:30 PM",
          owner: "Magdalena Alfaro",
          ownerPhone: "0414-9357147",
          persons: 2,
          tables: 1,
          state: 0,
        },
      ],
    },
    {
      date: "14 de Febrero",
      reservations: [
        {
          start: "7:00 PM",
          owner: "Alejandro Moreno",
          ownerPhone: "0426-9462614",
          persons: 4,
          tables: 1,
          state: 0,
        },
        {
          start: "7:00 PM",
          owner: "Fernando Zapatero",
          ownerPhone: "0416-8352457",
          persons: 2,
          tables: 1,
          state: 0,
        },
        {
          start: "8:00 PM",
          owner: "Elio Andrade",
          ownerPhone: "0426-7351318",
          persons: 7,
          tables: 2,
          state: 0,
        },
        {
          start: "8:00 PM",
          owner: "Oracio Duran",
          ownerPhone: "0416-4354347",
          persons: 2,
          tables: 1,
          state: 0,
        },
        {
          start: "8:30 PM",
          owner: "Ligia Cabeza",
          ownerPhone: "0412-5357187",
          persons: 2,
          tables: 1,
          state: 0,
        },
      ],
    },
    {
      date: "15 de Febrero",
      reservations: [
        {
          start: "7:30 PM",
          owner: "Ernesto Sivira",
          ownerPhone: "0416-2432614",
          persons: 4,
          tables: 1,
          state: 0,
        },
        {
          start: "7:30 PM",
          owner: "Ignacio Cuadrado",
          ownerPhone: "0426-5352457",
          persons: 2,
          tables: 1,
          state: 0,
        },
        {
          start: "8:00 PM",
          owner: "Cristopher Bermudez",
          ownerPhone: "0412-8351318",
          persons: 7,
          tables: 2,
          state: 0,
        },
        {
          start: "8:30 PM",
          owner: "Manuel Sucre",
          ownerPhone: "0416-7354341",
          persons: 4,
          tables: 1,
          state: 0,
        },
        {
          start: "8:30 PM",
          owner: "Andrea Dominguez",
          ownerPhone: "0416-6357187",
          persons: 2,
          tables: 1,
          state: 0,
        },
      ],
    },
  ];
  const validHoursIn = [
    { value: '09:00:00', name: '9:00 am' },
    { value: '2', name: '9:30 am' },
    { value: '3', name: '10:00 am' },
    { value: '4', name: '10:30 am' },
    { value: '5', name: '11:00 am' },
    { value: '6', name: '11:30 am' },
    { value: '7', name: '12:00 pm' },
    { value: '8', name: '12:30 pm' },
    { value: '9', name: '1:00 pm' },
    { value: '10', name: '1:30 pm' },
    { value: '11', name: '2:00 am' },
    { value: '12', name: '2:30 pm' },
    { value: '13', name: '3:00 pm' },
    { value: '14', name: '3:30 pm' },
    { value: '15', name: '4:00 pm' },
    { value: '16', name: '4:30 pm' },
    { value: '17', name: '5:00 pm' },
  ];

  const validHoursOut = [
    { value: '1', name: '9:00 am' },
    { value: '2', name: '9:30 am' },
    { value: '3', name: '10:00 am' },
    { value: '4', name: '10:30 am' },
    { value: '5', name: '11:00 am' },
    { value: '6', name: '11:30 am' },
    { value: '7', name: '12:00 pm' },
    { value: '8', name: '12:30 pm' },
    { value: '9', name: '1:00 pm' },
    { value: '10', name: '1:30 pm' },
    { value: '11', name: '2:00 am' },
    { value: '12', name: '2:30 pm' },
    { value: '13', name: '3:00 pm' },
    { value: '14', name: '3:30 pm' },
    { value: '15', name: '4:00 pm' },
    { value: '16', name: '4:30 pm' },
    { value: '17', name: '5:00 pm' },
  ];

  const header={
    logged: true,
    onPacaClick: () => {},
    onLogout: () => logout(auth.token!, auth.refresh!, dispatch, router, undefined, undefined, () => {}),
    onEditProfile: () => router.push("/profile"),
    onRightSectionClick: () => router.push("/branch-reservations"),
    picture: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?cs=srgb&dl=pexels-chan-walrus-941861.jpg&fm=jpg",
    name: "Sempre Dritto",
    color: "#EF7A08",
  };

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
      showModal={showModal}
      setShowModal={setshowModal}
      onSubmit={onSubmit}
    />
    );
}