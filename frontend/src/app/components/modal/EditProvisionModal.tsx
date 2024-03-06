import { FC, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Col, Row, Spinner } from 'react-bootstrap';
import { GroupMax, Provision, ProvisionUpload, Variable } from '../../types/types';
import { getGroupMax } from '../../common/manage-templates';

type EditProvisionModalProps = {
  provision: Provision | undefined;
  variables: Variable[] | undefined;
  show: boolean;
  onHide: () => void;
  updateProvisionHandler: (provision: ProvisionUpload, provisionId: number) => void;
};

// WIP

const EditProvisionModal: FC<EditProvisionModalProps> = ({ provision, variables, show, onHide }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [groupMaxArray, setGroupMaxArray] = useState<GroupMax[]>();
  const [type, setType] = useState<string>('M');
  const [group, setGroup] = useState<number>(1);
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [max, setMax] = useState<number>(3);
  const [maxToggle, setMaxToggle] = useState<boolean>(false);
  const [provisionName, setProvisionName] = useState<string>('');
  const [freeText, setFreeText] = useState<string>('');
  const [helpText, setHelpText] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    const getData = async () => {
      setGroupMaxArray(await getGroupMax());
      if (provision) {
        setType(provision.type);
        setGroup(provision.provision_group);
        if (groupMaxArray) {
          const groupMax = groupMaxArray.find((group) => group.provision_group === provision.provision_group);
          setGroupDescription(groupMax ? groupMax.provision_group_text : '');
        }
        setMax(provision.max);
        setProvisionName(provision.provision_name);
        setFreeText(provision.free_text);
        setHelpText(provision.help_text);
        setCategory(provision.category);
      }
    };
    getData();
  }, [provision]);
  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroup(parseInt(e.target.value));
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

  //   const saveButtonHandler = () => {
  //     const updatedProvision: Provision = {
  //       ...provision,
  //       type: type,
  //       provision_group: group,
  //     };
  //     updateProvisionHandler(updatedProvision);
  //   };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Provision</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} controlId="searchEmail" className="mb-3">
            <Form.Label column sm={2}>
              Type:
            </Form.Label>
            <Col sm={10}>
              <Form.Select value={provision?.type} style={{ width: '50px' }}>
                <option value="O">O</option>
                <option value="V">V</option>
                <option value="B">B</option>
                <option value="M">M</option>
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Group
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="number"
                defaultValue={provision?.provision_group}
                name="provision_group"
                onChange={handleGroupChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Group Description
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" defaultValue="Group Description" name="provision_group_text" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Max
            </Form.Label>
            <Col sm="10">
              <Form.Control type="number" defaultValue="Maximum" name="max" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }}>
              <Form.Check label="No Maximum?" name="max_unlimited" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Provision
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" defaultValue={provision?.provision_name} name="provision" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Free Text
            </Form.Label>
            <Col sm="10">
              <Form.Control as="textarea" rows={3} name="free_text" value={provision?.free_text} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Help Text
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" defaultValue={provision?.help_text} name="help_text" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Category
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" defaultValue={provision?.category} name="category" />
            </Col>
          </Form.Group>
        </Form>
        {/** add variants section here */}
        {/** add variables table here - will toggle variable edit & remove views */}
        {/** add variables button here */}
        {showError && <div className="alert alert-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>

        <Button variant="primary" onClick={() => {}} disabled={loading || !provision}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default EditProvisionModal;
