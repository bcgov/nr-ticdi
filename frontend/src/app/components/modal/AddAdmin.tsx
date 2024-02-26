import { FC, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, Row, Spinner } from 'react-bootstrap';
import { findIdirUser } from '../../common/admin';

type AddAdminProps = {
  show: boolean;
  onHide: () => void;
};

export type IdirUserObject = {
  firstName: string;
  lastName: string;
  username: string;
  idirUsername: string;
};

const AddAdmin: FC<AddAdminProps> = ({ show, onHide }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [userObject, setUserObject] = useState<IdirUserObject | null>(null);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const { foundUserObject, error } = await findIdirUser(email);
      if (error) {
        setError(error);
        setShowError(true);
      } else {
        setUserObject(foundUserObject);
      }
    } catch (error) {
      console.error('Removal error:', error);
      setError('An error occurred during removal.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async () => {
    setLoading(true);
    const addParams = {
      idirUsername: userObject?.idirUsername,
    };
    try {
      const response = await fetch(`/admin/add-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addParams),
      });
      const resJson = await response.json();
      if (!resJson.error) {
        onHide();
      } else {
        setError(resJson.error);
      }
    } catch (err) {
      console.log(err);
      setError('An error occurred while adding an administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Administrator</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} controlId="searchEmail" className="mb-3">
            <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>
              Email:
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }}>
              <Button variant="success" onClick={searchUsers} disabled={loading}>
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  'Search'
                )}
              </Button>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="searchFirstName" className="mb-3">
            <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>
              First Name:
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" readOnly value={userObject?.firstName || ''} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="searchLastName" className="mb-3">
            <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>
              Last Name:
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" readOnly value={userObject?.lastName || ''} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="searchUsername" className="mb-3">
            <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>
              Username:
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" readOnly value={userObject?.username || ''} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="searchRole" className="mb-3">
            <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>
              Role:
            </Form.Label>
            <Col sm={10}>
              <Form.Control as="select" readOnly disabled defaultValue="TICDIADMIN">
                <option>TICDIADMIN</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-0">
            <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>
              Status:
            </Form.Label>
            <Col sm={10}>
              <Form.Check
                type="radio"
                label="Active"
                name="adminStatus"
                id="searchStatusActive"
                defaultChecked
                disabled
              />
              <Form.Check type="radio" label="Inactive" name="adminStatus" id="searchStatusInactive" disabled />
            </Col>
          </Form.Group>
        </Form>
        {showError && <div className="alert alert-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>

        <Button variant="primary" onClick={addAdmin} disabled={loading || !userObject}>
          {loading ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            'Add Administrator'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default AddAdmin;
