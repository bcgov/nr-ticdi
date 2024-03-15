import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import './DocumentPreview.scss';

interface DocumentPreviewFormProps {
  tenureFileNumber: string;
  dtid: string;
  primaryContactName: string;
  //handleRetrieve: () => void;
  onValidatedRetrieve: () => void;
  setTenureFileNumber: (value: string) => void;
  setDtid: (value: string) => void;
  handleClear: () => void;
}

const DocumentPreviewForm: React.FC<DocumentPreviewFormProps> = ({
  tenureFileNumber,
  dtid,
  primaryContactName,
  //handleRetrieve,
  onValidatedRetrieve,
  setTenureFileNumber,
  setDtid,
  handleClear,
}) => {


  const [errors, setErrors] = useState<{ [key: string]: string }>({
    tenureFileNumber: '',
    dtid: '',
  });
  const isNumeric = (value: string) => /^-?\d+(\.\d+)?$/.test(value);

  const validateFields = (): boolean => {
    let newErrors = { tenureFileNumber: '', dtid: '' };

    if (!tenureFileNumber) {
      newErrors.tenureFileNumber = 'Tenure File Number is required.';
    } else if (!isNumeric(tenureFileNumber)) {
      newErrors.tenureFileNumber = 'Tenure File Number must be a number.';
    }

    if (!dtid) {
      newErrors.dtid = 'DTID is required.';
    } else if (!isNumeric(dtid)) {
      newErrors.dtid = 'DTID must be a number.';
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleRetrieveClick = () => {
    const isValid = validateFields();
    if (isValid) {
      onValidatedRetrieve();
    }
  };

  return (
    <div className="document-preview">
      <h1 className="document-preview__title">Document Preview</h1>
      <hr className="document-preview__divider" />

      <Row className="document-preview__form mb-3">
        <Col sm={4}>
          <label htmlFor="tenureFileNumber" className="form-label">Tenure File Number:</label>
        </Col>
        <Col sm={4}>
          <input
            id="tenureFileNumber"
            type="text"
            className="form-control"
            value={tenureFileNumber}
            onChange={(e) => setTenureFileNumber(e.target.value)}
          />
          {errors.tenureFileNumber && <div style={{ color: 'red', marginTop: '0.25rem' }}>{errors.tenureFileNumber}</div>}
        </Col>
        <Col sm={4} className="button-group">
          <button type="button" className="button button--retrieve" onClick={handleRetrieveClick}>Retrieve</button>
          <button type="button" className="button button--clear" onClick={handleClear}>Clear</button>
        </Col>
      </Row>

      <Row className="document-preview__form mb-3">
        <Col sm={4}>
          <label htmlFor="dtid" className="form-label">DTID:</label>
        </Col>
        <Col sm={4}>
          <input
            id="dtid"
            type="text"
            className="form-control"
            value={dtid}
            onChange={(e) => setDtid(e.target.value)}
          />
          {errors.dtid && <div style={{ color: 'red', marginTop: '0.25rem' }}>{errors.dtid}</div>}
        </Col>
      </Row>

      <Row className="document-preview__form" style={{ marginBottom: '20px' }}>
        <Col sm={4}>
          <label htmlFor="primaryContactName" className="form-label">Primary Contact Name:</label>
        </Col>
        <Col sm={4}>
          <div>{primaryContactName}</div>
        </Col>
      </Row>
    </div>


  );
};

export default DocumentPreviewForm;
