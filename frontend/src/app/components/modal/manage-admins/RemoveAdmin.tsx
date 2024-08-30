import { FC, useState } from 'react';
import { AdminData } from '../../table/manage-admins/AdminDataTable';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, Row, Spinner } from 'react-bootstrap';
import { removeAdmin } from '../../../common/manage-admins';

type RemoveAdminProps = {
  admin: AdminData;
  show: boolean;
  onHide: () => void;
  refreshTable: () => void;
};

const RemoveAdmin: FC<RemoveAdminProps> = ({ admin, show, onHide, refreshTable }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const removeHandler = async () => {
    setLoading(true);
    try {
      const response = await removeAdmin(admin.idirUsername);
      if (!response.error) {
        refreshTable();
        onHide();
      } else {
        setError(response.error);
        setShowError(true);
      }
    } catch (error) {
      console.error('Removal error:', error);
      setError('An error occurred during removal.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Remove Administrator</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to remove this administrator?</p>
        <Form>
          <Form.Group as={Row} controlId="removeName" className="mb-3">
            <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>
              Name:
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" readOnly defaultValue={admin?.name} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="removeUsername" className="mb-3">
            <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>
              Username:
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" readOnly defaultValue={admin?.username} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="removeEmail" className="mb-3">
            <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>
              Email:
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" readOnly defaultValue={admin?.email} />
            </Col>
          </Form.Group>
        </Form>
        {showError && <div className={`alert alert-danger text-center`}>{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'No'}
        </Button>

        <Button variant="primary" onClick={() => removeHandler()} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Yes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveAdmin;
