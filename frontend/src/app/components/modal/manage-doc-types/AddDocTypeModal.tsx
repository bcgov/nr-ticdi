import { FC, useState } from 'react';
import { Button, Col, Form, Modal, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { DocType } from '../../../types/types';
import UserService from '../../../service/user-service';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface AddDocTypeModalProps {
  allDocTypes: DocType[];
  show: boolean;
  onHide: () => void;
  onAdd: (name: string, prefix: string, created_by: string, created_date: string) => void;
}

const AddDocTypeModal: FC<AddDocTypeModalProps> = ({ allDocTypes, show, onHide, onAdd }) => {
  const username = UserService.getUsername();
  const [name, setName] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [createdBy, setCreatedBy] = useState<string>(username);
  const [createdDate, setCreatedDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [defaultDisabled, setDefaultDisabled] = useState<boolean>(true);

  const addDocTypeHandler = async () => {
    try {
      setLoading(true);
      setShowError(false);
      const isNameUnique = !allDocTypes.some((docType) => docType.name === name);
      if (isNameUnique) {
        onAdd(name, prefix, createdBy, createdDate);
        onHide();
      } else {
        setError('That document type name already exists');
        setShowError(true);
      }
    } catch (err) {
      setError('Error adding new Document Type');
      setShowError(true);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (defaultDisabled) setDefaultDisabled(false);
    setName(e.target.value);
  };

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (defaultDisabled) setDefaultDisabled(false);
    setPrefix(e.target.value);
  };

  const handleCreatedByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreatedBy(e.target.value);
  };

  const handleCreatedDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreatedDate(e.target.value);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Document Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="10">
              Document Type Name:
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" onChange={handleNameChange} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="10">
              File Prefix:
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="button-tooltip-2">
                    The file prefix is the value added to the beginning of the generated document's filename.
                  </Tooltip>
                }
              >
                <span className="ml-1" style={{ cursor: 'pointer' }}>
                  <i className="fas fa-info-circle"></i>
                </span>
              </OverlayTrigger>
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" onChange={handlePrefixChange} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="10">
              Created By:
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" onChange={handleCreatedByChange} value={createdBy} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="10">
              Created Date:
            </Form.Label>
            <Col sm="10">
              <Form.Control type="date" defaultValue={createdDate} onChange={handleCreatedDateChange} />
            </Col>
          </Form.Group>
        </Form>
        {showError && <div className="alert alert-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>

        <Button variant="primary" onClick={addDocTypeHandler} disabled={loading || !name || defaultDisabled}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Add'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDocTypeModal;
