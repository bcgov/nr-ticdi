import React, { useEffect, useState } from 'react';
import { DataTable } from './DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { getSearchData } from '../../common/search';

export type SearchData = {
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
  const [searchData, setSearchData] = useState<SearchData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSearchData();
      console.log(data);
      setSearchData(data);
    };

    fetchData();
  }, []);

  const activeRadioHandler = (nfrId: number) => {};

  const columnHelper = createColumnHelper<SearchData>();

  const columns: ColumnDef<SearchData, any>[] = [
    columnHelper.accessor('dtid', {
      id: 'dtid',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '80px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'DTID',
      meta: { customCss: { minWidth: '80px', width: '80px' } },
    }),
    columnHelper.accessor('version', {
      id: 'version',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '40px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Version',
      meta: { customCss: { minWidth: '40px', width: '40px' } },
    }),
    columnHelper.accessor('file_name', {
      id: 'file_name',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '300px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Template Name',
      meta: { customCss: { minWidth: '300px', width: '300px' } },
    }),
    columnHelper.accessor('updated_date', {
      id: 'updated_date',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '120px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Uploaded Date',
      meta: { customCss: { minWidth: '120px', width: '120px' } },
    }),
    columnHelper.accessor('status', {
      id: 'status',
      cell: (info) => (
        <input value={info.getValue()} style={{ minWidth: '80px', marginTop: '10px', marginRight: '5px' }} disabled />
      ),
      header: () => 'Status',
      meta: { customCss: { minWidth: '80px', width: '80px' } },
    }),
    columnHelper.accessor('active', {
      id: 'active',
      cell: (info) => (
        <input
          type="radio"
          name="activeSelection"
          checked={info.getValue() === true}
          onChange={() => activeRadioHandler(info.row.original.nfr_id)}
          style={{ minWidth: '40px', marginTop: '10px' }}
        />
      ),
      header: () => '',
      meta: { customCss: { minWidth: '40px', width: '40px' } },
    }),
    columnHelper.accessor('nfr_id', {
      id: 'nfr_id',
      cell: () => null,
      header: () => null,
      meta: { customCss: { display: 'none' } },
    }),
    columnHelper.accessor('variant_name', {
      id: 'variant_name',
      cell: () => null,
      header: () => null,
      meta: { customCss: { display: 'none' } },
    }),
  ];

  return <DataTable columns={columns} data={searchData} />;
};

export default SearchDataTable;
