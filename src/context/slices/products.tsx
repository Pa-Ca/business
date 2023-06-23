import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ProductDTO from "../../objects/product/ProductDTO";
import ProductCategoryDTO from "../../objects/productSubCategory/ProductCategoryDTO";
import ProductSubCategoryDTO from "../../objects/productSubCategory/ProductSubCategoryDTO";

interface ProductsProps {
  /**
   * Product list
   */
  products: Record<number, ProductDTO>;
  /**
   * Product categories
   */
  categories: Record<number, ProductCategoryDTO>;
  /**
   * Product sub-categories
   */
  subCategories: Record<number, ProductSubCategoryDTO>;
}

const initialState: ProductsProps = {
  products: {},
  categories: {},
  subCategories: {},
};

const products = createSlice({
  name: "products",
  initialState,
  reducers: {
    unsetProducts: (state: ProductsProps) => {
      state.products = {};
      state.categories = {};
      state.subCategories = {};
    },
    setProducts: (
      state: ProductsProps,
      action: PayloadAction<Record<number, ProductDTO>>
    ) => {
      state.products = action.payload;
    },
    setProductCategories: (
      state: ProductsProps,
      action: PayloadAction<Record<number, ProductCategoryDTO>>
    ) => {
      state.categories = action.payload;
    },
    setProductSubCategories: (
      state: ProductsProps,
      action: PayloadAction<Record<number, ProductSubCategoryDTO>>
    ) => {
      state.subCategories = action.payload;
    },
  },
});

export const {
  unsetProducts,
  setProducts,
  setProductCategories,
  setProductSubCategories,
} = products.actions;
export default products.reducer;
