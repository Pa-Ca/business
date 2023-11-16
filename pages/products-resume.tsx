import React, { useMemo } from "react";
import { PageProps } from "objects";
import { useAppSelector } from "context";
import { useRouter } from "next/router";
import { BranchProductsResume } from "paca-ui/src/stories/template/branchProductsResume/BranchProductsResume";

export default function Product({ header, fetchAPI }: PageProps) {
    const router = useRouter();
    const products_ = useAppSelector((state) => state.products.products);
    const productSubCategories_ = useAppSelector((state) => state.products.subCategories);

    const highlight = useMemo(() => {
        return Object.values(products_)
            .slice(0, 4)
            .map((product) => {
                return {
                    name: product.name,
                    cost: product.price,
                    productImage: product.image,
                    onDelete: () => {},
                };
            });
    }, [products_]);

    return (
        <BranchProductsResume
            header={header}
            productsCount={Object.keys(products_).length}
            categoriesCount={Object.keys(productSubCategories_).length}
            productsAvailableOnlineCount={
                Object.values(products_).filter((p) => !p.disabled).length
            }
            highlightProducts={highlight}
            cupons={[
                {
                    name: "Pizza grande margarita",
                    cost: 10.5,
                    productImage:
                        "http://astrolabio.com.mx/wp-content/uploads/2015/11/Pizza-Margherita.jpg",
                    onDelete: () => {},
                },
                {
                    name: "Mojito ",
                    cost: 10,
                    productImage:
                        "https://www.drinkdirect.ch/media/image/6f/93/22/2f64d264bae354a925079bbe9599ab0d242cfe74_Basil_Mojito.png",
                    onDelete: () => {},
                },
                {
                    name: "Aperol ",
                    cost: 10,
                    productImage:
                        "https://hips.hearstapps.com/hmg-prod/images/aperol-spritz-index-64873f08af990.jpg?crop=0.8891360084020634xw:1xh;center,top&resize=1200:*",
                    onDelete: () => {},
                },
                {
                    name: "Pasta Carbonara ",
                    cost: 10,
                    productImage: "https://i.blogs.es/8819e1/carbonara-rec/1366_2000.jpg",
                    onDelete: () => {},
                },
            ]}
            onViewMoreProductsClick={() => router.push("/products")}
            onViewMoreCuponsClick={() => router.push("/coupons")}
            onViewMoreHighlightsClick={() => router.push("/highlights")}
        />
    );
}
