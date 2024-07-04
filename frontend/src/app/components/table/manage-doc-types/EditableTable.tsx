import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridCellEditStopParams } from '@mui/x-data-grid';

type ManageDocTypeProvision = {
  id: number;
  provision_id: number;
  type: string;
  provision_name: string;
  free_text: string;
  help_text: string;
  category: string;
  active_flag: boolean;
  sequence_value: number;
  associated: boolean;
  provision_group: number;
  max: number;
};

const createData = (
  id: number,
  provision_id: number,
  type: string,
  provision_name: string,
  free_text: string,
  help_text: string,
  category: string,
  active_flag: boolean,
  sequence_value: number,
  associated: boolean,
  provision_group: number,
  max: number
): ManageDocTypeProvision => {
  return {
    id,
    provision_id,
    type,
    provision_name,
    free_text,
    help_text,
    category,
    active_flag,
    sequence_value,
    associated,
    provision_group,
    max,
  };
};

const generateData = () => {
  const data = [];
  for (let i = 1; i <= 100; i++) {
    data.push(
      createData(
        i,
        i,
        `Type ${i}`,
        `Provision Name ${i}`,
        `Free Text ${i}`,
        `Help Text ${i}`,
        `Category ${i}`,
        i % 2 === 0,
        i,
        i % 3 === 0,
        i,
        i * 10
      )
    );
  }
  return data;
};

const EditableTable = () => {
  const [data, setData] = useState(generateData());

  useEffect(() => {
    setData(generateData());
  }, []);

  const handleCellEditStop = (params: GridCellEditStopParams) => {
    console.log('handleEditStop!');
    console.log(params);
    // params = data row, add this edited version to a state, on save, update the DocumentTypeProvisions in this state
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'provision_id',
      headerName: 'Provision ID',
      editable: true,
    },
    { field: 'type', headerName: 'Type', editable: true },
    {
      field: 'provision_name',
      headerName: 'Provision Name',
      editable: true,
    },
    { field: 'free_text', headerName: 'Free Text', editable: true },
    { field: 'help_text', headerName: 'Help Text', editable: true },
    { field: 'category', headerName: 'Category', editable: true },
    {
      field: 'active_flag',
      headerName: 'Active Flag',

      editable: true,
      type: 'boolean',
    },
    {
      field: 'sequence_value',
      headerName: 'Sequence Value',

      editable: true,
      type: 'number',
    },
    {
      field: 'associated',
      headerName: 'Associated',

      editable: true,
      type: 'boolean',
    },
    {
      field: 'provision_group',
      headerName: 'Provision Group',

      editable: true,
      type: 'number',
    },
    {
      field: 'max',
      headerName: 'Max',

      editable: true,
      type: 'number',
    },
  ];

  return (
    <div style={{ height: '632px', width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        onCellEditStop={handleCellEditStop}
      />
    </div>
  );
};

export default EditableTable;
