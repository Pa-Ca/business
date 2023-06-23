import { API_ENDPOINT } from "../../config";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";
import SubCategoryDTO from "../../objects/productSubCategory/ProductSubCategoryDTO";

/**
 * @brief Change the data of a product sub-category. Undefined variables will 
 * be ignored
 *
 * @param dto Product sub-category data
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: SubCategoryDTO,
  token: string
): Promise<FetchResponse<SubCategoryDTO>> => {
  const uri = `${API_ENDPOINT}/product-sub-category/${dto.id}`;

  try {
    const response = await fetch(uri, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (response.status === 200) {
      const data: SubCategoryDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
