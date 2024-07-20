import React, { FC, useEffect, useMemo, useState } from 'react';
import { DataTable } from '../common/DataTable';
import { DocType } from '../../../types/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toZonedTime, format as tzFormat } from 'date-fns-tz';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { setDocType, setUpdatedDocType } from '../../../store/reducers/docTypeSlice';
import { updateDocType } from '../../../common/manage-doc-types';
import { Button } from 'react-bootstrap';

interface EditDocTypeTableProps {
  refreshDocTypes: () => void;
}

const EditDocTypeTable: FC<EditDocTypeTableProps> = ({ refreshDocTypes }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { selectedDocType } = useSelector((state: RootState) => state.docType);
  const [currentDocType, setCurrentDocType] = useState<DocType>(selectedDocType);

  useEffect(() => {
    setCurrentDocType(selectedDocType);
  }, [selectedDocType]);

  const handleEditButton = () => {
    setIsEditing(true);
  };

  const handleSaveButton = async () => {
    try {
      setIsLoading(true);
      await updateDocType(
        selectedDocType.id,
        currentDocType.name,
        currentDocType.prefix,
        currentDocType.created_by,
        currentDocType.created_date
      );
      dispatch(setDocType({ ...currentDocType }));
      refreshDocTypes();
    } catch (err) {
      console.log(err);
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  const handleCancelButton = () => {
    setCurrentDocType(selectedDocType);
    setIsEditing(false);
  };

  const updateHandler = (newValue: any) => {
    setCurrentDocType({ ...currentDocType, ...newValue });
  };

  const columnHelper = createColumnHelper<DocType>();
  const columns: ColumnDef<DocType, any>[] = [
    columnHelper.accessor('name', {
      id: 'name',
      cell: ({ row }) => (
        <TableCell getValue={() => row.original.name} columnId="name" onUpdate={updateHandler} isEditing={isEditing} />
      ),
      header: () => 'Document Type Name',
      enableSorting: false,
      meta: { customCss: { width: '24%' }, type: 'text' },
    }),
    columnHelper.accessor('prefix', {
      id: 'prefix',
      cell: ({ row }) => (
        <TableCell
          getValue={() => row.original.prefix}
          columnId="prefix"
          onUpdate={updateHandler}
          isEditing={isEditing}
        />
      ),
      header: () => 'File Prefix',
      enableSorting: true,
      meta: { customCss: { width: '12%' }, type: 'text' },
    }),
    columnHelper.accessor('created_date', {
      id: 'created_date',
      cell: ({ row }) => (
        <DateTableCell
          getValue={() => row.original.created_date}
          columnId="created_date"
          onUpdate={updateHandler}
          isEditing={isEditing}
        />
      ),
      header: () => 'Date Created',
      enableSorting: false,
      meta: { customCss: { width: '12%', margin: '0px' }, type: 'text' },
    }),
    columnHelper.accessor('created_by', {
      id: 'created_by',
      cell: ({ row }) => (
        <TableCell
          getValue={() => row.original.created_by}
          columnId="created_by"
          onUpdate={updateHandler}
          isEditing={isEditing}
        />
      ),
      header: () => 'Created By',
      enableSorting: false,
      meta: { customCss: { width: '12%' }, type: 'text' },
    }),
    columnHelper.accessor('update_timestamp', {
      id: 'update_timestamp',
      cell: (info) => (
        <input value={info.getValue().substring(0, 10)} className="form-control readonlyInput" readOnly />
      ),
      header: () => 'Last Updated Date',
      enableSorting: false,
      meta: { customCss: { width: '12%' }, type: 'text' },
    }),
    columnHelper.accessor('update_userid', {
      id: 'update_userid',
      cell: (info) => <input value={info.getValue()} className="form-control readonlyInput" readOnly />,
      header: () => 'Last Updated By',
      enableSorting: false,
      meta: { customCss: { width: '12%' }, type: 'text' },
    }),
    columnHelper.display({
      id: 'edit_and_save',
      cell: () =>
        isEditing ? (
          <Button variant="success" onClick={handleSaveButton} style={{ width: '100%' }} disabled={isLoading}>
            Save
          </Button>
        ) : (
          <Button variant="primary" onClick={handleEditButton} style={{ width: '100%' }} disabled={isLoading}>
            Edit
          </Button>
        ),
      header: () => '',
      enableSorting: false,
      meta: { customCss: { width: '8%' } },
    }),
    columnHelper.display({
      id: 'cancel',
      cell: () =>
        isEditing && (
          <Button variant="secondary" onClick={handleCancelButton} style={{ width: '100%' }} disabled={isLoading}>
            Cancel
          </Button>
        ),
      header: () => '',
      enableSorting: false,
      meta: { customCss: { width: '8%' } },
    }),
  ];

  return <DataTable columns={columns} data={[currentDocType]} />;
};

export default React.memo(EditDocTypeTable);

interface TableCellProps<T> {
  getValue: () => any;
  columnId: string;
  onUpdate: (newValue: any) => void;
  isEditing: boolean;
}

const TableCell: FC<TableCellProps<DocType>> = ({ getValue, columnId, onUpdate, isEditing }) => {
  let initialValue = getValue() ? getValue() : '';
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    onUpdate({ [columnId]: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return isEditing ? (
    <input
      type="text"
      className="form-control"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      style={{ width: '100%' }}
    />
  ) : (
    <input
      type="text"
      className="form-control readonlyInput"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      style={{ width: '100%' }}
      readOnly
    />
  );
};

const DateTableCell: FC<TableCellProps<DocType>> = ({ getValue, columnId, onUpdate, isEditing }) => {
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

  return isEditing ? (
    <DatePicker selected={value} onChange={handleDateChange} dateFormat="yyyy-MM-dd" className="form-control" />
  ) : (
    <DatePicker
      selected={value}
      onChange={handleDateChange}
      dateFormat="yyyy-MM-dd"
      className="form-control readonlyInput"
      readOnly
    />
  );
};
