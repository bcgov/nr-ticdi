import { FC, useEffect, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { DocType } from '../../../types/types';

import { Column, ColumnDef, Row, createColumnHelper } from '@tanstack/react-table';

interface EditDocTypeTableProps {
  documentType: DocType[];
}

const EditDocTypeTable: FC<EditDocTypeTableProps> = ({ documentType }) => {
  const handleCellUpdate = (rowIndex: number, columnId: keyof DocType, newValue: any) => {
    console.log('cell updated');
    console.log('rowIndex ' + rowIndex);
    console.log('columnId ' + columnId);
    console.log('newValue ' + newValue);
  };

  const columnHelper = createColumnHelper<DocType>();

  const columns: ColumnDef<DocType, any>[] = [
    columnHelper.accessor('name', {
      id: 'name',
      cell: (info) => (
        <TableCell getValue={info.getValue} row={info.row} column={info.column} onCellUpdate={handleCellUpdate} />
      ),
      header: () => 'Document Type Name',
      enableSorting: false,
      meta: { customCss: { width: '20%' }, type: 'text' },
    }),
    columnHelper.accessor('created_date', {
      id: 'created_date',
      cell: (info) => (
        <TableCell getValue={info.getValue} row={info.row} column={info.column} onCellUpdate={handleCellUpdate} />
      ),
      header: () => 'Date Created',
      enableSorting: false,
      meta: { customCss: { width: '20%', margin: '0px' }, type: 'text' },
    }),
    columnHelper.accessor('created_by', {
      id: 'created_by',
      cell: (info) => (
        <TableCell getValue={info.getValue} row={info.row} column={info.column} onCellUpdate={handleCellUpdate} />
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
  column: Column<T, any>;
  onCellUpdate: (rowIndex: number, columnId: keyof DocType, newValue: any) => void; // Updated type
}

const TableCell: FC<TableCellProps<DocType>> = ({ getValue, row, column, onCellUpdate }) => {
  const initialValue = column.id === 'created_date' ? getValue().substring(0, 10) : getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    const validKeys: (keyof DocType)[] = ['name', 'created_by', 'created_date'];
    if (validKeys.includes(column.id as keyof DocType)) {
      onCellUpdate(row.index, column.id as keyof DocType, value);
    }
  };

  return <input value={value} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} type={'text'} />;
};
