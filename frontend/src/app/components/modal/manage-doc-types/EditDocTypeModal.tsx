import { FC, useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { DocType } from '../../../types/types';

interface EditDocTypeModalProps {
  documentType: DocType;
  allDocTypes: DocType[];
  show: boolean;
  onHide: () => void;
  onEdit: (id: number, name: string, created_by: string, created_date: string) => void;
}

const EditDocTypeModal: FC<EditDocTypeModalProps> = ({ documentType, allDocTypes, show, onHide, onEdit }) => {
  const [name, setName] = useState<string>('');
  const [createdBy, setCreatedBy] = useState<string>('');
  const [createdDate, setCreatedDate] = useState<string>('');
  const [defaultDisabled, setDefaultDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    setName(documentType.name);
    setCreatedBy(documentType.created_by);
    setCreatedDate(documentType.created_date?.substring(0, 10));
  }, [documentType]);

  const editDocTypeHandler = async () => {
    try {
      setLoading(true);
      setShowError(false);
      const sameDocTypes = allDocTypes.filter((docType) => {
        return docType.name === name;
      });
      const isNameUnique = sameDocTypes.length <= 1; // there should only be up to one docType (the current one) that has the same name
      const isNameNotEmpty = name.length !== 0;
      console.log('name: ' + name);
      console.log(sameDocTypes);
      console.log(isNameUnique);
      if (isNameUnique && isNameNotEmpty) {
        onEdit(documentType.id, name, createdBy, createdDate);
        onHide();
      } else {
        setError('That document type name already exists');
        setShowError(true);
      }
    } catch (err) {
      setError('Error updating Document Type');
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

  const handleCreatedByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (defaultDisabled) setDefaultDisabled(false);
    setCreatedBy(e.target.value);
  };

  const handleCreatedDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (defaultDisabled) setDefaultDisabled(false);
    setCreatedDate(e.target.value);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Document Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="10">
              Name:
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" defaultValue={documentType.name} onChange={handleNameChange} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="10">
              Created By:
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" defaultValue={documentType.created_by} onChange={handleCreatedByChange} />
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

        <Button variant="primary" onClick={editDocTypeHandler} disabled={loading || defaultDisabled}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Update'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditDocTypeModal;
