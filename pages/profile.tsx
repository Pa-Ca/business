import React from "react";
import { IconType } from "paca-ui";
import { BranchProfile } from "paca-ui";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { MAIN_COLOR } from "../src/config";
import refresh from "../src/services/refresh";
import { useAppSelector } from "../src/context/store";
import { setToken } from "../src/context/slices/auth";
import { logoutUser } from "../src/context/slices/auth";
import { logoutBusiness } from "../src/context/slices/business";
import logoutUserService from "../src/services/logoutUserService";
import {useSession, signOut} from "next-auth/react"

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

  const role: "business" = "business";

  const updateToken = async () => {
    const data = await refresh(auth.refresh!);
    if (data.isError) {
      console.log(data);
    } else {
      dispatch(setToken(data.data!));
    }
  };

  const getBusinessData = () => {
    if (auth.logged) {
      return {
        logged: true,
        role: role,
        business: {
          id: auth.id!,
          picture:
            "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?cs=srgb&dl=pexels-chan-walrus-941861.jpg&fm=jpg",
          name: business.name!,
          verified: business.verified!,
          tier: business.tier!,
        },
      };
    } else {
      return { logged: false };
    }
  };

  const logout = async () => {
    if (session) { signOut() }
    dispatch(logoutBusiness());
    dispatch(logoutUser());
    await logoutUserService(auth.token!, auth.refresh!);
    router.replace("/login");
  };

  return (
    <BranchProfile
      getUserData={getBusinessData}
      getBranchData={() => {
        return {
          businessId: 1,
          name: "Sempre Dritto Ristorant",
          score: 4.9,
          reviews: 142,
          category: "Italiana",
          pricePerson: 15.99,
          location: "Calle Escalona, Caracas 1083, Miranda",
          price: 10,
          promotions: [
            {
              promotion: 'Lomito "Sempre Dittro" -10%',
              date: new Date(2023, 2, 25),
              cost: 16,
              onClick: () => {},
              onSave: () => {},
            },
            {
              promotion: "Pasta al Salmón -20%",
              date: new Date(2023, 2, 23),
              cost: 12,
              onClick: () => {},
              onSave: () => {},
            },
          ],
          overview:
            "Sempre Dritto es un restaurante italiano ubicado en el pueblo de El Hatillo en Caracas, Venezuela. Este restaurante ofrece una amplia variedad de platos italianos y es conocido por su ambiente tipo italiano y su excelente atención al cliente. Los clientes han elogiado la calidad de la comida y la rapidez del servicio. Algunos de los platos recomendados por los clientes incluyen el Lomito Sempre Dritto, el Lomito al Pepe, la Pasta Alfredo con camarones y las Bruschettas Sempre Drito. Sempre Dritto es un lugar ideal para disfrutar de una deliciosa comida italiana en un ambiente acogedor y con una excelente atención al cliente.",
          images: [
            "https://i.postimg.cc/C55r4Bmr/326630296-854605892289447-3989098525441837248-n.jpg",
            "https://i.postimg.cc/02Jc2q3S/162902730-753319225576640-6128780695292754726-n.jpg",
            "https://i.postimg.cc/yWqhSk5Z/172584327-151671503537464-2923172395679395882-n.jpg",
            "https://i.postimg.cc/FFkB1ck1/176024050-465621354748769-1062778171927072924-n.jpg",
            "https://i.postimg.cc/NM9p9qMZ/262660555-1041028993346947-9119096342076209547-n.jpg",
          ],
          mainImage: "https://i.postimg.cc/90mcpp7P/image-4-1.png",
          menu: [
            {
              price: 15.85,
              title: "Milanesa alla Parmigiana",
              description:
                "Milanesa de pollo gratinado en salsa de hongos, acompañado de pasta, papas con ramero o ensalada César.",
              image:
                "https://i.postimg.cc/nzGM1MCm/332115610-166847765752970-1308567063811972403-n.jpg",
              onClick: () => {},
            },
            {
              price: 12.54,
              title: "Filetto con Burrata",
              description:
                "Filete de ternera a la plancha acompañado de una capa externa de mozzarella y un interior cremoso de nata y hilos de queso.",
              image:
                "https://i.postimg.cc/hPfPX2bT/325616755-509442167924097-2026171515615347969-n.jpg",
              onClick: () => {},
            },
            {
              price: 18.16,
              title: 'Lomito "Sempre Dritto"',
              description:
                "Medallones de lomito en reducción de aceto balsámico con ramero y acompañado de fettuccine Alfredo.",
              image:
                "https://i.postimg.cc/XNDn6wSJ/317666234-446290911042006-7601213385201360753-n.jpg",
              onClick: () => {},
            },
            {
              price: 14.8,
              title: "Pasta Prosciutto ai Funghi",
              description:
                "Pasta larga cocida al dente y salteada con una salsa de prosciutto cotto, champiñones, cebolla, vino blanco y nata1.",
              image:
                "https://i.postimg.cc/wvnyvnyf/338169136-930830101592012-4466338585597331424-n.jpg",
              onClick: () => {},
            },
            {
              price: 14.8,
              title: "Pasta Toscana",
              description:
                "Tomates confitados y champiñones salteados en aceite de oliva.",
              image:
                "https://i.postimg.cc/xTDnd98D/291942876-436571181673365-7689448139439390105-n.jpg",
              onClick: () => {},
            },
            {
              price: 14.8,
              title: "Gnocchi ai Funghi",
              description:
                "Descripción de una pizza ¿Que más necesitas? Pan, salsa de tomate, queso y cualquier ingrediente que quieras colocarle encima.",
              image:
                "https://i.postimg.cc/6q4gX4n2/280670000-737034117321433-420421889354096911-n.jpg",
              onClick: () => {},
            },
          ],
          amenities,
          reviewsData: [
            {
              score: 5,
              author: "German Toro",
              review:
                "Outstanding Italian dining experience! Cute place, awesome food with very competent staff. What else do you need for an extraordinary dinner? All pastas are great, as well as the apple crumble cheesecake and the Pavlova pie. Asdrubal, is a reference of professional service taking to the highest level. Don't miss this place",
              image:
                "https://lh3.googleusercontent.com/a-/ACB-R5TOuHuckiZnFZIh3hVSfiQgRaw4pEJjqn3mwiapvlg=w60-h60-p-rp-mo-ba4-br100",
            },
            {
              score: 5,
              author: "Marvin Schultz",
              review:
                "Absolutely incredible Italian food. Every single dish we ordered was a unique experience. Flavors I had never tried before in any restaurant. This place has something very special. The service was superb and the prices were excellent.",
              image:
                "https://lh3.googleusercontent.com/a-/ACB-R5T3P5JhwsK6uiD0kmIN7nX6-Q9IEkuDlWpK6oo5uQ=w60-h60-p-rp-mo-br100",
            },
            {
              score: 5,
              author: "Geraldine G",
              review:
                "Delicious food and atmosphere. Very classical Italian in the beautiful El Hatillo town. Service is also very nice. You can’t pay with card.",
              image:
                "https://lh3.googleusercontent.com/a-/ACB-R5QWBpYtDoWtapuK95TeSUuYffyJlXY5JHwgRL1gWw=w60-h60-p-rp-mo-ba3-br100",
            },
            {
              score: 5,
              author: "Carolina Hernandez",
              review: "Excellent food Great price and gluten free options",
              image:
                "https://lh3.googleusercontent.com/a-/ACB-R5SO5ph1Y-YoMqsfspO_ag8JEYBtF9vi-rari2VBUj4=w60-h60-p-rp-mo-ba5-br100",
            },
            {
              score: 5,
              author: "Jose Antonio Barreto",
              review:
                "Excelent service and great food. Very popular. Reservation is recommended.",
              image:
                "https://lh3.googleusercontent.com/a-/ACB-R5Q0YqF9dcFNQ2Xs4fXXvMqB7MOCVXqDrk7YYLusZw=w60-h60-p-rp-mo-ba6-br100",
            },
            {
              score: 5,
              author: "Mario Velásquez (Maboy)",
              review:
                "Excellent service! Magnificent Italian cuisine! Remember to make reservations, it's not necessarily a place to just walk in and find a table, but maybe you can get lucky.",
              image:
                "https://lh3.googleusercontent.com/a-/ACB-R5RaEEC5tO4jf3Yd3sRXMCjYNDHViN-j0H8bx1npQQ=w60-h60-p-rp-mo-ba3-br100",
            },
            {
              score: 5,
              author: "Lorena Sánchez Senior",
              review:
                "Super nice Italian food, good portions, reasonable prices, nice options...",
              image:
                "https://lh3.googleusercontent.com/a-/ACB-R5Ro_CAAwdVXCJkEXrxKEo9FT0ShRJqdAL7DUCNUsuc=w60-h60-p-rp-mo-ba5-br100",
            },
            {
              score: 5,
              author: "julia baena",
              review:
                "The food is amazing. I had a Lomito Dritto with risotto and was one of the best by far. Service nice and prices very affordable.",
              image:
                "https://lh3.googleusercontent.com/a/AGNmyxb3g449HzmfkX7_uifYO8KfVA52C35rSW_uYfE2=w60-h60-p-rp-mo-ba4-br100",
            },
            {
              score: 5,
              author: "Luis Hurtado",
              review: "Most delicious bruschetta with prosciutto.",
              image:
                "https://lh3.googleusercontent.com/a/AGNmyxYBrHgFxnI3PuVcWkAjYP08O7z6Paf9G23QjxCW=w60-h60-p-rp-mo-ba4-br100",
            },
            {
              score: 5,
              author: "Cesar Alvarez Hermoso",
              review:
                "The food is delicious, the service is very nice, prices are average. Just check the prices in us dollars against bolivars when you order the bill.",
              image:
                "https://lh3.googleusercontent.com/a-/ACB-R5T4BM4fodNrf-kB8msEpGaLX7w9NIk-hdzyELe2Ug=w60-h60-p-rp-mo-ba6-br100",
            },
          ].concat(
            new Array(879).fill({
              score: 4.7,
              author: "Giovanni Giorgio",
              review:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              image:
                "https://wallpapers.com/images/featured/4co57dtwk64fb7lv.jpg",
            })
          ),
          thumbnail:
            "https://i.postimg.cc/C55r4Bmr/326630296-854605892289447-3989098525441837248-n.jpg",
        };
      }}
      path={[
        {
          name: "Home",
          onClick: () => {},
        },
        {
          name: auth.token!,
          onClick: () => {},
        },
      ]}
      onPacaClick={updateToken}
      locationImage="https://i.postimg.cc/bvdRWcQd/Screenshot-2023-03-31-192810.png"
      color={MAIN_COLOR}
      onProfileClick={logout}
    />
  );
}
