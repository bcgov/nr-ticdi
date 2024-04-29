import React from 'react';
import { Modal } from 'react-bootstrap';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface Props {
  pdfBlob: Blob | null;
  isOpen: boolean;
  toggleModal: () => void;
}

const PdfViewerModal: React.FC<Props> = ({ pdfBlob, isOpen, toggleModal }) => {
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } else {
      setPdfUrl(null);
    }
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    };
  }, [pdfBlob]);

  const handleClose = () => {
    toggleModal();
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  return (
    <Modal show={isOpen} onHide={toggleModal} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {pdfUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} />
          </Worker>
        ) : (
          <div>No PDF file selected.</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose} className="btn btn-secondary">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default PdfViewerModal;
