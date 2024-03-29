import { FC, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { uploadTemplate } from '../../../common/manage-templates';
import { Button } from 'react-bootstrap';

type UploadTemplateModalProps = {
  show: boolean;
  documentTypeName: string;
  documentTypeId: number;
  onHide: () => void;
  onUpload: () => void;
};

const UploadTemplateModal: FC<UploadTemplateModalProps> = ({
  show,
  documentTypeName,
  documentTypeId,
  onHide,
  onUpload,
}) => {
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [templateName, setTemplateName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.name) {
      setTemplateName(file.name.replace('.docx', ''));
      setSelectedFile(file);
    }
  };

  const uploadButtonHandler = async () => {
    try {
      setIsLoading(true);
      setShowError(false);
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
        formData.append('template_name', templateName);
        formData.append('document_type_id', documentTypeId.toString());
        await uploadTemplate(formData);
        setSelectedFile(null);
        setTemplateName('');
        setIsLoading(false);
        onUpload();
        onHide();
      } else {
        throw new Error('No File Error');
      }
    } catch (error) {
      setError('Error uploading file');
      setShowError(true);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
        <Modal.Title>Upload Template: {documentTypeName}</Modal.Title>
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
        <div style={{ margin: '10px' }}>
          <input type="file" accept=".docx" onChange={handleFileChange} />
        </div>
        <div style={{ margin: '10px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Template Name:</label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template Name"
            style={{ width: '500px' }}
            disabled={!selectedFile}
          />
        </div>
        {showError && <div className="alert alert-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={uploadButtonHandler} disabled={!selectedFile || isLoading}>
          Save
        </Button>
        <Button variant="secondary" onClick={onHide} disabled={!selectedFile || isLoading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default UploadTemplateModal;
