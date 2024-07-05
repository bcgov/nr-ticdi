import { FC } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { ProvisionInfo } from '../../../common/manage-doc-types';
import { DataTable } from '../../table/common/DataTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Variable } from '../../../types/types';

interface GlobalProvisionModalProps {
  provision: ProvisionInfo | null;
  show: boolean;
  onHide: () => void;
}

const GlobalProvisionModal: FC<GlobalProvisionModalProps> = ({ provision, show, onHide }) => {
  const columnHelper = createColumnHelper<Variable>();

  const columns: ColumnDef<Variable, any>[] = [
    columnHelper.accessor('variable_name', {
      id: 'variable_name',
      cell: (info) => <input value={info.getValue()} className="form-control readonlyInput" readOnly />,
      header: () => 'Name',
      enableSorting: true,
      meta: { customCss: { width: '40%' } },
    }),
    columnHelper.accessor('variable_value', {
      id: 'variable_value',
      cell: (info) => (
        <input value={info.getValue()} className="form-control readonlyInput" title={info.getValue()} readOnly />
      ),
      header: () => 'Value',
      enableSorting: false,
      meta: { customCss: { width: '40%' } },
    }),
  ];
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Global Provision Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label style={{ fontWeight: 'bold' }}>Provision ID:</label>
        <input className="form-control readonlyInput" readOnly value={provision?.id} />
        <label style={{ marginTop: '15px', fontWeight: 'bold' }}>Provision Name:</label>
        <input className="form-control readonlyInput" readOnly value={provision?.provision_name} />
        <label style={{ marginTop: '15px', fontWeight: 'bold' }}>Category:</label>
        <input className="form-control readonlyInput" readOnly value={provision?.category} />
        <label style={{ marginTop: '15px', fontWeight: 'bold' }}>Free Text:</label>
        <textarea
          className="form-control readonlyInput"
          readOnly
          value={provision?.free_text}
          style={{ minHeight: '100px' }}
        />
        <label style={{ marginTop: '15px', fontWeight: 'bold' }}>Help Text:</label>
        <textarea
          className="form-control readonlyInput"
          readOnly
          value={provision?.help_text}
          style={{ minHeight: '100px' }}
        />
        <label style={{ marginTop: '15px', fontWeight: 'bold' }}>Variables:</label>
        <div style={{ height: 'auto', width: '100%' }}>
          <DataTable
            columns={columns}
            data={provision?.provision_variables || []}
            enableSorting={true}
            initialSorting={[{ id: 'variable_name', desc: false }]}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GlobalProvisionModal;
