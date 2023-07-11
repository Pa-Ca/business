export * from "./alertService";

import fetchAPI from "./fetchAPI";

// Auth
import refreshService from "./auth/refreshService";
import loginUserService from "./auth/loginUserService";
import logoutUserService from "./auth/logoutUserService";
import signUpUserService from "./auth/signUpUserService";
import loginBusinessService from "./auth/loginBusinessService";
import signUpBusinessService from "./auth/signUpBusinessService";
import resetPasswordRequestService from "./auth/resetPasswordRequestService";
import resetPasswordWithTokenService from "./auth/resetPasswordWithTokenService";
import resetPasswordWithOldPasswordService from "./auth/resetPasswordWithOldPasswordService";

// Google Auth
import googleLoginUserService from "./googleAuth/googleLoginUserService";
import googleSignUpUserService from "./googleAuth/googleSignUpUserService";
import googleSignUpBusinessService from "./googleAuth/googleSignUpBusinessService";

// Branch
import getTablesService from "./branch/getTablesService";
import getBranchesService from "./branch/getBranchesService";
import createTableService from "./branch/createTableService";
import deleteTableService from "./branch/deleteTableService";
import updateTableService from "./branch/updateTableService";
import createBranchService from "./branch/createBranchService";
import updateBranchService from "./branch/updateBranchService";

// Business
import updateBusinessService from "./business/updateBusinessService";

// Product
import getProductsService from "./product/getProductsService";
import createProductService from "./product/createProductService";
import deleteProductService from "./product/deleteProductService";
import updateProductService from "./product/updateProductService";

// Product subcategory
import getProductCategoriesService from "./productSubCategory/getProductCategoriesService";
import getProductSubCategoriesService from "./productSubCategory/getProductSubCategoriesService";
import createProductSubCategoryService from "./productSubCategory/createProductSubCategoryService";
import deleteProductSubCategoryService from "./productSubCategory/deleteProductSubCategoryService";
import updateProductSubCategoryService from "./productSubCategory/updateProductSubCategoryService";

// Reservation
import getReservationService from "./reservation/getReservationService";
import postReservationService from "./reservation/postReservationService";
import getReservationsService from "./reservation/getReservationsService";
import closeReservationService from "./reservation/closeReservationService";
import startReservationService from "./reservation/startReservationService";
import acceptReservationService from "./reservation/acceptReservationService";
import cancelReservationService from "./reservation/cancelReservationService";
import rejectReservationService from "./reservation/rejectReservationService";
import retireReservationService from "./reservation/retireReservationService";

// Guest
import getGuestService from "./reservation/getGuestService";

// S3
import S3ClientService from "./s3/S3ClientService";
import S3UploadService from "./s3/S3UploadService";
import S3DownloadService from "./s3/S3DownloadService";

// Sale
import getSalesService from "./sale/getSalesService";
import clearSaleService from "./sale/clearSaleService";
import createTaxService from "./sale/createTaxService";
import deleteTaxService from "./sale/deleteTaxService";
import updateTaxService from "./sale/updateTaxService";
import createSaleService from "./sale/createSaleService";
import updateSaleService from "./sale/updateSaleService";
import deleteSaleService from "./sale/deleteSaleService";
import createSaleProductService from "./sale/createSaleProductService";
import updateSaleProductService from "./sale/updateSaleProductService";
import deleteSaleProductService from "./sale/deleteSaleProductService";

export {
  fetchAPI,
  // Auth
  refreshService,
  loginUserService,
  logoutUserService,
  signUpUserService,
  loginBusinessService,
  signUpBusinessService,
  resetPasswordRequestService,
  resetPasswordWithTokenService,
  resetPasswordWithOldPasswordService,
  // Google Auth
  googleLoginUserService,
  googleSignUpUserService,
  googleSignUpBusinessService,
  // Branch
  getTablesService,
  getBranchesService,
  createTableService,
  deleteTableService,
  updateTableService,
  createBranchService,
  updateBranchService,
  // Business
  updateBusinessService,
  // Product
  getProductsService,
  createProductService,
  deleteProductService,
  updateProductService,
  // Product subcategory
  getProductCategoriesService,
  getProductSubCategoriesService,
  createProductSubCategoryService,
  deleteProductSubCategoryService,
  updateProductSubCategoryService,
  // Reservation
  getReservationService,
  postReservationService,
  getReservationsService,
  closeReservationService,
  startReservationService,
  acceptReservationService,
  cancelReservationService,
  rejectReservationService,
  retireReservationService,
  // Guest
  getGuestService,
  // S3
  S3ClientService,
  S3UploadService,
  S3DownloadService,
  // Sale
  getSalesService,
  clearSaleService,
  createTaxService,
  deleteTaxService,
  updateTaxService,
  createSaleService,
  updateSaleService,
  deleteSaleService,
  createSaleProductService,
  updateSaleProductService,
  deleteSaleProductService,
};
