import { API_ENDPOINT } from "../../config";
import {
  FetchResponse,
  ExceptionResponse,
  ProductSubCategoryDTO,
} from "objects";

type SubCategoriesResponse = {
  productSubCategories: ProductSubCategoryDTO[];
};

/**
 * @brief Get the product sub categories of a branch given its id
 *
 * @param id Branch id
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  id: number,
  token: string
): Promise<FetchResponse<SubCategoriesResponse>> => {
  const uri = `${API_ENDPOINT}/branch/${id}/product-sub-category`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: SubCategoriesResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
