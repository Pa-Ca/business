import React, { useEffect, useMemo, useState } from "react";
import { PageProps } from "objects";
import { useAppSelector } from "context";
import {
    ProductCategoryObject,
    ProductSubCategoryObject,
    BranchCoupons,
    ProductObject,
} from "paca-ui";
import { useRouter } from "next/router";
import { CouponProductCardProps } from "paca-ui/src/stories/molecules/productCard/ProductCard";

const STATIC_COUPONS = [
    {
        name: "Pizza grande margarita",
        cost: 13,
        category: "Comida",
        subCategory: "Pizza",
        discountCost: 10.5,
        available: true,
        productImage: "http://astrolabio.com.mx/wp-content/uploads/2015/11/Pizza-Margherita.jpg",
    },
    {
        name: "Mojito ",
        discountCost: 10,
        category: "Bebida",
        subCategory: "Coctele",
        cost: 10.5,
        available: true,
        productImage:
            "https://www.drinkdirect.ch/media/image/6f/93/22/2f64d264bae354a925079bbe9599ab0d242cfe74_Basil_Mojito.png",
    },
    {
        name: "Aperol ",
        discountCost: 10,
        category: "Bebida",
        subCategory: "Coctele",
        cost: 10.5,
        available: true,
        productImage:
            "https://hips.hearstapps.com/hmg-prod/images/aperol-spritz-index-64873f08af990.jpg?crop=0.8891360084020634xw:1xh;center,top&resize=1200:*",
    },
    {
        name: "Pasta Carbonara ",
        discountCost: 10,
        category: "Comida",
        subCategory: "Pasta",
        cost: 20,
        available: true,
        productImage: "https://i.blogs.es/8819e1/carbonara-rec/1366_2000.jpg",
    },
    {
        name: "Pasticho ",
        discountCost: 10,
        category: "Comida",
        subCategory: "Pasta",
        cost: 20,
        available: true,
        productImage: "https://www.comedera.com/wp-content/uploads/2022/04/pasticho-venezolano.jpg",
    },
    {
        name: "Pasta Puttanesca ",
        discountCost: 13,
        category: "Comida",
        subCategory: "Pasta",
        cost: 25,
        available: true,
        productImage:
            "https://thecozyapron.com/wp-content/uploads/2021/05/pasta-puttanesca_thecozyapron_1.jpg",
    },
    {
        name: "Red Velvet ",
        discountCost: 8,
        category: "Postre",
        subCategory: "Torta",
        cost: 12,
        available: true,
        productImage:
            "https://www.recipetineats.com/wp-content/uploads/2016/06/Red-Velvet-Layer-Cake_4.jpg?resize=900,1347",
    },
    {
        name: "Torta de Zanahoria ",
        discountCost: 8,
        category: "Postre",
        subCategory: "Torta",
        cost: 12,
        available: true,
        productImage:
            "https://i0.wp.com/osojimix.com/wp-content/uploads/2023/02/Torta-de-zanahoria.jpeg.jpg?resize=768%2C512&ssl=1",
    },
];

export default function Coupons({ header }: PageProps) {
    const router = useRouter();
    const branches = useAppSelector((state) => state.branches).branches;
    const products_ = useAppSelector((state) => state.products.products);
    const branchInfo = branches[useAppSelector((state) => state.branches).current];
    const productCategories_ = useAppSelector((state) => state.products.categories);
    const [coupons, setCoupons] = useState<CouponProductCardProps[]>([]);
    const productSubCategories_ = useAppSelector((state) => state.products.subCategories);

    // Format all categories
    const productCategories = useMemo(() => {
        let productCategories: Record<number, ProductCategoryObject> = {};

        for (let key of Object.keys(productCategories_)) {
            const category = productCategories_[Number(key)];
            if (!category) continue;

            productCategories[category.id] = {
                id: category.id,
                name: category.name,
            };
        }

        return productCategories;
    }, [productCategories_]);

    // Format all sub-categories
    const productSubCategories = useMemo(() => {
        let productSubCategories: Record<number, ProductSubCategoryObject> = {};

        for (let key of Object.keys(productSubCategories_)) {
            const subCategory = productSubCategories_[Number(key)];
            if (!subCategory) continue;

            productSubCategories[subCategory.id] = {
                id: subCategory.id,
                name: subCategory.name,
                categoryId: subCategory.categoryId,
            };
        }

        return productSubCategories;
    }, [productSubCategories_]);

    // Format all products
    const products = useMemo(() => {
        let products: Record<number, ProductObject> = {};

        for (let key of Object.keys(products_)) {
            const product = products_[Number(key)];

            // Product properties
            const subCategory = {
                label: productSubCategories_[product.subCategoryId].name,
                value: {
                    id: product.subCategoryId,
                    name: productSubCategories_[product.subCategoryId].name,
                    categoryId: productSubCategories_[product.subCategoryId].categoryId,
                },
            };
            const category = {
                label: productCategories_[productSubCategories_[product.subCategoryId].categoryId]
                    .name,
                value: {
                    id: productSubCategories_[product.subCategoryId].categoryId,
                    name: productCategories_[
                        productSubCategories_[product.subCategoryId].categoryId
                    ].name,
                },
            };

            products[product.id] = {
                id: product.id,
                name: product.name,
                subCategoryId: product.subCategoryId,
                price: product.price,
                disabled: product.disabled,
                description: product.description,
            };
        }

        return products;
    }, [products_]);

    useEffect(() => {
        setCoupons(
            STATIC_COUPONS.map((coupon, index) => {
                return {
                    ...coupon,
                    onEdit: () => {},
                    onDelete: () => {},
                    onActiveClick: () => {
                        setCoupons((coupons) => {
                            const newCoupons = [...coupons];
                            newCoupons[index].available = !newCoupons[index].available;
                            return newCoupons;
                        });
                    },
                };
            })
        );
    }, [STATIC_COUPONS]);

    return (
        <BranchCoupons
            header={header}
            haveBranch={!!branchInfo}
            products={coupons}
            allProducts={products}
            categories={productCategories}
            subCategories={productSubCategories}
            onCreateCoupon={() => {}}
            onBack={() => router.back()}
        />
    );
}
