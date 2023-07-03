import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse, ProductCategoryDTO } from "objects";

type CategoriesResponse = {
  productCategories: ProductCategoryDTO[];
};

/**
 * @brief Get all product categories
 *
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  token: string
): Promise<FetchResponse<CategoriesResponse>> => {
  const uri = `${API_ENDPOINT}/product-sub-category/categories`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: CategoriesResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
