import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { previewTemplate } from '../../../../common/manage-templates';

interface PreviewTemplateModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  templateId: number;
}

const PreviewTemplateModal: React.FC<PreviewTemplateModalProps> = ({ isOpen, toggleModal, templateId }) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && templateId) {
      const getTemplate = async () => {
        const blob = await previewTemplate(templateId);
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          setPdfUrl(url);
        } else {
          console.error('Failed to load the PDF document');
          setPdfUrl('');
        }
      };

      getTemplate();

      return () => {
        if (pdfUrl) {
          window.URL.revokeObjectURL(pdfUrl);
          setPdfUrl('');
        }
      };
    }
  }, [templateId, isOpen]);

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    display: isOpen ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const modalContentStyle: React.CSSProperties = {
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  };

  const iframeContainerStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    textAlign: 'right', // Align button to the right
    padding: '20px',
  };

  return (
    <div style={modalOverlayStyle} onClick={toggleModal}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={iframeContainerStyle}>
          <h2>Preview Document</h2>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              title="Preview Document"
              style={{ border: 'none', width: '100%', height: '100%' }}
              allowFullScreen
            />
          )}
        </div>
        <div style={buttonContainerStyle}>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewTemplateModal;
