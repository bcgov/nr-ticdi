import { FC, useState } from 'react';
import { Button, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { Provision } from '../../../../types/types';

interface RemoveProvisionModalProps {
  provision: Provision | undefined;
  show: boolean;
  onHide: () => void;
  onRemove: (id: number) => void;
}

const RemoveProvisionModal: FC<RemoveProvisionModalProps> = ({ provision, show, onHide, onRemove }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const removeProvisionHandler = async () => {
    try {
      if (provision) {
        setLoading(true);
        setShowError(false);
        onRemove(provision.id);
        onHide();
      }
    } catch (err) {
      setError('Error removing provision');
      setShowError(true);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Remove Document Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <p>Are you sure you want to remove this provision?</p>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="10">
              <b>{provision?.provision_name}</b>
            </Form.Label>
          </Form.Group>
        </Form>
        {showError && <div className="alert alert-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>

        <Button variant="primary" onClick={removeProvisionHandler} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Remove'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveProvisionModal;
