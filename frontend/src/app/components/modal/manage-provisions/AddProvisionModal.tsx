import { useState } from 'react';
import { ProvisionUpload } from '../../../types/types';
import { Button, Col, Form, Modal, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface AddProvisionModalProps {
  show: boolean;
  addProvisionHandler: (provision: ProvisionUpload) => Promise<void>;
  onHide: () => void;
}

const AddProvisionModal: React.FC<AddProvisionModalProps> = ({ show, addProvisionHandler, onHide }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [provisionName, setProvisionName] = useState<string>('');
  const [freeText, setFreeText] = useState<string>('');
  const [listItems, setListItems] = useState<string[]>([]);
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

  const handleListItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newListItems = [...listItems];
    newListItems[index] = e.target.value;
    setListItems(newListItems);
  };

  const handleAddListItem = () => {
    setListItems([...listItems, '']);
  };

  const handleRemoveListItem = (index: number) => {
    const newListItems = [...listItems];
    newListItems.splice(index, 1);
    setListItems(newListItems);
  };

  const handleSaveButton = async () => {
    try {
      setLoading(true);

      const provisionUpload: ProvisionUpload = {
        provision_name: provisionName,
        free_text: freeText,
        list_items: listItems ? listItems : [],
        help_text: helpText,
        category: category,
      };

      await addProvisionHandler(provisionUpload);
      handleOnHide();
    } catch (err) {
      console.log('Error adding provision');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnHide = () => {
    onHide();
    setListItems(['']);
  };

  return (
    <Modal show={show} onHide={handleOnHide} size="lg">
      <Modal.Header>
        <Modal.Title>Add Provision</Modal.Title>
        <Button
          variant="none"
          onClick={handleOnHide}
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
              List Items
            </Form.Label>
            {listItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Col sm="10">
                  <Form.Control
                    as="input"
                    type="text"
                    name={`list_item_${index}`}
                    value={item}
                    onChange={(e) => handleListItemChange(e, index)}
                  />
                </Col>
                <Col sm="2">
                  <Button variant="link" onClick={() => handleRemoveListItem(index)}>
                    <FontAwesomeIcon icon={faMinus} />
                  </Button>
                </Col>
              </div>
            ))}
            <div style={{ marginLeft: '15px' }}>
              <Button variant="success" onClick={handleAddListItem}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
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
        <Button variant="secondary" onClick={handleOnHide}>
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
