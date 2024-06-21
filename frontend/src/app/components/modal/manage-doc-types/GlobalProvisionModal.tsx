import { FC } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Provision } from '../../../types/types';

interface GlobalProvisionModalProps {
  provision: Provision | null;
  show: boolean;
  onHide: () => void;
}

const GlobalProvisionModal: FC<GlobalProvisionModalProps> = ({ provision, show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Global Provision Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>Provision ID:</label>
        <input className="form-control readonlyInput" readOnly value={provision?.id} />
        <label style={{ marginTop: '5px' }}>Provision Name:</label>
        <input className="form-control readonlyInput" readOnly value={provision?.provision_name} />
        <label style={{ marginTop: '5px' }}>Category:</label>
        <input className="form-control readonlyInput" readOnly value={provision?.category} />
        <label style={{ marginTop: '5px' }}>Free Text:</label>
        <textarea
          className="form-control readonlyInput"
          readOnly
          value={provision?.free_text}
          style={{ minHeight: '100px' }}
        />
        <label style={{ marginTop: '5px' }}>Help Text:</label>
        <textarea
          className="form-control readonlyInput"
          readOnly
          value={provision?.help_text}
          style={{ minHeight: '100px' }}
        />
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
