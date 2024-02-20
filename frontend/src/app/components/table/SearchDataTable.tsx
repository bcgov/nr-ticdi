import React, { useEffect, useState } from "react";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";

type SearchData = {
  dtid: number;
  version: number;
  file_name: string;
  updated_date: string;
  status: string;
  active: boolean;
  nfr_id: number;
  variant_name: string;
};

const SearchDataTable: React.FC = () => {
  const [data, setData] = useState<SearchData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("localhost:3001/report/search-nfr-data");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Failed to fetch search data:", error);
      }
    };

    fetchData();
  }, []);

  const columns: ColumnDef<SearchData>[] = [
    {
      accessorKey: "dtid",
      header: "DTID",
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "version",
      header: "Version",
    },
    {
      accessorKey: "file_name",
      header: "File Name",
      enableSorting: true,
    },
    {
      accessorKey: "updated_date",
      header: "Updated Date",
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
    },
    {
      accessorKey: "active",
      header: "Active",
      cell: (info) => (info.renderValue() ? "Yes" : "No"), // Adjust according to how you want to display booleans
    },
    {
      accessorKey: "nfr_id",
      header: "NFR ID",
      enableHiding: true,
    },
    {
      accessorKey: "variant_name",
      header: "Variant Name",
      enableHiding: true,
    },
  ];

  return <DataTable columns={columns} data={data} />;
};

export default SearchDataTable;
