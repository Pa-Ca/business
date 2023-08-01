import PageProps from "./PageProps";
import FetchResponse from "./FetchResponse";
import ExceptionResponse from "./ExceptionResponse";

// Auth
import LoginResponseDTO from "./auth/LoginResponseDTO";
import ResetPasswordDTO from "./auth/ResetPasswordDTO";

// Branch
import TableDTO from "./branch/TableDTO";
import DefaultTaxDTO from "./branch/DefaultTaxDTO";
import BranchDTO, { Duration, LocalTime } from "./branch/BranchDTO";

// Business
import BusinessDTO from "./business/BusinessDTO";

// Product
import ProductDTO from "./product/ProductDTO";

// Product subcategory
import ProductCategoryDTO from "./productSubCategory/ProductCategoryDTO";
import ProductSubCategoryDTO from "./productSubCategory/ProductSubCategoryDTO";

// Reservation
import ReservationDTO, {
  toReservationProps,
} from "./reservation/ReservationDTO";

// Sale
import SaleInfoDTO from "./sale/SaleInfoDTO";
import TaxDTO, { TaxType } from "./sale/TaxDTO";
import SaleProductDTO from "./sale/SaleProductDTO";
import SaleDTO, { SaleStatus } from "./sale/SaleDTO";

export {
  type PageProps,
  type FetchResponse,
  type ExceptionResponse,
  // Auth
  type LoginResponseDTO,
  type ResetPasswordDTO,
  // Branch
  type TableDTO,
  type BranchReservationsInfoDTO,
  type Duration,
  type LocalTime,
  type BranchDTO,
  type DefaultTaxDTO,
  // Business
  type BusinessDTO,
  // Product
  type ProductDTO,
  // Product subcategory
  type ProductCategoryDTO,
  type ProductSubCategoryDTO,
  // Reservation
  type ReservationDTO,
  toReservationProps,
  // Sale
  TaxType,
  SaleStatus,
  type TaxDTO,
  type SaleDTO,
  type SaleInfoDTO,
  type SaleProductDTO,
};
