import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import logout from "../src/utils/logout";
import { BusinessProfile, IconType } from "paca-ui";
import { useDispatch } from "react-redux";
import fetchAPI from "../src/services/fetchAPI";
import {useSession, signOut} from "next-auth/react"
import { setToken } from "../src/context/slices/auth";
import { useAppSelector } from "../src/context/store";
import BranchDTO from "../src/objects/branch/BranchDTO";
import { setName } from "../src/context/slices/business";
import { MAIN_COLOR, SECONDARY_COLOR } from "../src/config";
import { setPhoneNumber } from "../src/context/slices/business";
import { setCurrentBranch } from "../src/context/slices/branches";
import useInputForm from "paca-ui/src/stories/hooks/useInputForm";
import changeNameService from "../src/services/business/changeNameService";
import updateBranchService from "../src/services/branch/updateBranchService";
import changePhoneNumberService from "../src/services/business/changePhoneNumberService";
import resetPasswordWithOldPasswordService from "../src/services/auth/resetPasswordWithOldPasswordService";

const amenities: { name: string; icon: IconType }[] = [
  { name: "Bar/Salón", icon: "wine" },
  { name: "Wifi libre", icon: "wifi" },
  { name: "Parking", icon: "parking" },
];

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.auth);
  const business = useAppSelector((state) => state.business);
  const { data: session } = useSession()
  const branches = useAppSelector((state) => state.branches).branches;
  const branch = branches[useAppSelector((state) => state.branches).current];

  // Business data
  const password = useInputForm("");
  const newPassword = useInputForm("");
  const [done, setDone] = useState(false);
  const email = useInputForm(auth.email!);
  const name = useInputForm(business.name!);
  const phoneNumber = useInputForm(business.phoneNumber!);

  // Current branch data
  const branchName = useInputForm(branch?.name!);
  const branchType = useInputForm(branch?.type!);
  const branchLocation = useInputForm(branch?.address!);
  const branchPhone = useInputForm(branch?.phoneNumber!);
  const branchDescription = useInputForm(branch?.overview!);
  const branchMapsLink = useInputForm(branch?.coordinates!);
  const branchCapacity = useInputForm(`${branch?.capacity}`);
  const branchPrice = useInputForm(`${branch?.reservationPrice}`);
  const branchAverageReserveTime = useInputForm(
    `${branch?.averageReserveTime}`
  );
  const getUpdatedBranch = (): BranchDTO => {
    return {
      id: branch.id,
      businessId: branch.businessId,
      address: branchLocation.value,
      coordinates: branchMapsLink.value,
      name: branchName.value,
      overview: branchDescription.value,
      phoneNumber: phoneNumber.value,
      type: branchType.value,
      score: branch.score,
      capacity: parseInt(branchCapacity.value),
      reservationPrice: parseFloat(branchPrice.value),
      reserveOff: branch.reserveOff,
      averageReserveTime: parseFloat(branchAverageReserveTime.value),
      visibility: branch.visibility,
    };
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
      logout(auth.token!, auth.refresh!, dispatch, router, "/reset-password", {
        completed: true,
      }, () => { if (session) signOut() });
    }
  };

  const updateBranch = async () => {
    const response = await fetchAPI(
      auth.token!,
      auth.refresh!,
      (token: string) => dispatch(setToken(token)),
      (token: string) => updateBranchService(getUpdatedBranch(), token)
    );
    console.log(response);

    if (response.isError) {
      if (!!response.exception) {
      }
    } else {
    }
  };

  return (
    !!auth.logged && (
      <BusinessProfile
        header={{
          // [TODO] Fix header picture
          picture:
            "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?cs=srgb&dl=pexels-chan-walrus-941861.jpg&fm=jpg",
          name: business.name!,
          onLogout: () => logout(auth.token!, auth.refresh!, dispatch, router),
          userRole: "business",
          logged: true,
          currentBranch: `${branch.name!} | ${branch.address}`,
          branchOptions: branches.map((branch, index) => {
            return {
              name: `${branch.name!} | ${branch.address}`,
              func: () => {
                dispatch(setCurrentBranch(index));
                router.reload();
              },
            };
          }),
          // [TODO] Fix onClicks
          onLeftSectionClick: () => {},
          onPacaClick: () => router.reload(),
          onRightSectionClick: () => router.reload(),
          onProfileClick: () => {},
        }}
        // [TODO] Fix main business image
        mainImage="https://i.pinimg.com/originals/55/00/d3/5500d308acf37ec5c31cc2e5c7785921.jpg"
        // [TODO] Fix business profile image
        profilePicture="https://wallpapers.com/images/featured/4co57dtwk64fb7lv.jpg"
        // [TODO]
        onCreateBranch={() => {}}
        // [TODO]
        onPictureClick={() => {}}
        // Business data
        name={name}
        email={email}
        phoneNumber={phoneNumber}
        password={password}
        newPassword={newPassword}
        done={done}
        onSaveName={saveName}
        onSavePhoneNumber={savePhoneNumber}
        onChangePassword={saveNewPassword}
        // [TODO]
        onForgotPassword={() => {}}
        haveBranch={branch !== undefined}
        branchName={branchName}
        branchDescription={branchDescription}
        branchLocation={branchLocation}
        branchPhone={branchPhone}
        branchCapacity={branchCapacity}
        branchAverageReserveTime={branchAverageReserveTime}
        branchPrice={branchPrice}
        branchMapsLink={branchMapsLink}
        branchType={branchType}
        // [TODO] Options
        branchTypeOptions={[]}
        branchLocationOptions={[]}
        mapsApiKey={process.env.GOOGLE_MAPS_API_KEY || ''}
        onSaveBranchName={() => updateBranch()}
        onSaveBranchDescription={() => updateBranch()}
        onSaveBranchLocation={() => updateBranch()}
        onSaveBranchPhone={() => updateBranch()}
        onSaveBranchCapacity={() => updateBranch()}
        onSaveBranchAverageReserveTime={() => updateBranch()}
        onSaveBranchPrice={() => updateBranch()}
        onSaveBranchType={() => updateBranch()}
        onSaveBranchMapsLink={() => updateBranch()}
        color={MAIN_COLOR}
        secondaryColor={SECONDARY_COLOR}
      />
    )
  );
}
