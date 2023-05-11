import { API_ENDPOINT } from "../config";
import FetchResponse from "../objects/FetchResponse";
import { BranchProps } from "../context/slices/branches";
import ExceptionResponse from "../objects/ExceptionResponse";

type BranchesResponse = {
  branches: BranchProps[];
};

/**
 * @brief Get the branches of a business given its id
 *
 * @param id Business id
 * @param token Authorization token
 *
 * @returns API response when refresh
 */
export default async (
  id: number,
  token: string
): Promise<FetchResponse<BranchesResponse>> => {
  const uri = `${API_ENDPOINT}/business/${id}/branches`;

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data: BranchesResponse = await response.json();
      return { data, isError: false };
    } else {
      const exception: ExceptionResponse = await response.json();
      return { exception, isError: true };
    }
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};
