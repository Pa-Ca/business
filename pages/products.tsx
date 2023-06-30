import React, { useMemo } from "react";
import { PageProps } from "objects";
import { useDispatch } from "react-redux";
import { setProductSubCategories, setProducts, useAppSelector } from "context";
import {
  ProductProps,
  InputFormHook,
  BranchProducts,
  ProductCategoryObject,
  ProductSubCategoryObject,
  OptionObject,
} from "paca-ui";
import {
  alertService,
  updateProductService,
  createProductService,
  deleteProductService,
  createProductSubCategoryService,
  updateProductSubCategoryService,
  deleteProductSubCategoryService,
} from "services";

export default function Product({ header, fetchAPI }: PageProps) {
  const dispatch = useDispatch();
  const branches = useAppSelector((state) => state.branches).branches;
  const products_ = useAppSelector((state) => state.products.products);
  const branch = branches[useAppSelector((state) => state.branches).current];
  const productCategories_ = useAppSelector(
    (state) => state.products.categories
  );
  const productSubCategories_ = useAppSelector(
    (state) => state.products.subCategories
  );

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
    let products: Record<number, ProductProps> = {};

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
        label:
          productCategories_[
            productSubCategories_[product.subCategoryId].categoryId
          ].name,
        value: {
          id: productSubCategories_[product.subCategoryId].categoryId,
          name: productCategories_[
            productSubCategories_[product.subCategoryId].categoryId
          ].name,
        },
      };

      // Product methods
      const onSaveName = async (id: number, name: InputFormHook<string>) => {
        const response = await fetchAPI((token: string) =>
          updateProductService({ ...product, id, name: name.value }, token)
        );

        if (response.isError || typeof response.data === "string") {
          if (!!response.exception) {
            name.setError(1);
            name.setErrorMessage(response.exception!.message);
          }

          const message = !!response.exception
            ? response.exception.message
            : response.error?.message;
          alertService.error(`Error modificando el nombre: ${message}`);
        } else {
          dispatch(
            setProducts({
              ...products_,
              [product.id]: response.data!,
            })
          );
        }
      };

      const onSaveSubCategory = async (
        id: number,
        subCategory: InputFormHook<
          OptionObject<ProductSubCategoryObject | null>
        >
      ) => {
        const response = await fetchAPI((token: string) =>
          updateProductService(
            { ...product, id, subCategoryId: subCategory.value!.value?.id! },
            token
          )
        );

        if (response.isError || typeof response.data === "string") {
          if (!!response.exception) {
            subCategory.setError(1);
            subCategory.setErrorMessage(response.exception!.message);
          }

          const message = !!response.exception
            ? response.exception.message
            : response.error?.message;
          alertService.error(`Error modificando la sub-categoría: ${message}`);
        } else {
          dispatch(
            setProducts({
              ...products_,
              [product.id]: response.data!,
            })
          );
        }
      };

      const onSaveDescription = async (
        id: number,
        description: InputFormHook<string>
      ) => {
        const response = await fetchAPI((token: string) =>
          updateProductService(
            { ...product, id, description: description.value },
            token
          )
        );

        if (response.isError || typeof response.data === "string") {
          if (!!response.exception) {
            description.setError(1);
            description.setErrorMessage(response.exception!.message);
          }

          const message = !!response.exception
            ? response.exception.message
            : response.error?.message;
          alertService.error(`Error modificando la descripción: ${message}`);
        } else {
          dispatch(
            setProducts({
              ...products_,
              [product.id]: response.data!,
            })
          );
        }
      };

      const onSavePrice = async (id: number, price: InputFormHook<string>) => {
        const response = await fetchAPI((token: string) =>
          updateProductService(
            { ...product, id, price: Number(price.value) },
            token
          )
        );

        if (response.isError || typeof response.data === "string") {
          if (!!response.exception) {
            price.setError(1);
            price.setErrorMessage(response.exception!.message);
          }

          const message = !!response.exception
            ? response.exception.message
            : response.error?.message;
          alertService.error(`Error modificando el precio: ${message}`);
        } else {
          dispatch(
            setProducts({
              ...products_,
              [product.id]: response.data!,
            })
          );
        }
      };

      const onSaveDisabled = async (id: number, disabled: boolean) => {
        const response = await fetchAPI((token: string) =>
          updateProductService({ ...product, id, disabled }, token)
        );

        if (response.isError || typeof response.data === "string") {
          const message = !!response.exception
            ? response.exception.message
            : response.error?.message;
          alertService.error(`Error modificando la disponibilidad: ${message}`);
        } else {
          dispatch(
            setProducts({
              ...products_,
              [product.id]: response.data!,
            })
          );
        }
      };

      const onDelete = async (id: number) => {
        const response = await fetchAPI((token: string) =>
          deleteProductService(id, token)
        );

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
        id: product.id,
        name: product.name,
        description: product.description,
        price: `${product.price}`,
        disabled: product.disabled,
        categories: productCategories,
        subCategories: productSubCategories,
        category,
        subCategory,

        onSaveName,
        onSaveSubCategory,
        onSaveDescription,
        onSavePrice,
        onSaveDisabled,
        onDelete,
      };
    }

    return products;
  }, [products_]);

  const onCreateProduct = async (
    name: InputFormHook<string>,
    price: InputFormHook<string>,
    categoryId: number,
    subCategoryId: number
  ) => {
    const response = await fetchAPI((token: string) =>
      createProductService(
        {
          id: 0,
          subCategoryId,
          disabled: false,
          name: name.value!,
          price: Number(price.value!),
          description: "",
        },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
      if (!!response.exception) {
        name.setError(1);
        name.setErrorMessage(response.exception!.message);
      }

      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error creando el producto: ${message}`);

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

  const onCreateSubCategory = async (
    categoryId: number,
    subCategory: InputFormHook<string>
  ) => {
    const response = await fetchAPI((token: string) =>
      createProductSubCategoryService(
        { id: 0, branchId: branch.id, categoryId, name: subCategory.value! },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
      if (!!response.exception) {
        subCategory.setError(1);
        subCategory.setErrorMessage(response.exception!.message);
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
    const response = await fetchAPI((token: string) =>
      updateProductSubCategoryService(
        { id, branchId: branch.id, categoryId, name: subCategory.value! },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
      if (!!response.exception) {
        subCategory.setError(1);
        subCategory.setErrorMessage(response.exception!.message);
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
      products={products}
      categories={productCategories}
      subCategories={productSubCategories}
      onCreateProduct={onCreateProduct}
      onCreateSubCategory={onCreateSubCategory}
      onEditSubCategory={onEditSubCategory}
      onDeleteSubCategory={onDeleteSubCategory}
    />
  );
}
