import { FC } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { ProvisionGroup } from '../../../../types/types';

interface RemoveProvisionGroupModalFormProps {
  loading: boolean;
  provisionGroup: ProvisionGroup;
  onRemove: (provisionGroupId: number) => void;
  displayEditHandler: () => void;
}

const RemoveProvisionGroupModalForm: FC<RemoveProvisionGroupModalFormProps> = ({
  loading,
  provisionGroup,
  onRemove,
  displayEditHandler,
}) => {
  const handleRemove = () => {
    onRemove(provisionGroup.id);
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Remove Provision Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to remove the following provision group?</p>
        <ul>
          <li>Group: {provisionGroup.provision_group}</li>
          <li>Description: {provisionGroup.provision_group_text}</li>
          <li>Max: {provisionGroup.max}</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={displayEditHandler}>
          Go Back
        </Button>

        <Button variant="danger" onClick={handleRemove} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Remove'}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RemoveProvisionGroupModalForm;
