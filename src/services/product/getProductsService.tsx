import { API_ENDPOINT } from "../../config";
import FetchResponse from "../../objects/FetchResponse";
import ProductDTO from "../../objects/product/ProductDTO";
import ExceptionResponse from "../../objects/ExceptionResponse";

type ProductResponse = {
    products: ProductDTO[];
};

/**
 * @brief Get the products of a branch given its id
 *
 * @param id Branch id
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  id: number,
  token: string
): Promise<FetchResponse<ProductResponse>> => {
  const uri = `${API_ENDPOINT}/branch/${id}/product`;

  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: ProductResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
