import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useAppSelector } from "context";
import {
  formatTime,
  validateName,
  validateEmail,
  validatePhone,
  generateValidHours,
  validateIdentityDocument,
} from "utils";
import {
  TaxDTO,
  TaxType,
  GuestDTO,
  PageProps,
  SaleStatus,
  SaleInfoDTO,
  SaleProductDTO,
  toReservationProps,
  ReservationInfoDTO,
} from "objects";
import {
  TaxObject,
  SaleObject,
  BranchSales,
  TableObject,
  OptionObject,
  useInputForm,
  InputFormHook,
  ProductObject,
  PastSaleProps,
  SaleProductProps,
  ReservationProps,
  ProductCategoryObject,
  ProductSubCategoryObject,
} from "paca-ui";
import {
  alertService,
  getSalesService,
  getGuestService,
  deleteTaxService,
  updateTaxService,
  getTablesService,
  clearSaleService,
  createSaleService,
  updateSaleService,
  deleteSaleService,
  createGuestService,
  createSaleTaxService,
  getBranchReservations,
  startReservationService,
  createSaleProductService,
  updateSaleProductService,
  deleteSaleProductService,
  rejectReservationService,
  acceptReservationService,
  retireReservationService,
  postReservationService,
} from "services";

export default function Sales({ header, fetchAPI }: PageProps) {
  const branches = useAppSelector((state) => state.branches).branches;
  const products_ = useAppSelector((state) => state.products.products);
  const branchIndex = useAppSelector((state) => state.branches).current;
  const branchInfo = branches[branchIndex];
  const nullObject = { label: "", value: null };

  // Sales data
  const [sales, setSales] = useState<SaleObject[]>([]);
  const [tables, setTables] = useState<TableObject[]>([]);
  const saleSelected = useInputForm<SaleObject | null>(null);
  const tableSelected = useInputForm<TableObject | null>(null);
  const [clientGuestId, setClientGuestId] = useState<number | null>(null);
  const categories_ = useAppSelector((state) => state.products.categories);
  const [identityDocumentChecked, setIdentityDocumentChecked] = useState("");
  const subCategories_ = useAppSelector((state) => state.products.subCategories);

  // Reservations data
  const [pendingReservations, setPendingReservations] = useState<ReservationProps[]>([]);
  const [acceptedReservations, setAcceptedReservations] = useState<ReservationProps[]>([]);

  // Guest data
  const guestEmail = useInputForm("");
  const guestPhone = useInputForm("");
  const guestLastName = useInputForm("");
  const guestFirstName = useInputForm("");

  // New reservation data
  const newReservationPersons = useInputForm("");

  // Filters
  const [saleFilter, setSaleFilter] = useState(true);
  const [reservationFilter, setReservationFilter] = useState(true);
  const filterFullName = useInputForm("");
  const filterIdentityDocument = useInputForm("");
  const filterEndDate = useInputForm<Date | null>(null);
  const filterStartDate = useInputForm<Date | null>(null);
  const filterStatus = useInputForm<OptionObject<string | null>>(nullObject);
  const filterIdentityDocumentType = useInputForm<OptionObject<string | null>>(nullObject);

  // Historic sales
  const [salePage, setSalePage] = useState(1);
  const [saleTotalPages, setSaleTotalPages] = useState(1);
  const [pastSalesNumber, setPastSalesNumber] = useState(15);
  const [historicSales, setHistoricSales] = useState<PastSaleProps[]>([]);

  // Historic reservations
  const [reservationPage, setReservationPage] = useState(1);
  const [reservationTotalPages, setReservationTotalPages] = useState(1);
  const [pastReservationsNumber, setPastReservationsNumber] = useState(10);
  const [pastReservations, setPastReservations] = useState<ReservationProps[]>([]);

  // Validations
  const validateGuestData = (
    email: InputFormHook<string>,
    phone: InputFormHook<string>,
    firstName: InputFormHook<string>,
    lastName: InputFormHook<string>,
    identityDocumentType: InputFormHook<OptionObject<string | null>>,
    identityDocument: InputFormHook<string>
  ) => {
    let valid = true;

    email.setCode(0);
    phone.setCode(0);
    firstName.setCode(0);
    lastName.setCode(0);
    identityDocument.setCode(0);

    // identityDocument validation
    if (!identityDocumentType.value.value || identityDocumentType.value.value === "") {
      valid = false;
      identityDocument.setCode(4);
      identityDocument.setMessage("Introduzca un tipo de documento de identidad");
    } else {
      const realIdentityDocument =
        identityDocumentType.value.value! + identityDocument.value.trim();
      const identityDocumentValidation = validateIdentityDocument(
        identityDocumentType.value.value!,
        identityDocument.value.trim()
      );
      if (realIdentityDocument !== identityDocumentChecked) {
        valid = false;
        identityDocument.setCode(4);
        identityDocument.setMessage("Haga click en Obtener Usuario");
      }

      if (identityDocumentValidation.code !== 0) {
        valid = false;
        identityDocument.setCode(4);
        switch (identityDocumentValidation.code) {
          case 1:
            identityDocument.setMessage("Introduzca un número de documento de identidad");
            break;
          case 2:
            identityDocument.setMessage("Introduzca un documento de identidad con solo números");
            break;
          default:
            identityDocument.setMessage("Documento inválido.");
        }
      }
    }

    // firstName validations
    const firstNameValidation = validateName(firstName.value);
    if (firstNameValidation.code !== 0) {
      valid = false;
      firstName.setCode(4);
      switch (firstNameValidation.code) {
        case 1:
          firstName.setMessage("Debe tener al menos 2 caracteres.");
          break;
        default:
          firstName.setMessage("Nombre inválido.");
      }
    }

    // lastName validations
    const lastNameValidation = validateName(lastName.value);
    if (lastNameValidation.code !== 0) {
      valid = false;
      lastName.setCode(4);
      switch (lastNameValidation.code) {
        case 1:
          lastName.setMessage("Debe tener al menos 2 caracteres.");
          break;
        default:
          lastName.setMessage("Apellido inválido.");
      }
    }

    // Email validation
    const emailValidation = validateEmail(email.value);
    if (emailValidation.code !== 0) {
      valid = false;
      email.setCode(4);
      switch (emailValidation.code) {
        case 1:
          email.setMessage("Formato de correo inválido.");
          break;
        default:
          email.setMessage("Correo inválido.");
      }
    }

    // Phone validation
    const phoneValidation = validatePhone(phone.value);
    if (phoneValidation.code !== 0) {
      valid = false;
      phone.setCode(4);
      switch (phoneValidation.code) {
        case 1:
          phone.setMessage("Formato de teléfono inválido.");
          break;
        default:
          phone.setMessage("Teléfono inválido.");
      }
    }

    return valid;
  };

  const validateSaleData = (
    clientQuantity: InputFormHook<string>,
    tables: InputFormHook<TableObject[]>
  ) => {
    let valid = true;

    clientQuantity.setCode(0);
    tables.setCode(0);

    // Persons validation
    if (!clientQuantity.value || clientQuantity.value === "") {
      valid = false;
      clientQuantity.setCode(4);
      clientQuantity.setMessage("Indique el número de personas");
    } else {
      try {
        parseInt(clientQuantity.value);
      } catch (error) {
        valid = false;
        clientQuantity.setCode(4);
        clientQuantity.setMessage("Indique un número postivo");
      }
      if (parseInt(clientQuantity.value) < 1) {
        valid = false;
        clientQuantity.setCode(4);
        clientQuantity.setMessage("Indique al menos una persona");
      }
    }

    // Table validation
    if (!tables.value || tables.value.length === 0) {
      valid = false;
      tables.setCode(4);
      tables.setMessage("Debe seleccionar al menos una mesa");
    }

    return valid;
  };

  const validateReservationData = (
    date: InputFormHook<Date | null>,
    tables: InputFormHook<string>,
    persons: InputFormHook<string>,
    hourIn: InputFormHook<OptionObject<string | null>>,
    hourOut: InputFormHook<OptionObject<string | null>>
  ) => {
    let valid = true;

    date.setCode(0);
    tables.setCode(0);
    persons.setCode(0);
    hourIn.setCode(0);

    // Date validation
    if (!date.value) {
      valid = false;
      date.setCode(4);
      date.setMessage("Indique la fecha de la reserva");
    }

    // Persons validation
    if (!persons.value || persons.value === "") {
      valid = false;
      persons.setCode(4);
      persons.setMessage("Indique el número de personas");
    } else {
      try {
        parseInt(persons.value);
      } catch (error) {
        valid = false;
        persons.setCode(4);
        persons.setMessage("Indique un número postivo");
      }
      if (parseInt(persons.value) < 1) {
        valid = false;
        persons.setCode(4);
        persons.setMessage("Indique al menos una persona");
      }
    }

    // Table validation
    if (!tables.value || tables.value === "") {
      valid = false;
      tables.setCode(4);
      tables.setMessage("Indique el número de mesas");
    } else {
      try {
        parseInt(tables.value);
      } catch (error) {
        valid = false;
        tables.setCode(4);
        tables.setMessage("Indique un número postivo");
      }
      if (parseInt(tables.value) < 1) {
        valid = false;
        tables.setCode(4);
        tables.setMessage("Indique al menos una mesa");
      }
    }

    // Hour In validation
    if (!hourIn.value.value) {
      valid = false;
      hourIn.setCode(4);
      hourIn.setMessage("Indique la hora de llegada");
    }

    // Check that hourIn is less than hourOut
    if (!!hourOut.value.value) {
      const [hourInHours, hourInMinutes] = hourIn.value.value!.split(":").map(Number);
      const [hourOutHours, hourOutMinutes] = hourOut.value.value!.split(":").map(Number);
      if (hourInHours === hourOutHours && hourInMinutes === hourOutMinutes) {
        valid = false;
        hourIn.setCode(4);
        hourIn.setMessage("La llegada no puede ser igual a la salida");
      }
    }

    return valid;
  };

  // Branch data
  const categories = useMemo(() => {
    let categories: Record<number, ProductCategoryObject> = {};

    for (let key of Object.keys(categories_)) {
      const category = categories_[Number(key)];
      if (!category) continue;

      categories[category.id] = {
        id: category.id,
        name: category.name,
      };
    }

    return categories;
  }, [categories_]);

  const subCategories = useMemo(() => {
    let subCategories: Record<number, ProductSubCategoryObject> = {};

    for (let key of Object.keys(subCategories_)) {
      const subCategory = subCategories_[Number(key)];
      if (!subCategory) continue;

      subCategories[subCategory.id] = {
        id: subCategory.id,
        name: subCategory.name,
        categoryId: subCategory.categoryId,
      };
    }

    return subCategories;
  }, [subCategories_]);

  const products = useMemo(() => {
    let products: Record<number, ProductObject> = {};

    for (let key of Object.keys(products_)) {
      const product = products_[Number(key)];
      if (!product || product.disabled) continue;

      products[product.id] = { ...product };
    }

    return products;
  }, [products_]);

  const averageReserveTime = useMemo(() => {
    if (!branchInfo) {
      return {
        hours: 0,
        minutes: 0,
      };
    }

    const branch = branchInfo.branch;
    const currenAverageReserveTime = moment.duration(branch.averageReserveTime);
    return {
      hours: parseInt(formatTime(currenAverageReserveTime.hours().toString())),
      minutes: parseInt(formatTime(currenAverageReserveTime.minutes().toString())),
    };
  }, [branchInfo]);

  const validHours = useMemo(() => {
    if (!branchInfo) {
      return {
        in: [],
        out: [],
      };
    }

    const branch = branchInfo.branch;
    const validHoursIn_ = generateValidHours(branch.hourIn, branch.hourOut).map((x) => {
      return { value: x, label: x };
    });
    const validHoursOut_ = [validHoursIn_[1], ...validHoursIn_.slice(2)];
    validHoursIn_.pop();

    return {
      in: validHoursIn_,
      out: validHoursOut_,
    };
  }, [branchInfo]);

  // Sale tax functions
  const taxDTO2Object = (tax: TaxDTO, saleId: number): TaxObject => {
    return {
      id: tax.id,
      name: tax.name,
      type: tax.type,
      value: tax.value,
      saveValueFunction: async (
        name: InputFormHook<string>,
        value: InputFormHook<string>,
        type: InputFormHook<string>
      ) => {
        await onUpdateTax(tax.id, saleId, name, value, type);
      },
      deleteValueFunction: async () => {
        await onDeleteTax(tax.id, saleId);
      },
    };
  };

  const onAddTax = async () => {
    const sale = saleSelected.value;
    if (!sale) return;

    const response = await fetchAPI((token: string) =>
      createSaleTaxService(
        {
          saleId: sale.id,
          tax: {
            name: `Tarifa ${sale.taxes.length + 1}`,
            type: TaxType["%"],
            value: 0,
          },
        },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al crear el impuesto: ${message}`);
    } else {
      // Update sale taxes
      const newTaxes = [...sale.taxes];
      newTaxes.push(taxDTO2Object(response.data!, sale.id));

      // Update sale
      setSales((oldSales) => {
        const newSales = [...oldSales];
        const saleIndex = newSales.findIndex((s) => s.id === sale.id);
        newSales[saleIndex].taxes = newTaxes;
        return newSales;
      });
    }
  };

  const onUpdateTax = async (
    id: number,
    saleId: number,
    name: InputFormHook<string>,
    value: InputFormHook<string>,
    type: InputFormHook<string>
  ) => {
    const dto = {
      id,
      name: name.value,
      type: TaxType[type.value as keyof typeof TaxType],
      value: Number(value.value),
    };
    const response = await fetchAPI((token: string) => updateTaxService(dto, token));
    const data = response.data;

    if (response.isError || typeof data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al actualizar el impuesto: ${message}`);
    } else {
      // Update sale
      setSales((oldSales) => {
        const sale = oldSales.find((sale) => sale.id === sale.id)!;
        const taxIndex = sale.taxes.findIndex((tax) => tax.id === id);
        sale.taxes[taxIndex] = taxDTO2Object(data!, sale.id);
        sale.taxes = sale.taxes;

        return oldSales;
      });
    }
  };

  const onDeleteTax = async (id: number, saleId: number) => {
    const response = await fetchAPI((token: string) => deleteTaxService(id, token));

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al eliminar el impuesto: ${message}`);
    } else {
      // Update sale
      setSales((oldSales) => {
        const newSales = [...oldSales];
        const sale = newSales.find((sale) => sale.id === sale.id)!;
        sale.taxes = sale.taxes.filter((tax) => tax.id !== id);

        return newSales;
      });
    }
  };

  // Sale product functions
  const productDTOtoObject = (product: SaleProductDTO, saleId: number): SaleProductProps => {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      amount: product.amount,
      onChangeAmount: async (value: string) => {
        await onUpdateProduct(product.id, saleId, value);
      },
      onDelete: async () => {
        await onDeleteProduct(product.id, saleId);
      },
    };
  };

  const onAddProduct = async (productId: number, amount: number) => {
    const sale = saleSelected.value;
    if (!sale) return false;

    const dto = {
      productId,
      saleId: sale.id,
      amount: amount,
    };
    const response = await fetchAPI((token: string) => createSaleProductService(dto, token));

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al agregar el producto: ${message}`);
      return false;
    } else {
      // Update products
      const newProducts = [...sale.products!];
      newProducts.push(productDTOtoObject(response.data!, sale.id));

      // Update sale
      setSales((oldSales) => {
        const newSales = [...oldSales];
        const saleIndex = newSales.findIndex((s) => s.id === sale.id);
        newSales[saleIndex].products = newProducts;
        return newSales;
      });

      return true;
    }
  };

  const onUpdateProduct = async (id: number, saleId: number, amount: string) => {
    const dto = {
      id,
      amount: Number(amount),
    };
    const response = await fetchAPI((token: string) => updateSaleProductService(dto, token));
    const data = response.data;

    if (response.isError || typeof data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al actualizar el producto: ${message}`);
    } else {
      // Update products
      const sale = sales.find((sale) => sale.id === saleId)!;
      const newProducts = [...sale.products!];
      const productIndex = newProducts.findIndex((p) => p.id === id);
      newProducts[productIndex] = productDTOtoObject(data!, sale.id);
      sale.products = newProducts;

      // Update sale
      setSales((oldSales) => {
        const newSales = [...oldSales];
        const saleIndex = newSales.findIndex((sale) => sale.id === sale.id);
        newSales[saleIndex].products = newProducts;
        return newSales;
      });
    }
  };

  const onDeleteProduct = async (id: number, saleId: number) => {
    const response = await fetchAPI((token: string) => deleteSaleProductService(id, token));

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al eliminar el producto: ${message}`);
    } else {
      // Delete sale product
      const sale = sales.find((sale) => sale.id === saleId)!;
      sale.products = sale.products.filter((product) => product.id !== id);

      // Update sale
      setSales((oldSales) => {
        const newSales = [...oldSales];
        const saleIndex = newSales.findIndex((sale) => sale.id === sale.id);
        newSales[saleIndex].products = sale.products;
        return newSales;
      });
    }
  };

  // Guest functions
  const onGetGuest = async (
    identityDocumentType: InputFormHook<OptionObject<string | null>>,
    identityDocument: InputFormHook<string>
  ) => {
    const fullDocument = identityDocumentType.value.value! + identityDocument.value.trim();
    const response = await fetchAPI((token: string) => getGuestService(fullDocument, token));

    setIdentityDocumentChecked(fullDocument);

    if (!!response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
      setClientGuestId(-1);
      identityDocument.setCode(3);
      identityDocument.setMessage("Usuario no encontrado en la base de datos, complete los datos");
    } else {
      const guestInfo = response.data!;

      setClientGuestId(guestInfo.clientGuestId);
      guestEmail.setValue(guestInfo.guest.email);
      guestFirstName.setValue(guestInfo.guest.name);
      guestLastName.setValue(guestInfo.guest.surname);
      guestPhone.setValue(guestInfo.guest.phoneNumber);

      identityDocument.setCode(1);
      identityDocument.setMessage("Usuario obtenido exitosamente");
    }
  };

  const onCreateGuest = async (
    identityDocumentType: InputFormHook<OptionObject<string | null>>,
    identityDocument: InputFormHook<string>
  ) => {
    const dto: GuestDTO = {
      id: -1,
      name: guestFirstName.value,
      surname: guestLastName.value,
      email: guestEmail.value,
      phoneNumber: guestPhone.value,
      identityDocument: identityDocumentType.value.value! + identityDocument.value.trim(),
    };

    const response = await fetchAPI((token: string) => createGuestService(dto, token));

    if (!!response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
      return null;
    } else {
      const guestInfo = response.data!;

      setClientGuestId(guestInfo.clientGuestId);
      guestEmail.setValue(guestInfo.guest.email);
      guestFirstName.setValue(guestInfo.guest.name);
      guestLastName.setValue(guestInfo.guest.surname);
      guestPhone.setValue(guestInfo.guest.phoneNumber);

      return guestInfo.clientGuestId;
    }
  };

  // Sale functions
  const saleInfoToObject = (saleInfo: SaleInfoDTO): SaleObject => {
    let ownerName = "",
      ownerPhone = "",
      ownerEmail = "";
    if (!!saleInfo.guest) {
      ownerEmail = saleInfo.guest.email;
      ownerPhone = saleInfo.guest.phoneNumber;
      ownerName = `${saleInfo.guest.name} ${saleInfo.guest.surname}`;
    } else if (!!saleInfo.client) {
      ownerEmail = saleInfo.client.email;
      ownerPhone = saleInfo.client.phoneNumber;
      ownerName = `${saleInfo.client.name} ${saleInfo.client.surname}`;
    }
    const sale: SaleObject = {
      id: saleInfo.sale.id,
      ownerName,
      ownerPhone,
      ownerEmail,
      startTime: new Date(saleInfo.sale.startTime),
      clientQuantity: saleInfo.sale.clientQuantity,
      note: saleInfo.sale.note,
      taxes: saleInfo.taxes.map((tax) => taxDTO2Object(tax, saleInfo.sale.id)),
      tables: saleInfo.tables,
      products: saleInfo.products.map((product) => productDTOtoObject(product, saleInfo.sale.id)),
      hasReservation: !!saleInfo.reservationId && saleInfo.reservationId > 0,
    };

    return sale;
  };

  const onCreateSale = async (
    identityDocumentType: InputFormHook<OptionObject<string | null>>,
    identityDocument: InputFormHook<string>,
    clientQuantity: InputFormHook<string>,
    tables: InputFormHook<TableObject[]>
  ) => {
    if (!branchInfo) return false;

    const validGuestData = validateGuestData(
      guestEmail,
      guestPhone,
      guestFirstName,
      guestLastName,
      identityDocumentType,
      identityDocument
    );
    const validSaleData = validateSaleData(clientQuantity, tables);
    if (!validGuestData || !validSaleData) return false;

    let guestId;
    if (!clientGuestId || clientGuestId === -1) {
      const response = await onCreateGuest(identityDocumentType, identityDocument);
      if (!response) {
        return false;
      }
      guestId = response;
    } else {
      guestId = clientGuestId;
    }

    const dto: SaleInfoDTO = {
      sale: {
        id: -1,
        branchId: branchInfo.branch.id,
        clientGuestId: guestId,
        invoiceId: -1,
        clientQuantity: Number(clientQuantity.value),
        startTime: new Date().toISOString(),
        status: SaleStatus.ONGOING,
        dollarExchange: 1,
        note: "",
      },
      insite: true,
      reservationId: null,
      guest: null,
      client: null,
      taxes: [],
      tables: tables.value,
      products: [],
    };
    const response = await fetchAPI((token: string) => createSaleService(dto, token));

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al crear la venta: ${message}`);
      return false;
    } else {
      setSaleFilter(true);
      return true;
    }
  };

  const onDeleteSale = async () => {
    const sale = saleSelected.value;
    if (!sale) return;

    const response = await fetchAPI((token: string) => deleteSaleService(sale.id, token));

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al eliminar la venta: ${message}`);
    } else {
      setSaleFilter(true);
    }
  };

  const onClearProducts = async () => {
    const sale = saleSelected.value;
    if (!sale) return;

    const response = await fetchAPI((token: string) => clearSaleService(sale.id, token));

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al eliminar los productos: ${message}`);
    } else {
      // Update sale
      setSales((oldSales) => {
        const newSales = [...oldSales];
        const saleIndex = newSales.findIndex((s) => s.id === sale.id);
        newSales[saleIndex].products = [];
        return newSales;
      });
    }
  };

  const onCloseSale = async () => {
    const sale = saleSelected.value;
    if (!sale) return;

    const dto = {
      id: sale.id,
      status: SaleStatus.CLOSED,
    };
    const response = await fetchAPI((token: string) => updateSaleService(dto, token));

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al cerrar la venta: ${message}`);
    } else {
      setSaleFilter(true);
      setReservationFilter(true);
    }
  };

  const onSaveSaleNote = async (note: string) => {
    const sale = saleSelected.value;
    if (!sale) return;

    const dto = {
      id: sale.id,
      note,
    };
    const response = await fetchAPI((token: string) => updateSaleService(dto, token));

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al guardar la nota: ${message}`);
    } else {
      // Update sale
      setSales((oldSales) => {
        const newSales = [...oldSales];
        const saleIndex = newSales.findIndex((s) => s.id === sale.id);
        newSales[saleIndex].note = note;
        return newSales;
      });
    }
  };

  // Reservation functions
  const addDatePlusHour = (date: Date, hour: string) => {
    if (!hour || hour === "") {
      return "";
    }
    const [hours, minutes, seconds] = hour.split(":").map(Number);
    date.setHours(hours, minutes, seconds, 0);
    return date.toISOString();
  };

  const onCreateReservation = async (
    newReservationDate: InputFormHook<Date | null>,
    newReservationHourIn: InputFormHook<OptionObject<string | null>>,
    newReservationHourOut: InputFormHook<OptionObject<string | null>>,
    newReservationTables: InputFormHook<string>,
    newReservationOccasion: InputFormHook<string>,
    identityDocumentType: InputFormHook<OptionObject<string | null>>,
    identityDocument: InputFormHook<string>
  ) => {
    if (!branchInfo) return false;

    const validGuestData = validateGuestData(
      guestEmail,
      guestPhone,
      guestFirstName,
      guestLastName,
      identityDocumentType,
      identityDocument
    );
    const validReservationData = validateReservationData(
      newReservationDate,
      newReservationTables,
      newReservationPersons,
      newReservationHourIn,
      newReservationHourOut
    );
    if (!validGuestData || !validReservationData) return false;

    const dto: ReservationInfoDTO = {
      reservation: {
        id: -1,
        branchId: branchInfo.branch.id,
        guestId: -1,
        invoiceId: -1,
        requestDate: new Date().toISOString(),
        reservationDateIn: addDatePlusHour(
          newReservationDate.value!,
          newReservationHourIn.value.value!
        ),
        reservationDateOut: addDatePlusHour(
          newReservationDate.value!,
          newReservationHourOut.value.value!
        ),
        price: 0,
        status: 1,
        tableNumber: parseInt(newReservationTables.value),
        clientNumber: parseInt(newReservationPersons.value),
        occasion: newReservationOccasion.value,
        byClient: false,
      },
      guest: {
        id: -1,
        name: guestFirstName.value,
        surname: guestLastName.value,
        email: guestEmail.value,
        phoneNumber: guestPhone.value,
        identityDocument: identityDocumentType.value.value! + identityDocument.value.trim(),
      },
      invoice: null,
      owner: null,
    };
    const response = await fetchAPI((token: string) => postReservationService(dto, token));

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error al crear la venta: ${message}`);
      return false;
    } else {
      setReservationFilter(true);
      return true;
    }
  };

  const rejectReservation = async (id: number) => {
    const response = await fetchAPI((token: string) => rejectReservationService(id, token));

    if (!!response.isError || typeof response.data === "string") {
      if (!!response.exception) {
      }
    } else {
      setReservationFilter(true);
    }
  };

  const acceptReservation = async (id: number) => {
    const response = await fetchAPI((token: string) => acceptReservationService(id, token));

    if (!!response.isError) {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error aceptando la reserva: ${message}`);
    } else {
      setReservationFilter(true);
    }
  };

  const retireReservation = async (id: number) => {
    const response = await fetchAPI((token: string) => retireReservationService(id, token));

    if (!!response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error rechazando la reserva: ${message}`);
    } else {
      setReservationFilter(true);
    }
  };

  const startReservation = async (
    id: number,
    tables: TableObject[],
    newTable: InputFormHook<any>
  ) => {
    if (tables.length === 0) {
      newTable.setCode(4);
      newTable.setMessage("Debe seleccionar al menos una mesa");
      return false;
    }

    const response = await fetchAPI((token: string) =>
      startReservationService(id, { tables }, token)
    );

    if (!!response.isError || typeof response.data === "string") {
      const message = !!response.exception ? response.exception.message : response.error?.message;
      alertService.error(`Error cancelando la reserva: ${message}`);
      return false;
    } else {
      setReservationFilter(true);
      setSaleFilter(true);
      return true;
    }
  };

  // Get tables
  useEffect(() => {
    if (!branchInfo) return;

    const branch = branchInfo.branch;

    const getTables = async () => {
      const response = await fetchAPI((token: string) => getTablesService(branch.id, token));

      if (response.isError || typeof response.data === "string") {
        const message = !!response.exception ? response.exception.message : response.error?.message;
        alertService.error(`Error al obtener las mesas: ${message}`);
      } else if (response.data?.tables.length! > 0) {
        // Sort tables by name
        const tables = response.data?.tables!;
        tables.sort((a, b) => a.name.localeCompare(b.name));
        setTables(tables);

        if (tableSelected.value !== null) {
          const tableIndex = tables.findIndex((t) => t.id === tableSelected.value!.id);
          if (tableIndex === -1) {
            tableSelected.setValue(tables[0]);
          } else {
            tableSelected.setValue(tables[tableIndex]);
          }
        } else {
          tableSelected.setValue(tables[0]);
        }
      }
    };

    getTables();
  }, [branchInfo]);

  // Get sales
  useEffect(() => {
    if (!saleFilter || !branchInfo) return;

    setSaleFilter(false);
    const branch = branchInfo.branch;

    const getSales = async () => {
      const response = await fetchAPI((token: string) =>
        getSalesService(
          branch.id,
          token,
          salePage - 1,
          pastSalesNumber,
          filterStartDate.value,
          filterEndDate.value,
          filterFullName.value,
          (filterIdentityDocumentType.value.value || "") + filterIdentityDocument.value
        )
      );
      const data = response.data;

      if (response.isError || typeof data === "string") {
        const message = !!response.exception ? response.exception.message : response.error?.message;
        alertService.error(`Error al obtener las ventas: ${message}`);
      } else {
        const ongoing = data?.ongoingSalesInfo!.map((saleInfo) => saleInfoToObject(saleInfo));
        const historic = data?.historicSalesInfo!.map((saleInfo) => {
          return {
            sale: saleInfoToObject(saleInfo),
            hasReservation: !!saleInfo.reservationId && saleInfo.reservationId !== -1,
          };
        });

        setSales(ongoing!);
        setHistoricSales(historic!);
        setSaleTotalPages(data?.totalHistoricPages!);

        // Verify if current sale is in the list
        const sale = saleSelected.value;
        if (sale !== null) {
          const saleIndex = ongoing!.findIndex((sale) => sale.id === sale.id);
          if (saleIndex === -1) {
            saleSelected.setValue(ongoing![0]);
          } else {
            saleSelected.setValue(ongoing![saleIndex]);
          }
        }
      }
    };

    getSales();
  }, [salePage, pastSalesNumber, saleFilter, branchInfo]);

  // Get reservations
  useEffect(() => {
    if (!reservationFilter || !branchInfo) return;

    setReservationFilter(false);
    const branch = branchInfo.branch;

    const getReservations = async () => {
      const response = await fetchAPI((token: string) =>
        getBranchReservations(
          branch.id,
          token,
          reservationPage - 1,
          pastReservationsNumber,
          filterStartDate.value,
          filterEndDate.value,
          filterFullName.value,
          (filterIdentityDocumentType.value.value || "") + filterIdentityDocument.value,
          filterStatus.value.value === null ? null : [filterStatus.value.value]
        )
      );

      if (response.isError || typeof response.data === "string") {
        const message = !!response.exception ? response.exception.message : response.error?.message;
        alertService.error(`Error al obtener las reservas: ${message}`);
      } else {
        const pending = response.data?.pendingReservations!.map((reservationInfo) => {
          return {
            ...toReservationProps(reservationInfo, tables),
            onReject: () => rejectReservation(reservationInfo.reservation.id),
            onAccept: () => acceptReservation(reservationInfo.reservation.id),
          };
        });
        const accepted = response.data?.acceptedReservations!.map((reservationInfo) => {
          return {
            ...toReservationProps(reservationInfo, tables),
            onRetire: () => retireReservation(reservationInfo.reservation.id),
            onStart: (tables: TableObject[], newTable: InputFormHook<any>) =>
              startReservation(reservationInfo.reservation.id, tables, newTable),
          };
        });
        const historic = response.data?.historicReservations!.map((reservationInfo) => {
          return {
            ...toReservationProps(reservationInfo, tables),
          };
        });

        setPastReservations(historic!);
        setPendingReservations(pending!.reverse());
        setAcceptedReservations(accepted!.reverse());
        setReservationTotalPages(response.data?.totalHistoricPages!);
      }
    };

    getReservations();
  }, [reservationPage, pastReservationsNumber, reservationFilter, branchInfo, tables]);

  // Verify branch capacity
  useEffect(() => {
    if (!branchInfo) return;

    // Warning Persons
    const branch = branchInfo.branch;
    try {
      parseInt(newReservationPersons.value);
      if (parseInt(newReservationPersons.value) > branch.capacity) {
        newReservationPersons.setCode(3);
        newReservationPersons.setMessage("Excede la capacidad del local");
      } else {
        if (newReservationPersons.code != 1) newReservationPersons.setCode(0);
      }
    } catch (error) {}
  }, [newReservationPersons.value]);

  return (
    <BranchSales
      // General info
      header={header}
      haveBranch={branchInfo !== undefined}
      // Sales data
      saleSelected={saleSelected}
      tableSelected={tableSelected}
      sales={sales}
      tables={tables}
      products={products}
      categories={categories}
      subCategories={subCategories}
      onAddTax={onAddTax}
      onAddProduct={onAddProduct}
      onClearProducts={onClearProducts}
      onCreateSale={onCreateSale}
      onCloseSale={onCloseSale}
      onDeleteSale={onDeleteSale}
      onSaveSaleNote={onSaveSaleNote}
      onGetGuest={onGetGuest}
      // Historic sales
      pastSales={historicSales}
      salePage={salePage}
      saleTotalPages={saleTotalPages}
      onSaleNextPage={() => {
        setSalePage((p) => p + 1);
        setSaleFilter(true);
      }}
      onSalePreviousPage={() => {
        setSalePage((p) => p - 1);
        setSaleFilter(true);
      }}
      // Historic reservations
      reservationPage={reservationPage}
      pastReservations={pastReservations}
      pendingReservations={pendingReservations}
      acceptedReservations={acceptedReservations}
      reservationTotalPages={reservationTotalPages}
      onReservationNextPage={() => {
        setReservationPage((p) => p + 1);
        setReservationFilter(true);
      }}
      onReservationPreviousPage={() => {
        setReservationPage((p) => p - 1);
        setReservationFilter(true);
      }}
      // Guest data
      guestEmail={guestEmail}
      guestPhone={guestPhone}
      guestLastName={guestLastName}
      guestFirstName={guestFirstName}
      // Reservation data
      validHoursIn={validHours.in}
      validHoursOut={validHours.out}
      durationHour={averageReserveTime.hours}
      durationMin={averageReserveTime.minutes}
      newReservationPersons={newReservationPersons}
      onCreateReservation={onCreateReservation}
      // Filters
      filterFullName={filterFullName}
      filterIdentityDocument={filterIdentityDocument}
      filterEndDate={filterEndDate}
      filterStartDate={filterStartDate}
      filterStatus={filterStatus}
      filterIdentityDocumentType={filterIdentityDocumentType}
      onGetSalesFiltered={() => setSaleFilter(true)}
      onGetReservationsFiltered={() => setReservationFilter(true)}
    />
  );
}
