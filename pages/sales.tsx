import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "context";
import { SaleDTO, SaleStatus, TableDTO, PageProps, TaxType } from "objects";
import {
  BranchSales,
  OptionObject,
  useInputForm,
  InputFormHook,
  ProductObject,
  ProductCategoryObject,
  ProductSubCategoryObject,
} from "paca-ui";
import {
  alertService,
  getSalesService,
  deleteTaxService,
  updateTaxService,
  createTaxService,
  clearSaleService,
  createSaleService,
  updateSaleService,
  deleteSaleService,
  getTablesService,
  createTableService,
  updateTableService,
  deleteTableService,
  createSaleProductService,
  updateSaleProductService,
  deleteSaleProductService,
} from "services";

export default function Sales({ header, fetchAPI }: PageProps) {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pastSalesNumber, setPastSalesNumber] = useState<number>(5);
  const branches = useAppSelector((state) => state.branches).branches;
  const products_ = useAppSelector((state) => state.products.products);
  const branchIndex = useAppSelector((state) => state.branches).current;
  const branch = branches[branchIndex];

  const [ongoingSales, setOngoingSales] = useState<SaleDTO[]>([]);
  const [historicSales, setHistoricSales] = useState<SaleDTO[]>([]);
  const [allTables, setAllTables] = useState<OptionObject<TableDTO>[]>([]);
  const table = useInputForm<OptionObject<TableDTO | null>>({
    label: "",
    value: null,
  });
  const productCategories_ = useAppSelector(
    (state) => state.products.categories
  );
  const productSubCategories_ = useAppSelector(
    (state) => state.products.subCategories
  );

  // Format all categories
  const productCategories = useMemo(() => {
    let productCategories: Record<number, ProductCategoryObject> = {};

    for (let key of Object.keys(productCategories_)) {
      const category = productCategories_[Number(key)];
      if (!category) continue;

      productCategories[category.id] = {
        id: category.id,
        name: category.name,
      };
    }

    return productCategories;
  }, [productCategories_]);

  // Format all sub-categories
  const productSubCategories = useMemo(() => {
    let productSubCategories: Record<number, ProductSubCategoryObject> = {};

    for (let key of Object.keys(productSubCategories_)) {
      const subCategory = productSubCategories_[Number(key)];
      if (!subCategory) continue;

      productSubCategories[subCategory.id] = {
        id: subCategory.id,
        name: subCategory.name,
        categoryId: subCategory.categoryId,
      };
    }

    return productSubCategories;
  }, [productSubCategories_]);

  // Format all products
  const allProducts = useMemo(() => {
    let products: Record<number, ProductObject> = {};

    for (let key of Object.keys(products_)) {
      const product = products_[Number(key)];
      if (!product) continue;

      products[product.id] = { ...product };
    }

    return products;
  }, [products_]);

  const currentSale = useMemo(() => {
    const sale = ongoingSales.find((s) => s.tableId === table.value?.value?.id);
    return sale;
  }, [ongoingSales, table.value.value?.id]);

  const products = useMemo(() => {
    if (!currentSale) return [];

    const onChangeAmount = async (id: number, amount: number) => {
      const response = await fetchAPI((token: string) =>
        updateSaleProductService({ id, amount: amount }, token)
      );

      if (response.isError || typeof response.data === "string") {
        const message = !!response.exception
          ? response.exception.message
          : response.error?.message;
        alertService.error(`Error al actualizar el producto: ${message}`);
      }
    };

    const onDelete = async (id: number, saleId: number) => {
      const response = await fetchAPI((token: string) =>
        deleteSaleProductService(id, saleId, token)
      );

      if (response.isError || typeof response.data === "string") {
        const message = !!response.exception
          ? response.exception.message
          : response.error?.message;
        alertService.error(`Error al eliminar el producto: ${message}`);
      } else {
        // Update products
        const newProducts = [...currentSale?.products!];
        newProducts.splice(
          newProducts.findIndex((product) => product.id === id),
          1
        );

        // Update sale
        setOngoingSales((oldSales) => {
          const newSales = [...oldSales];
          const saleIndex = newSales.findIndex(
            (sale) => sale.id === currentSale?.id
          );
          newSales[saleIndex].products = newProducts;
          return newSales;
        });
      }
    };

    const products = currentSale?.products!.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      amount: product.amount,
      onChangeAmount: (amount: string) =>
        onChangeAmount(product.id, parseInt(amount)),
      onDelete: () => onDelete(product.id, currentSale.id),
    }));

    // Sort products by id
    products?.sort((a, b) => a.id - b.id);

    return products;
  }, [currentSale?.products]);

  const taxes = useMemo(() => {
    if (!currentSale) return [];

    const taxes = currentSale?.taxes!.map((tax, index) => {
      const saveValueFunction = async (
        name: InputFormHook<string>,
        value: InputFormHook<string>,
        type: InputFormHook<string>
      ) => {
        const dto = {
          id: tax.id,
          name: name.value,
          type: TaxType[type.value as keyof typeof TaxType],
          value: Number(value.value),
        };
        const response = await fetchAPI((token: string) =>
          updateTaxService(dto, token)
        );

        if (response.isError || typeof response.data === "string") {
          const message = !!response.exception
            ? response.exception.message
            : response.error?.message;
          alertService.error(`Error al actualizar el impuesto: ${message}`);
        } else {
          // Update tax
          const newTaxes = [...currentSale.taxes!];
          newTaxes[index] = response.data!;

          // Update sale
          setOngoingSales((oldTaxes) => {
            const newSales = [...oldTaxes];
            const saleIndex = newSales.findIndex(
              (sale) => sale.id === currentSale.id
            );
            newSales[saleIndex].taxes = newTaxes;
            return newSales;
          });
        }
      };

      const deleteValueFunction = async () => {
        const response = await fetchAPI((token: string) =>
          deleteTaxService(tax.id, token)
        );

        if (response.isError || typeof response.data === "string") {
          const message = !!response.exception
            ? response.exception.message
            : response.error?.message;
          alertService.error(`Error al eliminar el impuesto: ${message}`);
        } else {
          // Delete tax
          const newTaxes = [...currentSale.taxes!];
          newTaxes.splice(index, 1);

          // Update sale
          setOngoingSales((oldTaxes) => {
            const newSales = [...oldTaxes];
            const saleIndex = newSales.findIndex(
              (sale) => sale.id === currentSale.id
            );
            newSales[saleIndex].taxes = newTaxes;
            return newSales;
          });
        }
      };

      return {
        id: tax.id,
        name: tax.name,
        type: tax.type,
        value: tax.value,
        saveValueFunction,
        deleteValueFunction,
      };
    });

    // Sort taxes by id
    taxes?.sort((a, b) => a.id - b.id);

    return taxes;
  }, [currentSale?.taxes]);

  const pastSales = useMemo(() => {
    return historicSales.map((sale) => ({
      ...sale,
      startTime: new Date(sale.startTime),
      taxes: sale.taxes.map((tax) => ({
        ...tax,
        type: TaxType[tax.type] as "$" | "%",
      })),
    }));
  }, [historicSales]);

  const onAddTax = async () => {
    const response = await fetchAPI((token: string) =>
      createTaxService(
        {
          name: `Tarifa ${taxes.length + 1}`,
          type: TaxType["%"],
          value: 0,
          saleId: currentSale!.id,
        },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error al crear el impuesto: ${message}`);
    } else {
      // Update tax
      const newTaxes = [...currentSale?.taxes!];
      newTaxes.push(response.data!);

      // Update sale
      setOngoingSales((oldTaxes) => {
        const newSales = [...oldTaxes];
        const saleIndex = newSales.findIndex(
          (sale) => sale.id === currentSale?.id
        );
        newSales[saleIndex].taxes = newTaxes;
        return newSales;
      });
    }
  };

  const onCreateTable = async (name: InputFormHook<string>) => {
    const response = await fetchAPI((token: string) =>
      createTableService(
        {
          name: name.value,
          branchId: branch.id,
          deleted: false,
        },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error al crear la mesa: ${message}`);
      return false;
    } else {
      const newTable = response.data!;

      // Update tables
      setAllTables((oldTables) => {
        const newTables = [...oldTables];
        newTables.push({
          label: newTable.name,
          value: newTable,
        });
        return newTables;
      });

      table.setValue({
        label: newTable.name,
        value: newTable,
      });

      return true;
    }
  };

  const onEditTable = async (name: InputFormHook<string>) => {
    const response = await fetchAPI((token: string) =>
      updateTableService(
        {
          id: table.value!.value!.id,
          name: name.value,
          branchId: branch.id,
          deleted: false,
        },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error al actualizar la mesa: ${message}`);
      return false;
    } else {
      const newTable = response.data!;
      // Update tables
      setAllTables((oldTables) => {
        const newTables = [...oldTables];
        const tableIndex = newTables.findIndex(
          (table) => table.value!.id === newTable.id
        );
        newTables[tableIndex] = {
          label: newTable.name,
          value: newTable,
        };
        table.setValue(newTables[tableIndex]);

        return newTables;
      });

      return true;
    }
  };

  const onAddProduct = async (productId: number, amount: number) => {
    const dto = {
      productId,
      saleId: currentSale!.id,
      amount: amount,
    };
    const response = await fetchAPI((token: string) =>
      createSaleProductService(dto, token)
    );

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error al agregar el producto: ${message}`);
      return false;
    } else {
      // Update products
      const newProducts = [...currentSale?.products!];
      newProducts.push(response.data!);

      // Update sale
      setOngoingSales((oldSales) => {
        const newSales = [...oldSales];
        const saleIndex = newSales.findIndex(
          (sale) => sale.id === currentSale?.id
        );
        newSales[saleIndex].products = newProducts;
        return newSales;
      });

      return true;
    }
  };

  const onClearProducts = async () => {
    const response = await fetchAPI((token: string) =>
      clearSaleService(currentSale!.id, token)
    );

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error al eliminar los productos: ${message}`);
    } else {
      // Update sale
      setOngoingSales((oldSales) => {
        const newSales = [...oldSales];
        const saleIndex = newSales.findIndex(
          (sale) => sale.id === currentSale?.id
        );
        newSales[saleIndex].products = [];
        return newSales;
      });
    }
  };

  const onCreateSale = async () => {
    if (!table.value.value) {
      alertService.error("No hay ninguna mesa seleccionada");
      return;
    }

    const dto = {
      tableId: table.value.value.id,
      clientQuantity: 1,
      startTime: new Date().toISOString(),
      status: SaleStatus.ONGOING,
      tableName: table.value.value.name,
      note: "",
      dollarToLocalCurrencyExchange: 1,
    };
    const response = await fetchAPI((token: string) =>
      createSaleService(dto, token)
    );

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error al crear la venta: ${message}`);
    } else {
      const newSale = {
        ...response.data!.sale,
        products: response.data!.products,
        taxes: response.data!.taxes,
      };

      // Update sales
      setOngoingSales((oldSales) => {
        const newSales = [...oldSales];
        newSales.push(newSale);
        return newSales;
      });
    }
  };

  const onCloseSale = async () => {
    const response = await fetchAPI((token: string) =>
      updateSaleService(
        {
          id: currentSale!.id,
          status: SaleStatus.CLOSED,
        },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error al cerrar la venta: ${message}`);
    } else {
      // Delete ongoing sales
      setOngoingSales((oldSales) => {
        const newSales = [...oldSales];
        const saleIndex = newSales.findIndex(
          (sale) => sale.id === currentSale?.id
        );
        newSales.splice(saleIndex, 1);
        return newSales;
      });

      // Add to historic sales
      const pastSale = {
        ...response.data!.sale,
        products: response.data!.products,
        taxes: response.data!.taxes,
      };

      setHistoricSales((oldSales) => {
        const newSales = [...oldSales];
        newSales.push(pastSale);
        return newSales;
      });
    }
  };

  const onDeleteSale = async () => {
    const response = await fetchAPI((token: string) =>
      deleteSaleService(currentSale!.id, token)
    );

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error al eliminar la venta: ${message}`);
    } else {
      // Update sales
      setOngoingSales((oldSales) => {
        const newSales = [...oldSales];
        const saleIndex = newSales.findIndex(
          (sale) => sale.id === currentSale?.id
        );
        newSales.splice(saleIndex, 1);
        return newSales;
      });
    }
  };

  const onSaveSaleNote = async (note: string) => {
    const response = await fetchAPI((token: string) =>
      updateSaleService(
        {
          id: currentSale!.id,
          note,
        },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error al guardar la nota: ${message}`);
    } else {
    }
  };

  const onDeleteTable = async () => {
    const response = await fetchAPI((token: string) =>
      deleteTableService(table.value!.value!.id, token)
    );

    if (response.isError || typeof response.data === "string") {
      const message = !!response.exception
        ? response.exception.message
        : response.error?.message;
      alertService.error(`Error al eliminar la mesa: ${message}`);
    } else {
      // Update tables
      setAllTables((oldTables) => {
        const newTables = [...oldTables];
        const tableIndex = newTables.findIndex(
          (t) => t.value!.id === table.value!.value!.id
        );
        newTables.splice(tableIndex, 1);

        if (newTables.length === 0) {
          table.setValue({
            label: "",
            value: null,
          });
        } else {
          table.setValue({
            label: newTables[0].label,
            value: newTables[0].value,
          });
        }

        return newTables;
      });
    }
  };

  // Get all tables
  useEffect(() => {
    const getTables = async () => {
      const response = await fetchAPI((token: string) =>
        getTablesService(branch.id, token)
      );

      if (response.isError || typeof response.data === "string") {
        const message = !!response.exception
          ? response.exception.message
          : response.error?.message;
        alertService.error(`Error al obtener las mesas: ${message}`);
      } else if (response.data?.tables.length! > 0) {
        const tables = response.data?.tables.map((table) => ({
          label: table.name!,
          value: table!,
        }))!;

        // Sort tables by name
        tables.sort((a, b) => a.label.localeCompare(b.label));
        setAllTables(tables);
        table.setValue({
          label: tables[0].value.name!,
          value: tables[0].value,
        });
      }
    };

    getTables();
  }, []);

  // Get all sales
  useEffect(() => {
    const getSales = async () => {
      const response = await fetchAPI((token: string) =>
        getSalesService(branch.id, token, page - 1, pastSalesNumber)
      );

      if (response.isError || typeof response.data === "string") {
        const message = !!response.exception
          ? response.exception.message
          : response.error?.message;
        alertService.error(`Error al obtener las ventas: ${message}`);
      } else {
        const ongoing = response.data?.ongoingSalesInfo!.map((saleInfo) => {
          return {
            ...saleInfo.sale,
            taxes: saleInfo.taxes,
            products: saleInfo.products,
          };
        });
        const historic = response.data?.historicSalesInfo!.map((saleInfo) => {
          return {
            ...saleInfo.sale,
            taxes: saleInfo.taxes,
            products: saleInfo.products,
          };
        });

        setOngoingSales(ongoing!);
        setHistoricSales(historic!);
        setTotalPages(response.data?.totalHistoricPages!);
      }
    };

    getSales();
  }, [page, pastSalesNumber]);

  return (
    <BranchSales
      header={header}
      // Ongoing sale
      table={table}
      taxes={taxes}
      products={products}
      allTables={allTables}
      note={currentSale?.note!}
      allProducts={allProducts}
      categories={productCategories}
      hasSale={currentSale !== undefined}
      subCategories={productSubCategories}
      // Ongoing sale actions
      onAddTax={onAddTax}
      onCreateTable={onCreateTable}
      onEditTable={onEditTable}
      onAddProduct={onAddProduct}
      onClearProducts={onClearProducts}
      onCreateSale={onCreateSale}
      onCloseSale={onCloseSale}
      onDeleteSale={onDeleteSale}
      onSaveSaleNote={onSaveSaleNote}
      onDeleteTable={onDeleteTable}
      // Historic sales
      pastSales={pastSales}
      totalPages={totalPages}
      page={page}
      onNextPage={() => setPage(page + 1)}
      onPreviousPage={() => setPage(page - 1)}
    />
  );
}