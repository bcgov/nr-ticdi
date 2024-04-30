import { FC, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { editTemplate, uploadTemplate } from '../../../common/manage-templates';
import { Button, Col, Row } from 'react-bootstrap';

type EditTemplateModalProps = {
  show: boolean;
  documentName: string;
  documentId: number;
  documentVersion: number;
  documentTypeId: number;
  onHide: () => void;
  onUpload: () => void;
};

const EditTemplateModal: FC<EditTemplateModalProps> = ({
  show,
  documentName,
  documentId,
  documentVersion,
  documentTypeId,
  onHide,
  onUpload,
}) => {
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [documentNameText, setDocumentNameText] = useState<string>(documentName);
  const [documentVersionText, setDocumentVersionText] = useState<string | number>(documentVersion);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const editButtonHandler = async () => {
    if (!documentNameText || !documentVersionText) {
      setError('Fields cannot be empty');
      setShowError(true);
      return;
    }
    try {
      setIsLoading(true);
      setShowError(false);
      await editTemplate(documentId, documentTypeId, +documentVersionText, documentNameText);
    } catch (error) {
      setError('Error updating templete');
      setShowError(true);
      console.log(error);
    } finally {
      setIsLoading(false);
      onUpload();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setDocumentVersionText('');
    } else {
      setDocumentVersionText(+value);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
        <Modal.Title>Edit Template</Modal.Title>
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
        <Row style={{ marginTop: '10px' }}>
          <Col sm={3}>
            <label style={{ fontWeight: 'bold' }}>Doc No.</label>
          </Col>
          <Col sm={9}>
            <input
              type="text"
              className="form-control"
              value={documentVersionText}
              onChange={handleChange}
              placeholder="Document Number"
              style={{ width: '500px' }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col sm={3}>
            <label style={{ fontWeight: 'bold' }}>Template Name:</label>
          </Col>
          <Col sm={9}>
            <input
              type="text"
              className="form-control"
              value={documentNameText}
              onChange={(e) => setDocumentNameText(e.target.value)}
              placeholder="Template Name"
              style={{ width: '500px' }}
            />
          </Col>
        </Row>
        {showError && <div className="alert alert-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={editButtonHandler}
          disabled={documentName == documentNameText && documentVersion == documentVersionText}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default EditTemplateModal;
