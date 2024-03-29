import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { getSearchData } from '../../../common/search';
import { DocType, SearchData } from '../../../types/types';

interface SearchDataTableProps {
  searchTerm: string;
  setSelectedDocumentChange: (dtid: number, documentType: DocType) => void;
}

const SearchDataTable: React.FC<SearchDataTableProps> = ({ searchTerm, setSelectedDocumentChange }) => {
  const [searchData, setSearchData] = useState<SearchData[]>([]);
  const [filteredSearchData, setFilteredSearchData] = useState<SearchData[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<{ dtid: number; document_type: DocType } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data: SearchData[] = await getSearchData();
      data.sort((a, b) => a.dtid - b.dtid); // sort by dtid for now
      const firstItem: SearchData | null = data[0] ? data[0] : null;
      if (firstItem) {
        const { dtid, document_type } = firstItem;
        setSelectedDocument({ dtid, document_type });
        setSelectedDocumentChange(dtid, document_type);
      }
      setSearchData(data);
    };

    fetchData();
  }, [setSelectedDocumentChange]);

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

  const activeRadioHandler = (dtid: number, document_type: DocType) => {
    setSelectedDocument({ dtid, document_type });
    setSelectedDocumentChange(dtid, document_type);
  };

  const columnHelper = createColumnHelper<SearchData>();

  const columns: ColumnDef<SearchData, any>[] = [
    columnHelper.accessor('dtid', {
      id: 'dtid',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'DTID',
      enableSorting: true,
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.accessor('version', {
      id: 'version',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Version',
      enableSorting: false,
      meta: { customCss: { width: '6%' } },
    }),
    columnHelper.accessor((row) => row.document_type.name, {
      id: 'doc_type',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Document Type',
      enableSorting: false,
      meta: { customCss: { width: '24%' } },
    }),
    columnHelper.accessor('file_name', {
      id: 'file_name',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Template Name',
      enableSorting: false,
      meta: { customCss: { width: '36%' } },
    }),
    columnHelper.accessor('updated_date', {
      id: 'updated_date',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Uploaded Date',
      enableSorting: true,
      meta: { customCss: { width: '12%' } },
    }),
    columnHelper.accessor('status', {
      id: 'status',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Status',
      enableSorting: true,
      meta: { customCss: { width: '12%' } },
    }),
    columnHelper.accessor('active', {
      id: 'active',
      cell: (info) => (
        <input
          type="radio"
          name="activeSelection"
          checked={info.row.original.dtid === selectedDocument?.dtid}
          onChange={() => activeRadioHandler(info.row.original.dtid, info.row.original.document_type)}
          style={{ width: '100%' }}
        />
      ),
      header: () => '',
      enableSorting: false,
      meta: { customCss: { width: '5%' } },
    }),
    columnHelper.accessor('document_data_id', {
      id: 'nfr_id',
      cell: () => null,
      header: () => null,
      enableSorting: false,
      meta: { customCss: { display: 'none' } },
    }),
    columnHelper.accessor('document_type', {
      id: 'document_type',
      cell: () => null,
      header: () => null,
      enableSorting: false,
      meta: { customCss: { display: 'none' } },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredSearchData}
      // paginationSetup={{ enabled: true, pageSize: 10 }}
      enableSorting={true}
      initialSorting={[{ id: 'dtid', desc: false }]}
    />
  );
};

export default SearchDataTable;
