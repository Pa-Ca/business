import React, { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import logout from "../src/utils/logout";
import { useDispatch } from "react-redux";
import cousines from "../src/utils/cousines";
import locations from "../src/utils/locations";
import fetchAPI from "../src/services/fetchAPI";
import PageProps from "../src/objects/PageProps";
import formatTime from "../src/utils/formatTime";
import { useSession, signOut } from "next-auth/react";
import { setToken } from "../src/context/slices/auth";
import { useAppSelector } from "../src/context/store";
import { BusinessProfile, HeaderProps } from "paca-ui";
import { setName } from "../src/context/slices/business";
import { setPhoneNumber } from "../src/context/slices/business";
import useInputForm from "paca-ui/src/stories/hooks/useInputForm";
import changeNameService from "../src/services/business/changeNameService";
import getBranchesService from "../src/services/branch/getBranchesService";
import createBranchService from "../src/services/branch/createBranchService";
import updateBranchService from "../src/services/branch/updateBranchService";
import { setBranches, setCurrentBranch } from "../src/context/slices/branches";
import changePhoneNumberService from "../src/services/business/changePhoneNumberService";
import resetPasswordRequestService from "../src/services/auth/resetPasswordRequestService";
import resetPasswordWithOldPasswordService from "../src/services/auth/resetPasswordWithOldPasswordService";
import BranchDTO, {
  Duration as BranchDuration,
  LocalTime,
} from "../src/objects/branch/BranchDTO";
import {
  GOOGLE_MAPS_API_KEY,
  MAIN_COLOR,
  SECONDARY_COLOR,
} from "../src/config";

export default function Profile({ header }: PageProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.auth);
  const business = useAppSelector((state) => state.business);
  const { data: session } = useSession();
  const branches = useAppSelector((state) => state.branches).branches;
  const branchIndex = useAppSelector((state) => state.branches).current;
  const branch = branches[branchIndex];

  // Business data
  const password = useInputForm("");
  const newPassword = useInputForm("");
  const [done, setDone] = useState(false);
  const email = useInputForm(auth.email!);
  const name = useInputForm(business.name!);
  const [emailSent, setEmailSent] = useState(false);
  const phoneNumber = useInputForm(business.phoneNumber!);

  // Current branch data
  const branchName = useInputForm(branch?.name!);
  const branchType = useInputForm(branch?.type!);
  const branchLocation = useInputForm(branch?.location!);
  const branchPhone = useInputForm(branch?.phoneNumber!);
  const branchDescription = useInputForm(branch?.overview!);
  const branchMapsLink = useInputForm(branch?.mapsLink!);
  const branchCapacity = useInputForm(`${branch?.capacity}`);
  const branchPrice = useInputForm(`${branch?.reservationPrice}`);

  const currenAverageReserveTime = moment.duration(branch?.averageReserveTime);
  const currentOpeningTime = moment(branch?.hourIn, "HH:mm:ss");
  const currentClosingTime = moment(branch?.hourOut, "HH:mm:ss");
  const currentOpeningHour = branch?.hourIn.split(":")[0];
  const currentClosingHour = branch?.hourOut.split(":")[0];

  const branchAverageReserveTimeHours = useInputForm(
    formatTime(currenAverageReserveTime.hours().toString())
  );
  const branchAverageReserveTimeMinutes = useInputForm(
    formatTime(currenAverageReserveTime.minutes().toString())
  );
  const branchOpeningTimeHour = useInputForm(currentOpeningHour);
  const branchOpeningTimeMinute = useInputForm(
    formatTime(currentOpeningTime.minutes().toString())
  );
  const branchClosingTimeHour = useInputForm(currentClosingHour);
  const branchClosingTimeMinute = useInputForm(
    formatTime(currentClosingTime.minutes().toString())
  );

  const getUpdatedBranch = (): BranchDTO => {
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
      location: branchLocation.value,
      mapsLink: branchMapsLink.value,
      name: branchName.value,
      overview: branchDescription.value,
      phoneNumber: branchPhone.value,
      type: branchType.value,
      score: branch.score,
      capacity: parseInt(branchCapacity.value),
      reservationPrice: parseFloat(branchPrice.value),
      reserveOff: branch.reserveOff,
      averageReserveTime: averageReserveTime as BranchDuration,
      visibility: branch.visibility,
      hourIn: hourIn as LocalTime,
      hourOut: hourOut as LocalTime,
    };
    return dto;
  };

  useEffect(() => {
    // If there is already a logged in user, it is redirected to profile
    if (!auth.logged) {
      router.push("/login");
    } else {
    }
  }, []);

  const saveName = async (newName: string) => {
    const response = await fetchAPI(
      auth.token!,
      auth.refresh!,
      (token: string) => dispatch(setToken(token)),
      (token: string) => changeNameService(auth.id!, newName, token)
    );

    if (response.isError) {
      name.setError(true);
      name.setErrorMessage("Error guardando el nombre.");
    } else {
      dispatch(setName(name.value));
    }
  };

  const savePhoneNumber = async (newPhoneNumber: string) => {
    const response = await fetchAPI(
      auth.token!,
      auth.refresh!,
      (token: string) => dispatch(setToken(token)),
      (token: string) =>
        changePhoneNumberService(auth.id!, newPhoneNumber, token)
    );

    if (response.isError) {
      phoneNumber.setError(true);
      phoneNumber.setErrorMessage("Error guardando el numero de telefono.");
    } else {
      dispatch(setPhoneNumber(phoneNumber.value));
    }
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
            newPassword.setErrorMessage(
              "La contraseña debe tener entre 8 y 64 caracteres."
            );
            newPassword.setError(true);
            break;
          case 9:
            password.setErrorMessage("Contraseña incorrecta");
            password.setError(true);
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

  const updateBranch = async () => {
    const response = await fetchAPI(
      auth.token!,
      auth.refresh!,
      (token: string) => dispatch(setToken(token)),
      (token: string) => updateBranchService(getUpdatedBranch(), token)
    );

    if (response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
    } else {
      dispatch(
        setBranches([
          ...branches.slice(0, branchIndex),
          response.data!,
          ...branches.slice(branchIndex + 1, branches.length),
        ])
      );
    }
  };

  const onForgotClick = async () => {
    const response = await resetPasswordRequestService(auth.email!);

    if (!!response.isError) {
      return;
    }

    setEmailSent(true);
  };

  // Create new branch
  const onCreateBranch = async () => {
    const response = await fetchAPI(
      auth.token!,
      auth.refresh!,
      (token: string) => dispatch(setToken(token)),
      (token: string) =>
        createBranchService(
          {
            id: 0,
            businessId: business.id!,
            location: "",
            mapsLink: "",
            name: "Nuevo local",
            overview: "",
            phoneNumber: "",
            type: "",
            score: 0,
            capacity: 1,
            reservationPrice: 0,
            reserveOff: false,
            averageReserveTime: "PT0H0M0S",
            visibility: true,
            hourIn: "00:00:00",
            hourOut: "23:59:59",
          },
          token
        )
    );

    if (response.isError) {
      if (!!response.exception) {
      }
    } else {
      // Get business branches
      const branchesResponse = await fetchAPI(
        auth.token!,
        auth.refresh!,
        (token: string) => dispatch(setToken(token)),
        (token: string) => getBranchesService(auth.id!, token)
      );

      if (
        !!branchesResponse.isError ||
        typeof branchesResponse.data === "string"
      ) {
        return;
      }

      dispatch(setBranches(branchesResponse.data!.branches));
      dispatch(setCurrentBranch(branchesResponse.data!.branches.length - 1));

      router.reload();
    }
  };

  return (
    !!auth.logged && (
      <BusinessProfile
        header={header}
        // [TODO] Fix main business image
        mainImage="https://i.pinimg.com/originals/55/00/d3/5500d308acf37ec5c31cc2e5c7785921.jpg"
        // [TODO] Fix business profile image
        profilePicture="https://wallpapers.com/images/featured/4co57dtwk64fb7lv.jpg"
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
        // [TODO] Options
        branchTypeOptions={cousines}
        branchLocationOptions={locations}
        mapsApiKey={GOOGLE_MAPS_API_KEY || ""}
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
        color={MAIN_COLOR}
        secondaryColor={SECONDARY_COLOR}
      />
    )
  );
}
