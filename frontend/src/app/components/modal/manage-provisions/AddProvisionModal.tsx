import { useState } from 'react';
import { ProvisionUpload } from '../../../types/types';
import { Button, Col, Form, Modal, Spinner } from 'react-bootstrap';

interface AddProvisionModalProps {
  show: boolean;
  addProvisionHandler: (provision: ProvisionUpload) => void;
  onHide: () => void;
  refreshTables: () => void;
}

const AddProvisionModal: React.FC<AddProvisionModalProps> = ({ show, addProvisionHandler, onHide, refreshTables }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [provisionName, setProvisionName] = useState<string>('');
  const [freeText, setFreeText] = useState<string>('');
  const [helpText, setHelpText] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const handleProvisionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProvisionName(e.target.value);
  };

  const handleFreeTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFreeText(e.target.value);
  };

  const handleHelpTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHelpText(e.target.value);
  };

  const handleCategoryTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const handleSaveButton = () => {
    try {
      setLoading(true);

      const provisionUpload: ProvisionUpload = {
        provision_name: provisionName,
        free_text: freeText,
        help_text: helpText,
        category: category,
      };
      addProvisionHandler(provisionUpload);
      onHide();
      refreshTables();
    } catch (err) {
      console.log('Error adding provision');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
        <Modal.Title>Add Provision</Modal.Title>
        <Button
          variant="none"
          onClick={onHide}
          style={{
            marginLeft: 'auto',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'black',
          }}
        >
          &times;
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Provision
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" name="provision" onChange={handleProvisionNameChange} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Free Text
            </Form.Label>
            <Col sm="10">
              <Form.Control as="textarea" rows={3} name="free_text" onChange={handleFreeTextChange} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Help Text
            </Form.Label>
            <Col sm="12">
              <Form.Control type="text" name="help_text" onChange={handleHelpTextChange} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Category
            </Form.Label>
            <Col sm="12">
              <Form.Control type="text" name="category" onChange={handleCategoryTextChange} />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>

        <Button variant="primary" onClick={handleSaveButton} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProvisionModal;
