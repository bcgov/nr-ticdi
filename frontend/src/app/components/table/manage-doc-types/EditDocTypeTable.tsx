import { FC, useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { DocType } from '../../../types/types';

import { Column, ColumnDef, Row, createColumnHelper } from '@tanstack/react-table';

interface EditDocTypeTableProps {
  documentType: DocType[];
  onUpdate: (documentType: DocType) => void;
}

const EditDocTypeTable: FC<EditDocTypeTableProps> = ({ documentType, onUpdate }) => {
  const [updatedDocType, setUpdatedDocType] = useState(documentType[0]);

  useEffect(() => {
    onUpdate(updatedDocType);
  }, [updatedDocType, onUpdate]);

  const handleCellUpdate = (columnId: string, newValue: any) => {
    setUpdatedDocType((prev) => ({
      ...prev,
      [columnId]: newValue,
    }));
  };

  const columnHelper = createColumnHelper<DocType>();

  const columns: ColumnDef<DocType, any>[] = [
    columnHelper.accessor('name', {
      id: 'name',
      cell: (info) => (
        <TableCell getValue={info.getValue} row={info.row} columnId={info.column.id} onCellUpdate={handleCellUpdate} />
      ),
      header: () => 'Document Type Name',
      enableSorting: false,
      meta: { customCss: { width: '20%' }, type: 'text' },
    }),
    columnHelper.accessor('created_date', {
      id: 'created_date',
      cell: (info) => (
        <TableCell getValue={info.getValue} row={info.row} columnId={info.column.id} onCellUpdate={handleCellUpdate} />
      ),
      header: () => 'Date Created',
      enableSorting: false,
      meta: { customCss: { width: '20%', margin: '0px' }, type: 'text' },
    }),
    columnHelper.accessor('created_by', {
      id: 'created_by',
      cell: (info) => (
        <TableCell getValue={info.getValue} row={info.row} columnId={info.column.id} onCellUpdate={handleCellUpdate} />
      ),
      header: () => 'Created By',
      enableSorting: false,
      meta: { customCss: { width: '20%' }, type: 'text' },
    }),
    columnHelper.accessor('update_timestamp', {
      id: 'update_timestamp',
      cell: (info) => <input value={info.getValue().substring(0, 10)} className="readonlyInput" readOnly />,
      header: () => 'Last Updated Date',
      enableSorting: false,
      meta: { customCss: { width: '20%' }, type: 'text' },
    }),
    columnHelper.accessor('update_userid', {
      id: 'update_userid',
      cell: (info) => <input value={info.getValue()} className="readonlyInput" readOnly />,
      header: () => 'Last Updated By',
      enableSorting: false,
      meta: { customCss: { width: '20%' }, type: 'text' },
    }),
  ];

  return <DataTable columns={columns} data={documentType} />;
};

export default EditDocTypeTable;

interface TableCellProps<T> {
  getValue: () => any;
  row: Row<T>;
  columnId: string;
  onCellUpdate: (columnId: string, newValue: any) => void;
}

const TableCell: FC<TableCellProps<DocType>> = ({ getValue, row, columnId, onCellUpdate }) => {
  const initialValue = getValue() ? (columnId === 'created_date' ? getValue().substring(0, 10) : getValue()) : '';
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    onCellUpdate(columnId, value);
  };

  return <input type="text" value={value} onChange={handleChange} onBlur={onBlur} style={{ width: '100%' }} />;
};
