import { API_ENDPOINT } from "../../config";
import { FetchResponse, ExceptionResponse, ProductDTO } from "objects";

/**
 * @brief Create a new product
 *
 * @param dto Product data
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: ProductDTO,
  token: string
): Promise<FetchResponse<ProductDTO>> => {
  const uri = `${API_ENDPOINT}/product`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (response.status === 200) {
      const data: ProductDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
