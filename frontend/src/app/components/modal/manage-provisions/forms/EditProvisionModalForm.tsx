import { useEffect, useState } from 'react';
import { Provision, ProvisionUpload, Variable } from '../../../../types/types';
import { Button, Col, Form, Modal, Spinner } from 'react-bootstrap';
import ManageVariablesTable from '../../../table/manage-provisions/ManageVariablesTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface EditProvisionModalFormProps {
  provision: Provision | undefined;
  variables: Variable[] | undefined;
  loading: boolean;
  updateProvisionHandler: (provision: ProvisionUpload, provisionId: number) => void;
  onHide: () => void;
  onDisplayAdd: () => void;
  onDisplayEdit: (variableId: number) => void;
  onDisplayRemove: (variableId: number) => void;
}

const EditProvisionModalForm: React.FC<EditProvisionModalFormProps> = ({
  provision,
  variables,
  loading,
  updateProvisionHandler,
  onHide,
  onDisplayAdd,
  onDisplayEdit,
  onDisplayRemove,
}) => {
  const [provisionName, setProvisionName] = useState<string>('');
  const [freeText, setFreeText] = useState<string>('');
  const [listItems, setListItems] = useState<string[]>(['']);
  const [helpText, setHelpText] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    const getData = async () => {
      if (provision) {
        setProvisionName(provision.provision_name);
        setFreeText(provision.free_text);
        setListItems(provision.list_items);
        setHelpText(provision.help_text);
        setCategory(provision.category);
      }
    };

    getData();
  }, [provision]);

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

  const handleSaveButton = () => {
    if (provision) {
      const provisionUpload: ProvisionUpload = {
        provision_name: provisionName,
        free_text: freeText,
        list_items: listItems,
        help_text: helpText,
        category: category,
      };
      updateProvisionHandler(provisionUpload, provision.id);
    }
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>Edit Provision</Modal.Title>
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
              <Form.Control
                type="text"
                defaultValue={provisionName}
                name="provision"
                onChange={handleProvisionNameChange}
              />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Free Text
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="textarea"
                defaultValue={freeText}
                rows={3}
                name="free_text"
                onChange={handleFreeTextChange}
              />
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
              <Form.Control type="text" defaultValue={helpText} name="help_text" onChange={handleHelpTextChange} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Category
            </Form.Label>
            <Col sm="12">
              <Form.Control type="text" defaultValue={category} name="category" onChange={handleCategoryTextChange} />
            </Col>
          </Form.Group>
        </Form>

        <Col sm="12">
          <Form.Label style={{ marginTop: '10px' }}>Variables</Form.Label>
        </Col>
        <Col sm="12">
          <ManageVariablesTable
            variables={variables ? variables : []}
            onDisplayEdit={onDisplayEdit}
            onDisplayRemove={onDisplayRemove}
          />
        </Col>
        <Col sm="12">
          <Button onClick={onDisplayAdd} variant="success">
            Add a Variable
          </Button>
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>

        <Button variant="primary" onClick={handleSaveButton} disabled={loading || !provision}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default EditProvisionModalForm;
