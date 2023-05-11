import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import credentials from "../credentials";
import { BusinessProfile } from "paca-ui";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../src/context/store";
import { logoutUser } from "../src/context/slices/auth";
import { MAIN_COLOR, SECONDARY_COLOR } from "../src/config";
import { logoutBusiness } from "../src/context/slices/business";
import useInputForm from "paca-ui/src/stories/hooks/useInputForm";
import logoutUserService from "../src/services/logoutUserService";

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const auth = useAppSelector((state) => state.auth);
  const business = useAppSelector((state) => state.business);
  const branches = useAppSelector((state) => state.branches).branches;
  const branch = branches[useAppSelector((state) => state.branches).current];

  // Business data
  const password = useInputForm("");
  const newPassword = useInputForm("");
  const email = useInputForm(auth.email!);
  const name = useInputForm(business.name!);
  const phoneNumber = useInputForm(business.phoneNumber!);

  // Current branch data
  const branchName = useInputForm(branch.name!);
  const branchType = useInputForm(branch.type!);
  const branchLocation = useInputForm(branch.address!);
  const branchPhone = useInputForm(branch.phoneNumber!);
  const branchDescription = useInputForm(branch.overview!);
  const branchMapsLink = useInputForm(branch.coordinates!);
  const branchCapacity = useInputForm(branch.capacity!.toString());
  const branchPrice = useInputForm(branch.reservationPrice!.toString());
  const branchAverageReserveTime = useInputForm(
    branch.averageReserveTime!.toString()
  );

  const logout = async () => {
    dispatch(logoutBusiness());
    dispatch(logoutUser());
    await logoutUserService(auth.token!, auth.refresh!);
    router.push("/login");
  };

  useEffect(() => {
    // If there is already a logged in user, it is redirected to profile
    if (!!auth.logged) {
      router.push("/profile");
    } else {
      setLoading(false);
    }
  }, [auth.logged]);

  return (
    <BusinessProfile
      header={{
        // [TODO] Fix header picture
        picture:
          "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?cs=srgb&dl=pexels-chan-walrus-941861.jpg&fm=jpg",
        name: business.name!,
        onLogout: logout,
        userRole: "business",
        logged: true,
        // [TODO] Fix onClicks
        onLeftSectionClick: () => {},
        onPacaClick: () => router.reload(),
        onRightSectionClick: () => router.reload(),
        onProfileClick: () => router.reload(),
      }}
      // [TODO] Fix main business image
      mainImage="https://i.pinimg.com/originals/55/00/d3/5500d308acf37ec5c31cc2e5c7785921.jpg"
      // [TODO] Fix business profile image
      profilePicture="https://wallpapers.com/images/featured/4co57dtwk64fb7lv.jpg"
      // Business data
      name={name}
      email={email}
      phoneNumber={phoneNumber}
      password={password}
      newPassword={newPassword}
      validateCurrentPassword={() => true}
      onChangePassword={() => {}}
      branchName={branchName}
      branchDescription={branchDescription}
      branchLocation={branchLocation}
      branchPhone={branchPhone}
      branchCapacity={branchCapacity}
      branchAverageReserveTime={branchAverageReserveTime}
      branchPrice={branchPrice}
      branchMapsLink={branchMapsLink}
      branchType={branchType}
      branchTypeOptions={[]}
      branchLocationOptions={[]}
      mapsApiKey={credentials.maps_key}
      onSaveName={() => {}}
      onSaveDescription={() => {}}
      onSaveLocation={() => {}}
      onSavePhone={() => {}}
      onSaveCapacity={() => {}}
      onSaveAverageReserveTime={() => {}}
      onSavePrice={() => {}}
      onSaveType={() => {}}
      onSaveMapsLink={() => {}}
      color={MAIN_COLOR}
      secondaryColor={SECONDARY_COLOR}
    />
  );
}
