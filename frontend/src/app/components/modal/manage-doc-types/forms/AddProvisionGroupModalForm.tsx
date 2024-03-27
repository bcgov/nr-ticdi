import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useState } from 'react';
import { Button, Col, Form, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';

interface AddProvisionGroupModalFormProps {
  loading: boolean;
  onAdd: (provision_group: number, provision_group_text: string, max: number) => void;
  displayEditHandler: () => void;
}

const AddProvisionGroupModalForm: FC<AddProvisionGroupModalFormProps> = ({ loading, onAdd, displayEditHandler }) => {
  const [group, setGroup] = useState<number>();
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [max, setMax] = useState<number>(999);

  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGroup = parseInt(e.target.value);
    setGroup(newGroup);
  };

  const handleGroupDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupDescription(e.target.value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = 999;
    if (e.target.value.trim() !== '') {
      newMax = parseInt(e.target.value);
    }
    setMax(newMax);
  };

  const handleAdd = () => {
    if (group && groupDescription && max) {
      onAdd(group, groupDescription, max);
      displayEditHandler();
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Add Provision Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Group
            </Form.Label>
            <Col sm="10">
              <Form.Control type="number" name="group" onChange={handleGroupChange} />
            </Col>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Group Description
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" name="description" onChange={handleGroupDescriptionChange} />
            </Col>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label column sm="12">
              Max
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="max-tooltip">
                    Leave Max blank if you want no maximum number of provisions for this group.
                  </Tooltip>
                }
              >
                <FontAwesomeIcon icon={'question-circle'} className="ml-2" />
              </OverlayTrigger>
            </Form.Label>
            <Col sm="10">
              <Form.Control type="number" name="max" onChange={handleMaxChange} />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={displayEditHandler}>
          Go Back
        </Button>

        <Button variant="success" onClick={handleAdd} disabled={loading || !group || !groupDescription || max < 1}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Add'}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default AddProvisionGroupModalForm;
