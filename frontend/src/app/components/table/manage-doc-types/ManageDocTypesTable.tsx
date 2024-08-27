import React, { useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DocType } from '../../../types/types';
import { activateDocType, deactivateDocType } from '../../../common/manage-doc-types';

interface ManageDocTypesTableProps {
  documentTypes: DocType[];
  handleEdit: (id: number) => void;
  handleRemove: (id: number) => void;
}

const ManageDocTypesTable: React.FC<ManageDocTypesTableProps> = ({ documentTypes, handleEdit, handleRemove }) => {
  // display a local copy of document types to reduce re-renders
  const [dtDisplayed, setDtDisplayed] = useState<DocType[]>([]);

  useEffect(() => {
    setDtDisplayed(documentTypes);
  }, [documentTypes]);

  const editDocTypeButtonHandler = (id: number) => {
    handleEdit(id);
  };

  const removeDocTypeButtonHandler = (id: number) => {
    handleRemove(id);
  };

  const activateHandler = async (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (event.target.checked) {
      await activate(id);
    } else {
      await deactivate(id);
    }
  };

  const activate = async (id: number) => {
    await activateDocType(id);
    setDtDisplayed((prevDtDisplayed) => prevDtDisplayed.map((dt) => (dt.id === id ? { ...dt, active: true } : dt)));
  };

  const deactivate = async (id: number) => {
    await deactivateDocType(id);
    setDtDisplayed((prevDtDisplayed) => prevDtDisplayed.map((dt) => (dt.id === id ? { ...dt, active: false } : dt)));
  };

  const columnHelper = createColumnHelper<DocType>();

  const columns: ColumnDef<DocType, any>[] = [
    columnHelper.accessor('name', {
      id: 'name',
      cell: (info) => <input value={info.getValue()} className="form-control readonlyInput" readOnly />,
      header: () => 'Name',
      enableSorting: true,
      meta: { customCss: { width: '30%' } },
    }),
    columnHelper.accessor('created_date', {
      id: 'created_date',
      cell: (info) => (
        <input value={info.getValue()?.substring(0, 10)} className="form-control readonlyInput" readOnly />
      ),
      header: () => 'Create Date',
      enableSorting: true,
      meta: { customCss: { width: '25%' } },
    }),
    columnHelper.accessor('created_by', {
      id: 'created_by',
      cell: (info) => <input value={info.getValue()} className="form-control readonlyInput" readOnly />,
      header: () => 'Created By',
      enableSorting: true,
      meta: { customCss: { width: '25%' } },
    }),
    columnHelper.accessor('active', {
      id: 'active',
      cell: (info) => (
        <input
          type="checkbox"
          checked={info.getValue()}
          onChange={(e) => activateHandler(e, info.row.original.id)}
          style={{ width: '100%' }}
        />
      ),
      header: () => 'Active',
      enableSorting: true,
      meta: { customCss: { width: '10%' } },
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
      data={dtDisplayed}
      enableSorting={true}
      initialSorting={[{ id: 'name', desc: false }]}
    />
  );
};

export default ManageDocTypesTable;
