import { Dispatch } from "react";
import { AnyAction } from "redux";
import { NextRouter } from "next/router";
import fetchAPI from "../services/fetchAPI";
import ProductDTO from "../objects/product/ProductDTO";
import getProductsService from "../services/product/getProductsService";
import ProductSubCategoryDTO from "../objects/productSubCategory/ProductSubCategoryDTO";
import getProductSubCategoriesService from "../services/productSubCategory/getProductSubCategoriesService";
import {
  setProductSubCategories,
  setProducts,
} from "../context/slices/products";

export default async (
  branchId: number,
  token: string,
  refresh: string,
  router: NextRouter,
  dispatch: Dispatch<AnyAction>,
  setToken: (token: string) => void
) => {
  // Get product sub-categories
  const subCategoriesResponse = await fetchAPI(
    token,
    refresh,
    router,
    dispatch,
    setToken,
    (token: string) => getProductSubCategoriesService(branchId, token)
  );

  if (
    !!subCategoriesResponse.isError ||
    typeof subCategoriesResponse.data === "string"
  ) {
    return;
  }

  // Get products
  const productsResponse = await fetchAPI(
    token,
    refresh,
    router,
    dispatch,
    setToken,
    (token: string) => getProductsService(branchId, token)
  );

  if (!!productsResponse.isError || typeof productsResponse.data === "string") {
    return;
  }

  // Save all data
  dispatch(
    setProductSubCategories(
      subCategoriesResponse.data!.productSubCategories.reduce((acc, obj) => {
        acc[obj.id] = obj;
        return acc;
      }, {} as Record<number, ProductSubCategoryDTO>)
    )
  );

  dispatch(
    setProducts(
      productsResponse.data!.products.reduce((acc, obj) => {
        acc[obj.id] = obj;
        return acc;
      }, {} as Record<number, ProductDTO>)
    )
  );
};
