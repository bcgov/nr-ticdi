import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Spinner } from 'react-bootstrap';
import { Variable, VariableUpload } from '../../../../types/types';

interface EditVariableModalFormProps {
  variable: Variable | undefined;
  loading: boolean;
  onHide: () => void;
  onBack: () => void;
  onSave: (variableUpload: VariableUpload, id: number) => void;
}

const EditVariableModalForm: React.FC<EditVariableModalFormProps> = ({ variable, loading, onHide, onBack, onSave }) => {
  const [variableName, setVariableName] = useState<string>('');
  const [variableValue, setVariableValue] = useState<string>('');
  const [helpText, setHelpText] = useState<string>('');
  const [provisionId, setProvisionId] = useState<number>(-1);

  useEffect(() => {
    if (variable) {
      setVariableName(variable.variable_name);
      setVariableValue(variable.variable_value);
      setHelpText(variable.help_text);
      setProvisionId(variable.provision_id);
    }
  }, [variable]);

  const handleSaveButton = () => {
    if (variable) {
      const variableUpload: VariableUpload = {
        variable_name: variableName,
        variable_value: variableValue,
        help_text: helpText,
        provision_id: provisionId,
      };
      onSave(variableUpload, variable.id);
    }
  };

  const handleVariableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariableName(e.target.value);
  };

  const handleVariableValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVariableValue(e.target.value);
  };

  const handleHelpTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHelpText(e.target.value);
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>Edit Variable</Modal.Title>
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
            <Form.Label column sm="10">
              Variable Name
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" defaultValue={variable?.variable_name} onChange={handleVariableNameChange} />
            </Col>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label column sm="10">
              Variable Value
            </Form.Label>
            <Col sm="10">
              <Form.Control
                as="textarea"
                rows={3}
                defaultValue={variable?.variable_value}
                onChange={handleVariableValueChange}
              />
            </Col>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label column sm="10">
              Help Text
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" defaultValue={variable?.help_text} onChange={handleHelpTextChange} />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onBack}>
          Go back
        </Button>

        <Button variant="primary" onClick={handleSaveButton} disabled={loading || !variable}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default EditVariableModalForm;
