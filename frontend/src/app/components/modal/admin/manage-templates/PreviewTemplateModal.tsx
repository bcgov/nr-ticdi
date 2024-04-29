import React from 'react';
import Button from 'react-bootstrap/Button';

interface PreviewTemplateModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  pdfBlob: Blob | null;
}

const PreviewTemplateModal: React.FC<PreviewTemplateModalProps> = ({ isOpen, toggleModal, pdfBlob }) => {
  const iframeSrc = pdfBlob ? window.URL.createObjectURL(pdfBlob) : '';

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
          {iframeSrc && (
            <iframe
              src={iframeSrc}
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
