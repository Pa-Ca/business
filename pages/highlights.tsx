import React, { useMemo } from "react";
import { PageProps } from "objects";
import { useDispatch } from "react-redux";
import { useAppSelector } from "context";
import { ProductCategoryObject, ProductSubCategoryObject, BranchHighlightProducts } from "paca-ui";
import { useRouter } from "next/router";

export default function HighlightProducts({ header, fetchAPI }: PageProps) {
    const router = useRouter();
    const dispatch = useDispatch();
    const branches = useAppSelector((state) => state.branches).branches;
    const products_ = useAppSelector((state) => state.products.products);
    const branchInfo = branches[useAppSelector((state) => state.branches).current];
    const productCategories_ = useAppSelector((state) => state.products.categories);
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

    const highlight = useMemo(() => {
        return Object.values(products_).map((product, index) => {
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

            return {
                name: product.name,
                cost: product.price,
                category: category.value.name,
                subCategory: subCategory.value.name,
                available: index < 4,
                disabled: product.disabled,
                onAvailabilityClick: () => {},
                productImage: product.image,
            };
        });
    }, [products_]);
    return (
        <BranchHighlightProducts
            header={header}
            haveBranch={!!branchInfo}
            products={highlight}
            categories={productCategories}
            subCategories={productSubCategories}
            onBack={() => router.back()}
        />
    );
}
