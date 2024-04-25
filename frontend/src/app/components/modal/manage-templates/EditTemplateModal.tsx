import { FC, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { editTemplate, uploadTemplate } from '../../../common/manage-templates';
import { Button } from 'react-bootstrap';

type EditTemplateModalProps = {
    show: boolean;
    documentName: string;
    documentId: number;
    documentVersion: number;
    documentTypeId: number
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

                <div style={{ margin: '10px' }}>
                    <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Doc No.</label>
                    <input
                        type="text"
                        value={documentVersionText}
                        onChange={handleChange}
                        placeholder="Document Number"
                        style={{ width: '500px' }}
                    />
                </div>
                <div style={{ margin: '10px' }}>
                    <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Template Name:</label>
                    <input
                        type="text"
                        value={documentNameText}
                        onChange={(e) => setDocumentNameText(e.target.value)}
                        placeholder="Template Name"
                        style={{ width: '500px' }}
                    />
                </div>
                {showError && <div className="alert alert-danger">{error}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={editButtonHandler} disabled={(documentName == documentNameText) && (documentVersion == documentVersionText)}>
                    Save
                </Button>
                <Button variant="secondary" onClick={onHide} >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default EditTemplateModal;
