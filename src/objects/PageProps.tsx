import { HeaderProps } from "paca-ui";
import FetchResponse from "./FetchResponse";

interface PageProps {
  /**
   * Header
   */
  header: HeaderProps;
  /**
   * Fetch API function
   */
  fetchAPI: <T>(
    service: (token: string) => Promise<FetchResponse<T>>
  ) => Promise<FetchResponse<T | string>>;
}

export default PageProps;
