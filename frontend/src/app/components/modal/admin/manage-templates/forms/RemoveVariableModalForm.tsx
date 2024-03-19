import { Button, Modal, Spinner } from 'react-bootstrap';
import { Variable } from '../../../../../types/types';

interface RemoveVariableModalFormProps {
  variable: Variable | undefined;
  loading: boolean;
  onHide: () => void;
  onBack: () => void;
  onRemove: (variableId: number) => void;
}

const RemoveVariableModalForm: React.FC<RemoveVariableModalFormProps> = ({
  variable,
  loading,
  onHide,
  onBack,
  onRemove,
}) => {
  const handleRemoveButton = () => {
    if (variable) onRemove(variable.id);
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>Remove Variable</Modal.Title>
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
        <p>Are you sure you would like to remove this variable: {variable?.variable_name}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onBack}>
          Go back
        </Button>

        <Button variant="primary" onClick={handleRemoveButton} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Remove'}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RemoveVariableModalForm;
