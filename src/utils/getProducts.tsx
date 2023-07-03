import { Dispatch } from "react";
import { AnyAction } from "redux";
import { NextRouter } from "next/router";
import { ProductDTO, ProductSubCategoryDTO } from "objects";
import { setProductSubCategories, setProducts } from "context";
import {
  fetchAPI,
  getProductsService,
  getProductSubCategoriesService,
} from "services";

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
