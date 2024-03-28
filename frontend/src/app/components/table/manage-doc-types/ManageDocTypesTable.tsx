import React from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DocType } from '../../../types/types';

interface ManageDocTypesTableProps {
  documentTypes: DocType[];
  handleEdit: (id: number) => void;
  handleRemove: (id: number) => void;
}

const ManageDocTypesTable: React.FC<ManageDocTypesTableProps> = ({ documentTypes, handleEdit, handleRemove }) => {
  const editDocTypeButtonHandler = (id: number) => {
    handleEdit(id);
  };

  const removeDocTypeButtonHandler = (id: number) => {
    handleRemove(id);
  };

  const columnHelper = createColumnHelper<DocType>();

  const columns: ColumnDef<DocType, any>[] = [
    columnHelper.accessor('name', {
      id: 'name',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Name',
      enableSorting: true,
      meta: { customCss: { width: '30%' } },
    }),
    columnHelper.accessor('created_date', {
      id: 'created_date',
      cell: (info) => <input value={info.getValue()?.substring(0, 10)} className="readonlyInput" readOnly />,
      header: () => 'Create Date',
      enableSorting: true,
      meta: { customCss: { width: '30%' } },
    }),
    columnHelper.accessor('created_by', {
      id: 'created_by',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Created By',
      enableSorting: true,
      meta: { customCss: { width: '30%' } },
    }),
    columnHelper.display({
      id: 'edit',
      cell: (info) => (
        <button
          onClick={() => editDocTypeButtonHandler(info.row.original.id)}
          style={{
            backgroundColor: 'transparent',
            color: 'blue',
            textDecoration: 'underline',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Edit
        </button>
      ),
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '10%' } },
    }),
    columnHelper.display({
      id: 'remove',
      cell: (info) => (
        <button
          onClick={() => removeDocTypeButtonHandler(info.row.original.id)}
          style={{
            backgroundColor: 'transparent',
            color: 'blue',
            textDecoration: 'underline',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Remove
        </button>
      ),
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '10%' } },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={documentTypes}
      enableSorting={true}
      initialSorting={[{ id: 'name', desc: false }]}
    />
  );
};

export default ManageDocTypesTable;
