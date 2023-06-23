import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import PageProps from "../src/objects/PageProps";
import { TaxType } from "../src/objects/sale/TaxDTO";
import { useAppSelector } from "../src/context/store";
import TableDTO from "../src/objects/branch/TableDTO";
import SaleDTO, { SaleStatus } from "../src/objects/sale/SaleDTO";
import getSalesService from "../src/services/sale/getSalesService";
import deleteTaxService from "../src/services/sale/deleteTaxService";
import updateTaxService from "../src/services/sale/updateTaxService";
import createTaxService from "../src/services/sale/createTaxService";
import clearSaleService from "../src/services/sale/clearSaleService";
import createSaleService from "../src/services/sale/createSaleService";
import updateSaleService from "../src/services/sale/updateSaleService";
import deleteSaleService from "../src/services/sale/deleteSaleService";
import getTablesService from "../src/services/branch/getTablesService";
import createTableService from "../src/services/branch/createTableService";
import updateTableService from "../src/services/branch/updateTableService";
import deleteTableService from "../src/services/branch/deleteTableService";
import createProductSaleService from "../src/services/sale/createProductSaleService";
import updateProductSaleService from "../src/services/sale/updateProductSaleService";
import deleteProductSaleService from "../src/services/sale/deleteProductSaleService";
import {
  BranchSales,
  OptionObject,
  useInputForm,
  InputFormHook,
  ProductObject,
  ProductCategoryObject,
  ProductSubCategoryObject,
} from "paca-ui";

export default function Sales({ header, fetchAPI }: PageProps) {
  const router = useRouter();
  const { page } = router.query;
  const [totalPages, setTotalPages] = useState<number>(1);
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
    return ongoingSales.find((sale) => sale.tableId === table.value?.value?.id);
  }, [ongoingSales, table.value]);

  const products = useMemo(() => {
    if (!currentSale) return [];

    const onChangeAmount = async (id: number, amount: number) => {
      const response = await fetchAPI((token: string) =>
        updateProductSaleService({ id, amount: amount }, token)
      );
    };

    const onDelete = async (id: number, saleId: number) => {
      const response = await fetchAPI((token: string) =>
        deleteProductSaleService(id, saleId, token)
      );
    };

    return currentSale?.products!.map((product) => ({
      name: product.name,
      price: product.price,
      amount: product.amount,
      onChangeAmount: (amount: string) =>
        onChangeAmount(product.id, parseInt(amount)),
      onDelete: () => onDelete(product.id, currentSale.id),
    }));
  }, [currentSale]);

  const taxes = useMemo(() => {
    if (!currentSale) return [];

    return currentSale?.taxes!.map((tax, index) => {
      const saveValueFunction = async (
        name: InputFormHook<string>,
        type: InputFormHook<string>,
        value: InputFormHook<string>
      ) => {
        const response = await fetchAPI((token: string) =>
          updateTaxService(
            {
              id: tax.id,
              name: name.value,
              type: TaxType[type.value as keyof typeof TaxType],
              value: parseFloat(value.value),
            },
            token
          )
        );

        if (response.isError || typeof response.data === "string") {
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
          deleteTaxService(tax.id, tax.saleId, token)
        );

        if (response.isError || typeof response.data === "string") {
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
        name: tax.name,
        type: tax.type,
        value: tax.value,
        saveValueFunction,
        deleteValueFunction,
      };
    });
  }, [currentSale?.taxes]);

  const pastSales = useMemo(() => {
    return historicSales.map((sale) => ({
      ...sale,
      startDate: new Date(sale.startDate),
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
        return newTables;
      });

      return true;
    }
  };

  const onAddProduct = async (productId: number, amount: number) => {
    const response = await fetchAPI((token: string) =>
      createProductSaleService(
        {
          productId,
          saleId: currentSale!.id,
          amount: amount,
        },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
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
    const response = await fetchAPI((token: string) =>
      createSaleService(
        {
          tableId: table.value!.value!.id,
        },
        token
      )
    );

    if (response.isError || typeof response.data === "string") {
    } else {
      const newSale = response.data!;

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
      const pastSale = response.data!;
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
    } else {
    }
  };

  const onDeleteTable = async () => {
    const response = await fetchAPI((token: string) =>
      deleteTableService(table.value!.value!.id, token)
    );

    if (response.isError || typeof response.data === "string") {
    } else {
      // Update tables
      setAllTables((oldTables) => {
        const newTables = [...oldTables];
        const tableIndex = newTables.findIndex(
          (table) => table.value!.id === table.value!.id
        );
        newTables.splice(tableIndex, 1);
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
      } else if (response.data?.tables.length! > 0) {
        setAllTables(
          response.data?.tables.map((table) => ({
            label: table.name!,
            value: table!,
          }))!
        );
        table.setValue({
          label: response.data?.tables[0].name!,
          value: response.data?.tables[0]!,
        });
      }
    };

    getTables();
  }, []);

  // Get all sales
  useEffect(() => {
    const getSales = async () => {
      const response = await fetchAPI((token: string) =>
        getSalesService(branch.id, token, 1)
      );

      if (response.isError || typeof response.data === "string") {
      } else {
        setOngoingSales(response.data?.ongoingSales!);
        setHistoricSales(response.data?.historicSales!);
        setTotalPages(response.data?.totalPages!);
      }
    };

    getSales();
  }, []);

  return (
    <BranchSales
      header={header}
      // Ongoing sale
      table={table}
      taxes={taxes}
      products={products}
      allTables={allTables}
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
      page={parseInt(page as string) || 1}
      onNextPage={() =>
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            page: Math.min(totalPages, parseInt(page as string) + 1),
          },
        })
      }
      onPreviousPage={() =>
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            page: Math.max(1, parseInt(page as string) - 1),
          },
        })
      }
    />
  );
}
