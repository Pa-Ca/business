import React, { useMemo } from "react";
import { PageProps } from "objects";
import { useDispatch } from "react-redux";
import { setProductSubCategories, setProducts, useAppSelector } from "context";
import {
    InputFormHook,
    BranchProducts,
    ProductCategoryObject,
    ProductSubCategoryObject,
} from "paca-ui";
import {
    alertService,
    createProductService,
    deleteProductService,
    createProductSubCategoryService,
    updateProductSubCategoryService,
    deleteProductSubCategoryService,
} from "services";
import { ExtendedProductCardProps } from "paca-ui/src/stories/molecules/productCard/ProductCard";
import { useRouter } from "next/router";

export default function Product({ header, fetchAPI }: PageProps) {
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

    // Format all products
    const products = useMemo(() => {
        let products: Record<number, ExtendedProductCardProps> = {};

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

            // Product methods
            const onDelete = async (id: number) => {
                const response = await fetchAPI((token: string) => deleteProductService(id, token));

                if (response.isError || typeof response.data === "string") {
                    const message = !!response.exception
                        ? response.exception.message
                        : response.error?.message;
                    alertService.error(`Error eliminando el producto: ${message}`);
                } else {
                    const products = { ...products_ };
                    delete products[id];
                    dispatch(setProducts(products));
                }
            };

            products[product.id] = {
                name: product.name,
                cost: product.price,
                category: category.value.name,
                subCategory: subCategory.value.name,
                available: !product.disabled,
                availableMobile: !product.disabledMobile,

                onEdit: () => {},
                onCategoryClick: () => {},
                onSubCategoryClick: () => {},
                onAvailabilityClick: () => {},
                onMobileAvailabilityClick: () => {},
                onDelete: () => onDelete(product.id),

                productImage: product.image,
            };
        }

        return products;
    }, [products_]);

    const onCreateProduct = async (
        name: InputFormHook<string>,
        price: InputFormHook<string>,
        categoryId: number,
        subCategoryId: number,
        description: string,
        image: string,
        active: boolean,
        mobile: boolean
    ) => {
        const response = await fetchAPI((token: string) =>
            createProductService(
                {
                    id: 0,
                    subCategoryId,
                    disabled: !active,
                    disabledMobile: !mobile,
                    name: name.value!,
                    price: Number(price.value!),
                    description,
                    image,
                },
                token
            )
        );

        if (response.isError || typeof response.data === "string") {
            if (!!response.exception && response.exception.code === 57) {
                name.setCode(4);
                name.setMessage("Ya existe un producto con ese nombre");
            } else {
                const message = !!response.exception
                    ? response.exception.message
                    : response.error?.message;
                alertService.error(`Error creando el producto: ${message}`);
            }

            return false;
        } else {
            dispatch(
                setProducts({
                    ...products_,
                    [response.data!.id]: response.data!,
                })
            );

            return true;
        }
    };

    const onCreateSubCategory = async (categoryId: number, subCategory: InputFormHook<string>) => {
        if (!branchInfo) return { id: -1, name: "", categoryId: -1 };
        const branch = branchInfo.branch;

        const response = await fetchAPI((token: string) =>
            createProductSubCategoryService(
                { id: 0, branchId: branch.id, categoryId, name: subCategory.value! },
                token
            )
        );

        if (response.isError || typeof response.data === "string") {
            if (!!response.exception) {
                subCategory.setCode(4);
                subCategory.setMessage(response.exception!.message);
            }

            const message = !!response.exception
                ? response.exception.message
                : response.error?.message;
            alertService.error(`Error creando la subcategoría: ${message}`);

            return { id: -1, name: "", categoryId: -1 };
        } else {
            dispatch(
                setProductSubCategories({
                    ...productSubCategories_,
                    [response.data!.id]: response.data!,
                })
            );

            return {
                id: response.data!.id,
                name: response.data!.name,
                categoryId: response.data!.categoryId,
            };
        }
    };

    const onEditSubCategory = async (
        id: number,
        subCategory: InputFormHook<string>,
        categoryId: number
    ) => {
        if (!branchInfo) return false;
        const branch = branchInfo.branch;

        const response = await fetchAPI((token: string) =>
            updateProductSubCategoryService(
                { id, branchId: branch.id, categoryId, name: subCategory.value! },
                token
            )
        );

        if (response.isError || typeof response.data === "string") {
            if (!!response.exception) {
                subCategory.setCode(4);
                subCategory.setMessage(response.exception!.message);
            }

            const message = !!response.exception
                ? response.exception.message
                : response.error?.message;
            alertService.error(`Error modificando la subcategoría: ${message}`);

            return false;
        } else {
            dispatch(
                setProductSubCategories({
                    ...productSubCategories_,
                    [response.data!.id]: response.data!,
                })
            );

            return true;
        }
    };

    const onDeleteSubCategory = async (id: number) => {
        const response = await fetchAPI((token: string) =>
            deleteProductSubCategoryService(id, token)
        );

        if (response.isError || typeof response.data === "string") {
            const message = !!response.exception
                ? response.exception.message
                : response.error?.message;
            alertService.error(`Error eliminando la subcategoría: ${message}`);
        } else {
            const subCategories = { ...productSubCategories_ };
            delete subCategories[id];

            dispatch(setProductSubCategories(subCategories));
        }
    };

    return (
        <BranchProducts
            header={header}
            haveBranch={!!branchInfo}
            products={products}
            categories={productCategories}
            subCategories={productSubCategories}
            onCreateProduct={onCreateProduct}
            onCreateSubCategory={onCreateSubCategory}
            onBack={() => router.back()}
        />
    );
}
