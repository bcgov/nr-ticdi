import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { getSearchData } from '../../../common/search';
import { SearchData } from '../../../types/types';

interface SearchDataTableProps {
  searchTerm: string;
  setSelectedDocumentChange: (dtid: number, variant_name: string) => void;
}

const SearchDataTable: React.FC<SearchDataTableProps> = ({ searchTerm, setSelectedDocumentChange }) => {
  const [searchData, setSearchData] = useState<SearchData[]>([]);
  const [filteredSearchData, setFilteredSearchData] = useState<SearchData[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<{ dtid: number; variant_name: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data: SearchData[] = await getSearchData();
      data.sort((a, b) => a.dtid - b.dtid); // sort by dtid for now
      const firstItem: SearchData | null = data[0] ? data[0] : null;
      if (firstItem) {
        const { dtid, variant_name } = firstItem;
        setSelectedDocument({ dtid, variant_name });
        setSelectedDocumentChange(dtid, variant_name);
      }
      setSearchData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      if (!searchTerm || searchTerm === '') {
        setFilteredSearchData(searchData);
        return;
      }
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      const filteredData = searchData.filter((item) =>
        (Object.keys(item) as (keyof SearchData)[]).some((key) =>
          String(item[key]).toLowerCase().includes(lowerCaseSearchTerm)
        )
      );

      setFilteredSearchData(filteredData);
    };

    filterData();
  }, [searchTerm, searchData]);

  const activeRadioHandler = (dtid: number, variant_name: string) => {
    setSelectedDocument({ dtid, variant_name });
    setSelectedDocumentChange(dtid, variant_name);
  };

  const columnHelper = createColumnHelper<SearchData>();

  const columns: ColumnDef<SearchData, any>[] = [
    columnHelper.accessor('dtid', {
      id: 'dtid',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'DTID',
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.accessor('version', {
      id: 'version',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Version',
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.accessor('file_name', {
      id: 'file_name',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Template Name',
      meta: { customCss: { width: '50%' } },
    }),
    columnHelper.accessor('updated_date', {
      id: 'updated_date',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Uploaded Date',
      meta: { customCss: { width: '15%' } },
    }),
    columnHelper.accessor('status', {
      id: 'status',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Status',
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.accessor('active', {
      id: 'active',
      cell: (info) => (
        <input
          type="radio"
          name="activeSelection"
          checked={info.row.original.dtid === selectedDocument?.dtid}
          onChange={() => activeRadioHandler(info.row.original.dtid, info.row.original.variant_name)}
          style={{ width: '100%' }}
        />
      ),
      header: () => '',
      meta: { customCss: { width: '5%' } },
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

  return <DataTable columns={columns} data={filteredSearchData} />;
};

export default SearchDataTable;
