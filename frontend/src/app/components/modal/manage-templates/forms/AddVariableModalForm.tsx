import { useState } from 'react';
import { Button, Col, Form, Modal, Spinner } from 'react-bootstrap';

interface AddVariableModalFormProps {
  loading: boolean;
  onBack: () => void;
  onSave: (variable_name: string, variable_value: string, help_text: string) => void;
}

const AddVariableModalForm: React.FC<AddVariableModalFormProps> = ({ loading, onBack, onSave }) => {
  const [variableName, setVariableName] = useState<string>('');
  const [variableValue, setVariableValue] = useState<string>('');
  const [helpText, setHelpText] = useState<string>('');

  const handleSaveButton = () => {
    onSave(variableName, variableValue, helpText);
  };

  const handleVariableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariableName(e.target.value);
  };

  const handleVariableValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariableValue(e.target.value);
  };

  const handleHelpTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHelpText(e.target.value);
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Edit Provision</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label column sm="10">
              Variable Name
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" onChange={handleVariableNameChange} />
            </Col>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label column sm="10">
              Variable Value
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" onChange={handleVariableValueChange} />
            </Col>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label column sm="10">
              Help Text
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" onChange={handleHelpTextChange} />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onBack}>
          Cancel
        </Button>

        <Button variant="primary" onClick={handleSaveButton} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default AddVariableModalForm;
