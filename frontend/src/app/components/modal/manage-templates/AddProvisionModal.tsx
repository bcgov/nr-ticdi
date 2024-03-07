import { useState } from 'react';
import { GroupMax, ProvisionUpload } from '../../../types/types';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';

interface AddProvisionModalProps {
  groupMaxArray: GroupMax[] | undefined;
  show: boolean;
  addProvisionHandler: (provision: ProvisionUpload) => void;
  onHide: () => void;
}

const AddProvisionModal: React.FC<AddProvisionModalProps> = ({ groupMaxArray, show, addProvisionHandler, onHide }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<string>('M');
  const [group, setGroup] = useState<number>(1);
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [max, setMax] = useState<number | null>();
  const [maxToggle, setMaxToggle] = useState<boolean>(false);
  const [provisionName, setProvisionName] = useState<string>('');
  const [freeText, setFreeText] = useState<string>('');
  const [helpText, setHelpText] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [variants, setVariants] = useState<number[]>([]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGroup = parseInt(e.target.value);
    setGroup(newGroup);
    const newGroupMax: GroupMax | undefined = groupMaxArray?.find((gm) => gm.provision_group === newGroup);
    if (newGroupMax) setMax(newGroupMax.max);
    else setMax(null);
  };

  const handleGroupDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupDescription(e.target.value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMax(parseInt(e.target.value));
  };

  const handleMaxToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxToggle(e.target.checked);
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

  const handleVariantIdUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const variantId: number = parseInt(e.target.value);
    if (e.target.checked) {
      setVariants((prevVariants) => [...prevVariants, variantId]);
    } else {
      setVariants(variants.filter((v) => v === variantId));
    }
  };

  const handleSaveButton = () => {
    if (max) {
      const trueMax = maxToggle ? 999 : max;
      const provisionUpload: ProvisionUpload = {
        type: type,
        provision_group: group,
        provision_group_text: groupDescription,
        max: trueMax,
        provision_name: provisionName,
        free_text: freeText,
        help_text: helpText,
        category: category,
        variants: variants,
      };
      console.log(provisionUpload);
      addProvisionHandler(provisionUpload);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Provision</Modal.Title>
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
              <Form.Control type="text" name="provision_group_text" onChange={handleGroupDescriptionChange} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Max
            </Form.Label>
            <Col sm="12">
              <Form.Control type="number" name="max" onChange={handleMaxChange} disabled={maxToggle} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3 ml-2">
            <Col sm={{ span: 8 }}>
              <FormLabelWithPeriods text="No Maximum?" />
            </Col>
            <Col sm={{ span: 4 }}>
              <Form.Check name="max_unlimited" onChange={handleMaxToggle} />
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
          <Form.Label style={{ marginTop: '10px' }}>Variants</Form.Label>
        </Col>
        <Form.Group as={Row} className="mb-3 ml-2">
          <Col sm={{ span: 8 }}>
            <FormLabelWithPeriods text="NOTICE OF FINAL REVIEW" />
          </Col>
          <Col sm={{ span: 4 }}>
            <Form.Check name="nfr-1" value="1" onChange={handleVariantIdUpdate} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 ml-2">
          <Col sm={{ span: 8 }}>
            <FormLabelWithPeriods text="NOTICE OF FINAL REVIEW (DELAYED)" />
          </Col>
          <Col sm={{ span: 4 }}>
            <Form.Check name="nfr-1" value="2" onChange={handleVariantIdUpdate} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 ml-2">
          <Col sm={{ span: 8 }}>
            <FormLabelWithPeriods text="NOTICE OF FINAL REVIEW (NO FEES)" />
          </Col>
          <Col sm={{ span: 4 }}>
            <Form.Check name="nfr-1" value="3" onChange={handleVariantIdUpdate} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 ml-2">
          <Col sm={{ span: 8 }}>
            <FormLabelWithPeriods text="NOTICE OF FINAL REVIEW (SURVEY REQUIRED)" />
          </Col>
          <Col sm={{ span: 4 }}>
            <Form.Check name="nfr-1" value="4" onChange={handleVariantIdUpdate} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 ml-2">
          <Col sm={{ span: 8 }}>
            <FormLabelWithPeriods text="NOTICE OF FINAL REVIEW (TO OBTAIN SURVEY)" />
          </Col>
          <Col sm={{ span: 4 }}>
            <Form.Check name="nfr-1" value="5" onChange={handleVariantIdUpdate} />
          </Col>
        </Form.Group>
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
