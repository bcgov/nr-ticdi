import { FC, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { removeTemplate } from '../../../../common/manage-templates';

type RemoveTemplateModalProps = {
  templateId: number;
  documentTypeId: number;
  documentTypeName: string;
  show: boolean;
  onHide: () => void;
  onRemove: () => void;
};

const RemoveTemplateModal: FC<RemoveTemplateModalProps> = ({
  templateId,
  documentTypeId,
  documentTypeName,
  show,
  onHide,
  onRemove,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const removeHandler = async () => {
    try {
      setLoading(true);
      setShowError(false);
      await removeTemplate(templateId, documentTypeId);
      onRemove();
      onHide();
    } catch (error) {
      console.error('Error removing template:');
      console.log(error);
      setError('An error occurred during removal.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
        <Modal.Title>Remove Template: {documentTypeName}</Modal.Title>
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
        <p>Are you sure you would like to remove this template?</p>
        {showError && <div className={`alert alert-danger text-center`}>{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={removeHandler} disabled={loading}>
          Yes
        </Button>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveTemplateModal;
