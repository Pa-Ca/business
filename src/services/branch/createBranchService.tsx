import { API_ENDPOINT } from "../../config";
import BranchDTO from "../../objects/branch/BranchDTO";
import FetchResponse from "../../objects/FetchResponse";
import ExceptionResponse from "../../objects/ExceptionResponse";

/**
 * @brief Create a new branch
 *
 * @param dto Branch data
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  dto: BranchDTO,
  token: string
): Promise<FetchResponse<BranchDTO>> => {
  const uri = `${API_ENDPOINT}/branch`;

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
      const data: BranchDTO = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
