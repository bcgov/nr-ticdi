import { FC, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { uploadTemplate } from '../../common/manage-templates';
import Button from '../common/Button';

type UploadTemplateModalProps = {
  show: boolean;
  onHide: () => void;
  reportType: string;
  onUpload: () => void;
};

const UploadTemplateModal: FC<UploadTemplateModalProps> = ({ show, onHide, reportType, onUpload }) => {
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
        formData.append('document_type', reportType.toUpperCase());
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
      <Modal.Header closeButton>
        <Modal.Title>Upload Template: {reportType}</Modal.Title>
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
        <Button type="btn-primary" text="Save" onClick={uploadButtonHandler} disabled={!selectedFile || isLoading} />
        <Button type="btn-secondary" text="Cancel" onClick={onHide} disabled={!selectedFile || isLoading} />
      </Modal.Footer>
    </Modal>
  );
};
export default UploadTemplateModal;
