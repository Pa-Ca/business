import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Box, LoginComponent } from "paca-ui";
import { useAppSelector } from "../src/context/store";
import { loginBusiness } from "../src/context/slices/business";
import { MAIN_COLOR, SECONDARY_COLOR, GREEN } from "../src/config";
import loginBusinessService from "../src/services/loginBusinessService";
import { loginUser } from "../src/context/slices/auth";

const images = [
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fd36tnp772eyphs.cloudfront.net%2Fblogs%2F1%2F2018%2F10%2FTerrasse-Suite-Carre-dOr-Hotel-Metropole-balcony-view.jpeg&f=1&nofb=1&ipt=9736c4b3ccbe4f89b8bfc453ff92138e9e1d5e527324123d5ff783268be37bdc&ipo=images",
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.squarespace-cdn.com%2Fcontent%2Fv1%2F52da9677e4b03d314575985a%2F1576342982271-R07XT8R39LD93NT1XOZ1%2Fke17ZwdGBToddI8pDm48kJK4Mm1kch8SFO9ZNkN1NT97gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmFk_H6M1tkD9NpL7mXac0oVSXdFfjxR5AjcLwGSebOiGBsFzzcw3xKxvyC_6CFFG_%2F%2540dulce_at_hilton%2B-%2BConrad%2BAlgarve.jpg&f=1&nofb=1&ipt=2100054268d5c351126e8ffc690b40f9f3ec13426903564f4d9a8f0f53995947&ipo=images",
  "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ftravel.home.sndimg.com%2Fcontent%2Fdam%2Fimages%2Ftravel%2Ffullset%2F2013%2F03%2F28%2F2d%2Fbest-hotel-views_ss_002.rend.hgtvcom.966.725.suffix%2F1491592688614.jpeg&f=1&nofb=1&ipt=2671a97930ff670904bb2fa1656a38e1d47df42213bb1cfdda4cfe320f4d4b97&ipo=images",
  "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fstunningplaces.net%2Fwp-content%2Fuploads%2F2014%2F07%2FKatikies-Hotels-01.jpg&f=1&nofb=1&ipt=9570d35132416bf109084e37afe4f8ae960f0654b7b603e0f9f93ef22e1d64d1&ipo=images",
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thecoolector.com%2Fwp-content%2Fuploads%2F2018%2F04%2Fshagri-la-london.jpg&f=1&nofb=1&ipt=9827fe4148a7e3496d918d2e3300cb17b052923e2e19b1d36acd5a445f3e3584&ipo=images",
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thestar.com%2Fcontent%2Fdam%2Fthestar%2Flife%2Ftravel%2F2012%2F03%2F16%2Fbest_hotel_views_a_look_at_our_favourite_rooms_with_a_view_around_the_globe%2Fmarriott_fallsviewniagara.jpeg&f=1&nofb=1&ipt=aaf5e9af11832f67d8af152f1cf5702570a79d358ab2b564789d67d5a28f25a3&ipo=images",
];

export default function Signup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If there is already a logged in user, it is redirected to profile
    if (!!auth.logged) {
      router.push("/profile");
    } else {
      setLoading(false);
    }
  }, [auth.logged]);

  const login = async (email: string, password: string) => {
    setError(false);

    const response = await loginBusinessService(email, password);

    if (!!response.isError) {
      setError(true);
      return;
    }

    dispatch(
      loginUser({
        logged: true,
        userId: response.data!.userId,
        id: response.data!.id,
        email: response.data!.email,
        token: response.data!.token,
        refresh: response.data!.refresh,
      })
    );

    dispatch(
      loginBusiness({
        name: response.data!.name,
        verified: false,
        tier: "basic",
      })
    );

    router.push("/profile");
  };

  return (
    <Box
      style={{
        paddingLeft: "105px",
        paddingRight: "105px",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Box style={{ width: "100%" }}>
        {!loading && (
          <LoginComponent
            error={error}
            images={images}
            color={MAIN_COLOR}
            onLogin={login}
            onForgotClick={() => router.push("/recover-password")}
            onGoogleSignUp={() => {}}
            onSignUp={() => router.push("/signup")}
            secondaryColor={SECONDARY_COLOR}
            otherLoginsColor={GREEN}
          />
        )}
      </Box>
    </Box>
  );
}