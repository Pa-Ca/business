import React, { useMemo, useState } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { GOOGLE_MAPS_API_KEY } from "config";
import { useSession, signOut } from "next-auth/react";
import {
  logout,
  cousines,
  locations,
  formatTime,
  validateName,
  validatePhone,
} from "utils";
import {
  setName,
  setBranches,
  setPhoneNumber,
  useAppSelector,
  setCurrentBranch,
} from "context";
import {
  S3UploadService,
  getBranchesService,
  createBranchService,
  updateBranchService,
  updateBusinessService,
  updateDefaultTaxService,
  resetPasswordRequestService,
  resetPasswordWithOldPasswordService,
  deleteDefaultTaxService,
  createDefaultTaxService,
} from "services";
import {
  PageProps,
  BranchDTO,
  LocalTime,
  Duration as BranchDuration,
  TaxType,
} from "objects";
import {
  useInputForm,
  InputFormHook,
  OptionObject,
  BusinessProfile,
  TaxObject,
} from "paca-ui";

export default function Profile({ header, fetchAPI }: PageProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.auth);
  const business = useAppSelector((state) => state.business);
  const { data: session } = useSession();
  const branches = useAppSelector((state) => state.branches).branches;
  const branchIndex = useAppSelector((state) => state.branches).current;

  // Business data
  const password = useInputForm("");
  const newPassword = useInputForm("");
  const [done, setDone] = useState(false);
  const email = useInputForm(auth.email!);
  const name = useInputForm(business.name!);
  const [emailSent, setEmailSent] = useState(false);
  const phoneNumber = useInputForm(business.phoneNumber!);

  // Current branch data
  const emptyOption = { label: "", value: null };
  const branchName = useInputForm("");
  const branchPrice = useInputForm("");
  const branchPhone = useInputForm("");
  const branchMapsLink = useInputForm("");
  const branchCapacity = useInputForm("");
  const branchDescription = useInputForm("");
  const branchOpeningTimeHour = useInputForm("");
  const branchClosingTimeHour = useInputForm("");
  const branchOpeningTimeMinute = useInputForm("");
  const branchClosingTimeMinute = useInputForm("");
  const branchAverageReserveTimeHours = useInputForm("");
  const branchAverageReserveTimeMinutes = useInputForm("");
  const branchType = useInputForm<OptionObject<string | null>>(emptyOption);
  const branchLocation = useInputForm<OptionObject<string | null>>(emptyOption);

  const branch = useMemo(() => {
    if (branchIndex === -1) {
      return undefined;
    }

    const branch = branches[branchIndex].branch;

    branchName.setValue(branch.name);
    branchPhone.setValue(branch.phoneNumber);
    branchMapsLink.setValue(branch.mapsLink);
    branchDescription.setValue(branch.overview);
    branchCapacity.setValue(`${branch.capacity}`);
    branchPrice.setValue(`${branch.reservationPrice}`);
    branchType.setValue({ label: branch.type, value: branch.type });
    branchLocation.setValue({ label: branch.location, value: branch.location });

    const openingHour = branch.hourIn.split(":")[0];
    const closingHour = branch.hourOut.split(":")[0];
    const openingTime = moment(branch.hourIn, "HH:mm:ss");
    const closingTime = moment(branch.hourOut, "HH:mm:ss");
    const averageReserveTime = moment.duration(branch.averageReserveTime);

    branchOpeningTimeHour.setValue(openingHour);
    branchClosingTimeHour.setValue(closingHour);
    branchOpeningTimeMinute.setValue(
      formatTime(openingTime.minutes().toString())
    );
    branchClosingTimeMinute.setValue(
      formatTime(closingTime.minutes().toString())
    );
    branchAverageReserveTimeHours.setValue(
      formatTime(averageReserveTime.hours().toString())
    );
    branchAverageReserveTimeMinutes.setValue(
      formatTime(averageReserveTime.minutes().toString())
    );

    return branch;
  }, [branchIndex, branches]);

  const defaultTaxes = useMemo(() => {
    if (!branch) {
      return undefined;
    }

    return branches[branchIndex].defaultTaxes;
  }, [branchIndex, branches]);

  const getUpdatedBranch = (): BranchDTO => {
    if (!branch) {
      return {} as BranchDTO;
    }
  
    const hourIn =
      branchOpeningTimeHour.value === "24"
        ? "23:59:59"
        : `${branchOpeningTimeHour.value}:${branchOpeningTimeMinute.value}:00`;
    const hourOut =
      branchClosingTimeHour.value === "24"
        ? "23:59:59"
        : `${branchClosingTimeHour.value}:${branchClosingTimeMinute.value}:00`;
    const averageReserveTime =
      `PT${branchAverageReserveTimeHours.value}H${branchAverageReserveTimeMinutes.value}M` as BranchDuration;

    const dto: BranchDTO = {
      id: branch.id,
      businessId: branch.businessId,
      name: branchName.value,
      type: branchType.value.value!,
      score: branch.score,
      location: branchLocation.value.value!,
      mapsLink: branchMapsLink.value,
      overview: branchDescription.value,
      phoneNumber: branchPhone.value,
      capacity: parseInt(branchCapacity.value),
      reservationPrice: parseFloat(branchPrice.value),
      reserveOff: branch.reserveOff,
      averageReserveTime: averageReserveTime as BranchDuration,
      visibility: branch.visibility,
      hourIn: hourIn as LocalTime,
      hourOut: hourOut as LocalTime,
      dollarExchange: branch.dollarExchange,
      deleted: false,
    };
    return dto;
  };

  const saveName = async (newName: string) => {
    const response = await fetchAPI((token: string) =>
      updateBusinessService({ id: auth.id!, name: newName }, token)
    );

    if (response.isError) {
      name.setCode(4);
      name.setMessage("Error guardando el nombre.");
    } else {
      dispatch(setName(name.value));
    }
  };

  const savePhoneNumber = async (newPhoneNumber: string) => {
    const response = await fetchAPI((token: string) =>
      updateBusinessService(
        { id: auth.id!, phoneNumber: newPhoneNumber },
        token
      )
    );

    if (response.isError) {
      phoneNumber.setCode(4);
      phoneNumber.setMessage("Error guardando el numero de telefono.");
    } else {
      dispatch(setPhoneNumber(phoneNumber.value));
    }
  };

  const onProfileUploadImage = async (file: File) => {
    const response = await S3UploadService(
      file,
      `business-${business.id}-profile.jpeg`
    );

    if (!response.data || response.isError) return;
  };

  const saveNewPassword = async () => {
    const response = await resetPasswordWithOldPasswordService(
      auth.email!,
      password.value,
      newPassword.value
    );

    if (response.isError) {
      if (!!response.exception) {
        switch (response.exception.code) {
          case 2:
          case 3:
            newPassword.setMessage(
              "La contraseña debe tener entre 8 y 64 caracteres."
            );
            newPassword.setCode(4);
            break;
          case 9:
            password.setMessage("Contraseña incorrecta");
            password.setCode(4);
            break;
        }
      }
    } else {
      password.setValue("");
      newPassword.setValue("");
      setDone(true);
      logout(
        auth.token!,
        auth.refresh!,
        dispatch,
        router,
        "/reset-password",
        {
          completed: true,
        },
        () => {
          if (session) signOut();
        }
      );
    }
  };

  const updateBranch = async (deleted: boolean = false) => {
    const dto = getUpdatedBranch();
    dto.deleted = deleted;
    const response = await fetchAPI((token: string) =>
      updateBranchService(dto, token)
    );

    if (response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
    } else {
      if (!deleted) {
        dispatch(
          setBranches([
            ...branches.slice(0, branchIndex),
            {
              ...branches[branchIndex],
              ...response.data!,
            },
            ...branches.slice(branchIndex + 1, branches.length),
          ])
        );
      } else {
        const branchList = [
          ...branches.slice(0, branchIndex),
          ...branches.slice(branchIndex + 1, branches.length),
        ];
        dispatch(setBranches(branchList));

        if (branchList.length > 0) {
          dispatch(setCurrentBranch(0));
        }
        else {
          dispatch(setCurrentBranch(-1));
        }
        router.reload();
      }
    }
  };

  const onForgotClick = async () => {
    const response = await resetPasswordRequestService(auth.email!);

    if (!!response.isError) {
      return;
    }

    setEmailSent(true);
  };

  const onCreateBranch = async (
    name: InputFormHook<string>,
    phoneNumber: InputFormHook<string>,
    price: InputFormHook<string>,
    type: InputFormHook<OptionObject<string | null>>,
    capacity: InputFormHook<string>,
    location: InputFormHook<OptionObject<string | null>>,
    averageReserveTimeHours: InputFormHook<string>,
    averageReserveTimeMinutes: InputFormHook<string>,
    openingTimeHour: InputFormHook<string>,
    openingTimeMinute: InputFormHook<string>,
    closingTimeHour: InputFormHook<string>,
    closingTimeMinute: InputFormHook<string>,
    description: InputFormHook<string>,
    mapsLink: InputFormHook<string>
  ) => {
    let error = false;
    let validation;

    // Verify that the name have at least 3 characters
    validation = validateName(name.value);
    if (validation.code !== 0) {
      name.setValue(validation.processedName);
      name.setCode(4);
      name.setMessage("Debe tener al menos 3 caracteres.");
      error = true;
    }

    // Verify that capacity is positive
    if (parseInt(capacity.value) <= 0) {
      capacity.setCode(4);
      capacity.setMessage("La capacidad debe ser mayor a 0.");
      error = true;
    }

    // Verify that the average reserve time hours is valid
    if (averageReserveTimeHours.value === "") {
      averageReserveTimeHours.setCode(4);
      averageReserveTimeHours.setMessage("Debe ingresar la cantidad de horas.");
      error = true;
    }

    // Verify that the average reserve time minutes is valid
    if (averageReserveTimeMinutes.value === "") {
      averageReserveTimeMinutes.setCode(4);
      averageReserveTimeMinutes.setMessage(
        "Debe ingresar la cantidad de minutos."
      );
      error = true;
    }

    // Verify that the type is not empty
    if (!type.value.value) {
      type.setCode(4);
      type.setMessage("Debe seleccionar un tipo.");
      error = true;
    }

    // Verify that the cost is not empty nor zero
    if (price.value === "" || parseFloat(price.value) <= 0) {
      price.setCode(4);
      price.setMessage("Debe ingresar un precio mayor a 0.");
      error = true;
    }

    // Verify that the opening time hour is valid
    if (openingTimeHour.value === "") {
      openingTimeHour.setCode(4);
      openingTimeHour.setMessage("Debe ingresar la hora de apertura.");
      error = true;
    }

    // Verify that the opening time minute is valid
    if (openingTimeMinute.value === "") {
      openingTimeMinute.setCode(4);
      openingTimeMinute.setMessage("Debe ingresar los minutos de apertura.");
      error = true;
    }

    // Verify that the closing time hour is valid
    if (closingTimeHour.value === "") {
      closingTimeHour.setCode(4);
      closingTimeHour.setMessage("Debe ingresar la hora de cierre.");
      error = true;
    }

    // Verify that the closing time minute is valid
    if (closingTimeMinute.value === "") {
      closingTimeMinute.setCode(4);
      closingTimeMinute.setMessage("Debe ingresar los minutos de cierre.");
      error = true;
    }

    // Verify that the phone number is valid
    validation = validatePhone(phoneNumber.value);
    if (validation.code !== 0) {
      phoneNumber.setValue(validation.processedPhone);
      phoneNumber.setCode(4);
      phoneNumber.setMessage("El número de teléfono no es válido.");
    }

    // Verify that the location is not empty
    if (!location.value.value) {
      location.setCode(4);
      location.setMessage("Debe seleccionar una ubicación.");
      error = true;
    }

    if (error) {
      return;
    }

    const hourIn: LocalTime =
      openingTimeHour.value === "24"
        ? "23:59:59"
        : (`${parseInt(openingTimeHour.value)
            .toString()
            .padStart(2, "0")}:${parseInt(openingTimeMinute.value)
            .toString()
            .padStart(2, "0")}:00` as LocalTime);
    const hourOut: LocalTime =
      closingTimeHour.value === "24"
        ? "23:59:59"
        : (`${parseInt(closingTimeHour.value)
            .toString()
            .padStart(2, "0")}:${parseInt(closingTimeMinute.value)
            .toString()
            .padStart(2, "0")}:00` as LocalTime);

    const dto: BranchDTO = {
      id: 0,
      businessId: business.id!,
      location: location.value.value!,
      mapsLink: mapsLink.value,
      name: name.value,
      overview: description.value,
      phoneNumber: phoneNumber.value,
      type: type.value.value!,
      score: 0,
      capacity: parseInt(capacity.value),
      reservationPrice: parseFloat(price.value),
      reserveOff: false,
      averageReserveTime: `PT${parseInt(
        averageReserveTimeHours.value
      )}H${parseInt(averageReserveTimeMinutes.value)}M0S`,
      visibility: true,
      hourIn,
      hourOut,
      deleted: false,
      dollarExchange: 1,
    };

    const response = await fetchAPI((token: string) =>
      createBranchService(dto, token)
    );

    if (response.isError) {
      if (!!response.exception) {
      }
    } else {
      // Get business branches
      const branchesResponse = await fetchAPI((token: string) =>
        getBranchesService(auth.id!, token)
      );

      if (
        !!branchesResponse.isError ||
        typeof branchesResponse.data === "string"
      ) {
        return;
      }

      const branchList = branchesResponse.data!.branches.filter(
        (branch) => !branch.branch.deleted
      );
      dispatch(setBranches(branchList));
      dispatch(setCurrentBranch(branchList.length - 1));

      router.reload();
    }
  };

  const onCreateDefaultTax = async () => {
    if (!branch || !defaultTaxes) {
      return;
    }

    const response = await fetchAPI((token: string) =>
      createDefaultTaxService(
        {
          id: 0,
          branchId: branch!.id!,
          name: "Tarifa Nº " + (taxes.length + 1).toString(),
          type: TaxType["%"],
          value: 0,
        },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
    } else {
      const newTax = response.data!;
      const newTaxes = [...defaultTaxes, newTax];

      dispatch(
        setBranches(
          branches.map((b) => {
            if (b.branch.id === branch.id) {
              return {
                ...b,
                defaultTaxes: newTaxes,
              };
            }

            return b;
          })
        )
      );
    }
  };

  const taxes: TaxObject[] = useMemo(() => {
    if (!branch || !defaultTaxes) {
      return [];
    }

    const updateTax = async (
      id: number,
      name: InputFormHook<string>,
      type: InputFormHook<string>,
      value: InputFormHook<string>
    ) => {
      const dto = {
        id,
        name: name.value,
        type: TaxType[type.value as keyof typeof TaxType],
        value: Number(value.value) || 0,
      };
      const response = await fetchAPI((token: string) =>
        updateDefaultTaxService(dto, token)
      );

      if (response.isError || typeof response.data === "string") {
        name.setCode(4);
        name.setMessage("Error guardando el nombre.");
      } else {
        // Update branch taxes
        const newTax = response.data!;
        const newTaxes = defaultTaxes.map((tax) => {
          if (tax.id === newTax.id) {
            return newTax;
          }

          return tax;
        });
        dispatch(
          setBranches(
            branches.map((b) => {
              if (b.branch.id === branch.id) {
                return {
                  ...b,
                  defaultTaxes: newTaxes,
                };
              }

              return b;
            })
          )
        );
      }
    };

    const deleteTax = async (id: number) => {
      const response = await fetchAPI((token: string) =>
        deleteDefaultTaxService(id, token)
      );

      if (response.isError || typeof response.data === "string") {
        return;
      }

      // Update branch taxes
      const newTaxes = defaultTaxes.filter((tax) => tax.id !== id);
      dispatch(
        setBranches(
          branches.map((b) => {
            if (b.branch.id === branch.id) {
              return {
                ...b,
                defaultTaxes: newTaxes,
              };
            }

            return b;
          })
        )
      );
    };

    return defaultTaxes.map((tax) => {
      return {
        ...tax,
        saveValueFunction: (
          name: InputFormHook<string>,
          type: InputFormHook<string>,
          value: InputFormHook<string>
        ) => updateTax(tax.id, name, type, value),
        deleteValueFunction: () => deleteTax(tax.id),
      };
    });
  }, [defaultTaxes]);

  return (
    <BusinessProfile
      header={header}
      // [TODO] Fix main business image
      mainImage=""
      profilePicture={header.picture!}
      onCreateBranch={onCreateBranch}
      // [TODO]
      onPictureClick={() => {}}
      // Business data
      name={name}
      email={email}
      phoneNumber={phoneNumber}
      password={password}
      newPassword={newPassword}
      emailSent={emailSent}
      done={done}
      onSaveName={saveName}
      onSavePhoneNumber={savePhoneNumber}
      onChangePassword={saveNewPassword}
      onForgotPassword={onForgotClick}
      haveBranch={branch !== undefined}
      branchName={branchName}
      branchDescription={branchDescription}
      branchLocation={branchLocation}
      branchPhone={branchPhone}
      branchCapacity={branchCapacity}
      branchAverageReserveTimeHours={branchAverageReserveTimeHours}
      branchAverageReserveTimeMinutes={branchAverageReserveTimeMinutes}
      branchPrice={branchPrice}
      branchMapsLink={branchMapsLink}
      branchType={branchType}
      branchOpeningTimeHour={branchOpeningTimeHour}
      branchOpeningTimeMinute={branchOpeningTimeMinute}
      branchClosingTimeHour={branchClosingTimeHour}
      branchClosingTimeMinute={branchClosingTimeMinute}
      branchTypeOptions={cousines}
      branchLocationOptions={locations}
      mapsApiKey={GOOGLE_MAPS_API_KEY || ""}
      taxes={taxes}
      onSaveBranchName={() => updateBranch()}
      onSaveBranchDescription={() => updateBranch()}
      onSaveBranchLocation={() => updateBranch()}
      onSaveBranchPhone={() => updateBranch()}
      onSaveBranchCapacity={() => updateBranch()}
      onSaveBranchAverageReserveTime={() => updateBranch()}
      onSaveBranchPrice={() => updateBranch()}
      onSaveBranchType={() => updateBranch()}
      onSaveBranchMapsLink={() => updateBranch()}
      onSaveBranchClosingTime={() => updateBranch()}
      onSaveBranchOpeningTime={() => updateBranch()}
      onDeleteBranch={() => updateBranch(true)}
      onSaveProfilePicture={() => {}}
      uploadProfilePicture={onProfileUploadImage}
      onAddTax={onCreateDefaultTax}
    />
  );
}
