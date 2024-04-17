import { FC, useEffect, useMemo, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { DocType } from '../../../types/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toZonedTime, format as tzFormat } from 'date-fns-tz';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { setUpdatedDocType } from '../../../store/reducers/docTypeSlice';

interface EditDocTypeTableProps {
  documentType: DocType[];
  onUpdate: (documentType: DocType) => void;
}

const EditDocTypeTable: FC<EditDocTypeTableProps> = ({}) => {
  const { updatedDocType } = useSelector((state: RootState) => state.docType);

  const columnHelper = createColumnHelper<DocType>();
  const columns: ColumnDef<DocType, any>[] = [
    columnHelper.accessor('name', {
      id: 'name',
      cell: (info) => <TableCell getValue={info.getValue} columnId={info.column.id} />,
      header: () => 'Document Type Name',
      enableSorting: false,
      meta: { customCss: { width: '20%' }, type: 'text' },
    }),
    columnHelper.accessor('created_date', {
      id: 'created_date',
      cell: (info) => <DateTableCell getValue={info.getValue} columnId={info.column.id} />,
      header: () => 'Date Created',
      enableSorting: false,
      meta: { customCss: { width: '20%', margin: '0px' }, type: 'text' },
    }),
    columnHelper.accessor('created_by', {
      id: 'created_by',
      cell: (info) => <TableCell getValue={info.getValue} columnId={info.column.id} />,
      header: () => 'Created By',
      enableSorting: false,
      meta: { customCss: { width: '20%' }, type: 'text' },
    }),
    columnHelper.accessor('update_timestamp', {
      id: 'update_timestamp',
      cell: (info) => <input value={info.getValue().substring(0, 10)} className="form-control" readOnly />,
      header: () => 'Last Updated Date',
      enableSorting: false,
      meta: { customCss: { width: '20%' }, type: 'text' },
    }),
    columnHelper.accessor('update_userid', {
      id: 'update_userid',
      cell: (info) => <input value={info.getValue()} className="form-control" readOnly />,
      header: () => 'Last Updated By',
      enableSorting: false,
      meta: { customCss: { width: '20%' }, type: 'text' },
    }),
  ];

  return <DataTable columns={columns} data={[updatedDocType]} />;
};

export default EditDocTypeTable;

interface TableCellProps<T> {
  getValue: () => any;
  columnId: string;
}

const TableCell: FC<TableCellProps<DocType>> = ({ getValue, columnId }) => {
  const dispatch = useDispatch();
  const updatedDocType = useSelector((state: RootState) => state.docType.updatedDocType);
  const initialValue = getValue() ? (columnId === 'created_date' ? getValue().substring(0, 10) : getValue()) : '';
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    dispatch(setUpdatedDocType({ ...updatedDocType, [columnId]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      style={{ width: '100%' }}
      className="form-control"
    />
  );
};

const DateTableCell: FC<TableCellProps<DocType>> = ({ getValue, columnId }) => {
  const dispatch = useDispatch();
  const updatedDocType = useSelector((state: RootState) => state.docType.updatedDocType);

  const timeZone = 'UTC';

  const initialValue = useMemo(() => {
    const dateValue = getValue();
    return dateValue ? toZonedTime(new Date(dateValue), timeZone) : null;
  }, [getValue]);

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleDateChange = (date: Date | null) => {
    setValue(date);
    if (date) {
      const formattedDate = tzFormat(date, 'yyyy-MM-dd', { timeZone });
      dispatch(
        setUpdatedDocType({
          ...updatedDocType,
          [columnId]: formattedDate,
        })
      );
    }
  };

  return <DatePicker selected={value} onChange={handleDateChange} dateFormat="yyyy-MM-dd" className="form-control" />;
};
