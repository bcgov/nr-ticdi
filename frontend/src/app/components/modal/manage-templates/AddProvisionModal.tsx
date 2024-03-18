import { useEffect, useState } from 'react';
import { DocType, GroupMax, ProvisionUpload } from '../../../types/types';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';

interface AddProvisionModalProps {
  groupMaxArray: GroupMax[] | undefined;
  show: boolean;
  documentTypes: DocType[] | undefined;
  addProvisionHandler: (provision: ProvisionUpload) => void;
  onHide: () => void;
  refreshTables: () => void;
}

// TODO - variants to be removed, possibly add ability to assign to multiple document types

const AddProvisionModal: React.FC<AddProvisionModalProps> = ({
  groupMaxArray,
  show,
  documentTypes,
  addProvisionHandler,
  onHide,
  refreshTables,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<string>('M');
  const [group, setGroup] = useState<number>(1);
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [max, setMax] = useState<number | null>(null);
  const [maxInputValue, setMaxInputValue] = useState<string>('');
  const [isMaxUnlimited, setIsMaxUnlimited] = useState<boolean>(false);
  const [provisionName, setProvisionName] = useState<string>('');
  const [freeText, setFreeText] = useState<string>('');
  const [helpText, setHelpText] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [documentTypeIds, setDocumentTypeIds] = useState<number[]>([]);

  useEffect(() => {
    setIsMaxUnlimited(max ? max >= 999 : false);
  }, [max]);

  useEffect(() => {
    if (isMaxUnlimited) {
      setMaxInputValue('');
    } else {
      setMaxInputValue(max !== null && max !== 999 ? max.toString() : '');
    }
  }, [max, isMaxUnlimited]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGroup = parseInt(e.target.value);
    setGroup(newGroup);
    const newGroupMax: GroupMax | undefined = groupMaxArray?.find((gm) => gm.provision_group === newGroup);
    if (newGroupMax) {
      setMax(newGroupMax.max);
      if (newGroupMax.max >= 999) {
        setIsMaxUnlimited(true);
      }
      setGroupDescription(newGroupMax.provision_group_text);
    } else {
      setMax(null);
      setGroupDescription('');
    }
  };

  const handleGroupDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupDescription(e.target.value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxInputValue(value);
    const newMax = parseInt(value);
    if (!isNaN(newMax)) {
      setMax(newMax);
    } else {
      setMax(null);
    }
  };

  const handleMaxToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsMaxUnlimited(e.target.checked);
    if (e.target.checked) {
      setMax(999);
    } else {
      setMax(null);
    }
  };

  const handleProvisionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProvisionName(e.target.value);
  };

  const handleFreeTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFreeText(e.target.value);
  };

  const handleHelpTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHelpText(e.target.value);
  };

  const handleCategoryTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const handleDocumentTypeIdUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const documentTypeId: number = parseInt(e.target.value);
    if (e.target.checked) {
      setDocumentTypeIds((prevDocTypeIds) => [...prevDocTypeIds, documentTypeId]);
    } else {
      setDocumentTypeIds(documentTypeIds.filter((v) => v === documentTypeId));
    }
  };

  const handleSaveButton = () => {
    try {
      setLoading(true);
      if (max) {
        const trueMax = isMaxUnlimited ? 999 : max;
        const provisionUpload: ProvisionUpload = {
          type: type,
          provision_group: group,
          provision_group_text: groupDescription,
          max: trueMax,
          provision_name: provisionName,
          free_text: freeText,
          help_text: helpText,
          category: category,
          document_type_ids: documentTypeIds,
        };
        addProvisionHandler(provisionUpload);
        onHide();
        refreshTables();
      }
    } catch (err) {
      console.log('Error adding provision');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
        <Modal.Title>Add Provision</Modal.Title>
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
        <Form>
          <Form.Group controlId="searchEmail" className="mb-3">
            <Form.Label column sm={2}>
              Type:
            </Form.Label>
            <Col sm={12}>
              <Form.Select value="O" className="form-control" onChange={handleTypeChange}>
                <option value="O">O</option>
                <option value="V">V</option>
                <option value="B">B</option>
                <option value="M">M</option>
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Group
            </Form.Label>
            <Col sm="12">
              <Form.Control type="number" name="provision_group" onChange={handleGroupChange} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Group Description
            </Form.Label>
            <Col sm="12">
              <Form.Control
                type="text"
                name="provision_group_text"
                value={groupDescription}
                onChange={handleGroupDescriptionChange}
              />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Max
            </Form.Label>
            <Col sm="12">
              <Form.Control
                type="number"
                name="max"
                value={maxInputValue}
                onChange={handleMaxChange}
                disabled={isMaxUnlimited}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3 ml-2">
            <Col sm={{ span: 8 }}>
              <FormLabelWithPeriods text="No Maximum?" />
            </Col>
            <Col sm={{ span: 4 }}>
              <Form.Check name="max_unlimited" checked={isMaxUnlimited} onChange={handleMaxToggle} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Provision
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" name="provision" onChange={handleProvisionNameChange} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Free Text
            </Form.Label>
            <Col sm="10">
              <Form.Control as="textarea" rows={3} name="free_text" onChange={handleFreeTextChange} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Help Text
            </Form.Label>
            <Col sm="12">
              <Form.Control type="text" name="help_text" onChange={handleHelpTextChange} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Category
            </Form.Label>
            <Col sm="12">
              <Form.Control type="text" name="category" onChange={handleCategoryTextChange} />
            </Col>
          </Form.Group>
        </Form>
        <Col sm="12">
          <Form.Label style={{ marginTop: '10px' }}>Document Types</Form.Label>
        </Col>
        {documentTypes &&
          documentTypes.map((docType, index) => {
            return (
              <Form.Group as={Row} className="mb-3 ml-2" key={index}>
                <Col sm={{ span: 8 }}>
                  <FormLabelWithPeriods text={docType.name} />
                </Col>
                <Col sm={{ span: 4 }}>
                  <Form.Check
                    name={`document-type-${docType.id}`}
                    value={docType.id}
                    onChange={handleDocumentTypeIdUpdate}
                  />
                </Col>
              </Form.Group>
            );
          })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>

        <Button variant="primary" onClick={handleSaveButton} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const FormLabelWithPeriods: React.FC<{ text: string }> = ({ text }) => {
  const totalLength = 100;
  const textLength = text.length;
  const numPeriods = totalLength - textLength;
  const periods = '.'.repeat(numPeriods > 0 ? numPeriods : 0);
  return (
    <Form.Label
      style={{
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
      }}
    >
      <span style={{ display: 'inline-block', maxWidth: '100%' }}>
        {text}
        {periods}
      </span>
    </Form.Label>
  );
};

export default AddProvisionModal;
