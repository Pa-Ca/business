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

// Client
import ClientDTO from "./client/ClientDTO";

// Product
import ProductDTO from "./product/ProductDTO";

// Product subcategory
import ProductCategoryDTO from "./productSubCategory/ProductCategoryDTO";
import ProductSubCategoryDTO from "./productSubCategory/ProductSubCategoryDTO";

// Reservation
import GuestDTO from "./reservation/GuestDTO";
import InvoiceDTO from "./reservation/InvoiceDTO";
import GuestInfoDTO from "./reservation/GuestInfoDTO";
import ReservationDTO from "./reservation/ReservationDTO";
import ReservationInfoDTO, {
  toReservationProps,
} from "./reservation/ReservationInfoDTO";

// Sale
import SaleInfoDTO from "./sale/SaleInfoDTO";
import TaxDTO, { TaxType } from "./sale/TaxDTO";
import SaleProductDTO from "./sale/SaleProductDTO";
import BranchInfoDTO from "./branch/BranchInfoDTO";
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
  type Duration,
  type LocalTime,
  type BranchDTO,
  type BranchInfoDTO,
  type DefaultTaxDTO,
  // Business
  type BusinessDTO,
  // Client
  type ClientDTO,
  // Product
  type ProductDTO,
  // Product subcategory
  type ProductCategoryDTO,
  type ProductSubCategoryDTO,
  // Reservation
  type GuestDTO,
  type InvoiceDTO,
  type GuestInfoDTO,
  type ReservationDTO,
  type ReservationInfoDTO,
  toReservationProps,
  // Sale
  TaxType,
  SaleStatus,
  type TaxDTO,
  type SaleDTO,
  type SaleInfoDTO,
  type SaleProductDTO,
};
