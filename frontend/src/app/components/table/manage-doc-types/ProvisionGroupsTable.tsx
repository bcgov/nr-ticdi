import { FC, useEffect, useState } from 'react';
import { ProvisionGroup } from '../../../types/types';
import { Column, ColumnDef, Row, createColumnHelper } from '@tanstack/react-table';
import LinkButton from '../../common/LinkButton';
import { DataTable } from '../common/DataTable';

interface ProvisionGroupsTableProps {
  provisionGroups: ProvisionGroup[];
  onUpdate: (provisionGroups: ProvisionGroup[]) => void;
  showRemove: (provisionGroup: ProvisionGroup) => void;
}

const ProvisionGroupsTable: FC<ProvisionGroupsTableProps> = ({ provisionGroups, onUpdate, showRemove }) => {
  const [updatedProvisionGroups, setUpdatedProvisionGroups] = useState<ProvisionGroup[]>(provisionGroups);

  useEffect(() => {
    setUpdatedProvisionGroups(provisionGroups);
  }, [provisionGroups]);

  const showRemoveHandler = (provisionGroup: ProvisionGroup) => {
    showRemove(provisionGroup);
  };

  const handleCellUpdate = (rowIndex: number, columnId: keyof ProvisionGroup, newValue: any) => {
    const newProvisionGroups = updatedProvisionGroups.map((group, index) => {
      if (index === rowIndex) {
        let updatedValue;
        if (columnId === 'max') {
          updatedValue = !newValue || newValue === '' ? 999 : parseInt(newValue, 10);
        } else if (columnId === 'provision_group') {
          updatedValue = parseInt(newValue, 10);
        } else {
          updatedValue = newValue;
        }

        return { ...group, [columnId]: updatedValue };
      }
      return group;
    });

    setUpdatedProvisionGroups(newProvisionGroups);
    onUpdate(newProvisionGroups);
  };

  const columnHelper = createColumnHelper<ProvisionGroup>();

  const columns: ColumnDef<ProvisionGroup, any>[] = [
    columnHelper.accessor('provision_group', {
      id: 'provision_group',
      cell: (info) => (
        <TableCell getValue={info.getValue} row={info.row} column={info.column} onCellUpdate={handleCellUpdate} />
      ),
      header: () => 'Group',
      enableSorting: true,
      meta: { customCss: { width: '12%' }, type: 'text' },
    }),
    columnHelper.accessor('provision_group_text', {
      id: 'provision_group_text',
      cell: (info) => (
        <TableCell getValue={info.getValue} row={info.row} column={info.column} onCellUpdate={handleCellUpdate} />
      ),
      header: () => 'Description',
      enableSorting: true,
      meta: { customCss: { width: '64%', margin: '0px' }, type: 'text' },
    }),
    columnHelper.accessor('max', {
      id: 'max',
      cell: (info) => (
        <TableCell getValue={info.getValue} row={info.row} column={info.column} onCellUpdate={handleCellUpdate} />
      ),
      header: () => 'Max',
      enableSorting: false,
      meta: { customCss: { width: '12%' }, type: 'text' },
    }),
    columnHelper.display({
      id: 'remove',
      cell: (info) => <LinkButton text="Remove" onClick={() => showRemoveHandler(info.row.original)} />,
      header: () => null,
      enableSorting: false,
      meta: { customCss: { width: '12%' } },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={updatedProvisionGroups}
      enableSorting={true}
      initialSorting={[{ id: 'provision_group', desc: false }]}
    />
  );
};
export default ProvisionGroupsTable;

interface TableCellProps<T> {
  getValue: () => any;
  row: Row<T>;
  column: Column<T, any>;
  onCellUpdate: (rowIndex: number, columnId: keyof ProvisionGroup, newValue: any) => void; // Updated type
}

const TableCell: FC<TableCellProps<ProvisionGroup>> = ({ getValue, row, column, onCellUpdate }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    const validKeys: (keyof ProvisionGroup)[] = ['id', 'provision_group', 'provision_group_text', 'max'];
    if (validKeys.includes(column.id as keyof ProvisionGroup)) {
      onCellUpdate(row.index, column.id as keyof ProvisionGroup, value);
    }
  };

  return (
    <input
      value={value}
      className="form-control"
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      type={'text'}
      style={{ width: '100%' }}
    />
  );
};
