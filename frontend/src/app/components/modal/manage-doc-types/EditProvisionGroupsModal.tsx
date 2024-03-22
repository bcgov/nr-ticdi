import { FC, useEffect, useState } from 'react';
import { ProvisionGroup } from '../../../types/types';
import ProvisionGroupsTable from '../../table/manage-doc-types/ProvisionGroupsTable';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';

interface EditProvisionGroupsModalProps {
  show: boolean;
  onHide: () => void;
  provisionGroups: ProvisionGroup[];
}

const EditProvisionGroupsModal: FC<EditProvisionGroupsModalProps> = ({ show, onHide, provisionGroups }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [displayEdit, setDisplayEdit] = useState(true);
  const [displayAdd, setDisplayAdd] = useState(false);
  const [displayRemove, setDisplayRemove] = useState(false);
  const [updatedProvisionGroups, setUpdatedProvisionGroups] = useState<ProvisionGroup[]>([]);

  const [groupToRemove, setGroupToRemove] = useState<ProvisionGroup>({
    id: -1,
    provision_group: -1,
    provision_group_text: '',
    max: -1,
  });

  useEffect(() => {
    setUpdatedProvisionGroups(provisionGroups);
  }, [provisionGroups]);

  // Group, Description, Max, Remove

  const setDisplayRemoveHandler = () => {
    setDisplayAdd(false);
    setDisplayEdit(false);
    setDisplayRemove(true);
  };

  const setDisplayEditHandler = () => {
    setDisplayAdd(false);
    setDisplayRemove(false);
    setDisplayEdit(true);
  };

  const setDisplayAddHandler = () => {
    setDisplayEdit(false);
    setDisplayRemove(false);
    setDisplayAdd(true);
  };

  const displayRemoveHandler = (provisionGroup: ProvisionGroup) => {
    setGroupToRemove(provisionGroup);
    setDisplayRemoveHandler();
  };

  // this gets called every time a cell in the table is changed, could be more efficient
  const updateProvisionGroupsState = (newProvisionGroupState: ProvisionGroup[]) => {
    setUpdatedProvisionGroups(newProvisionGroupState);
    console.log('updated');
    console.log(newProvisionGroupState);
  };

  const saveProvisionGroups = () => {
    // send the updated list of provisionGroups to the database
    // await updateProvisionGroups(updatedProvisionGroups);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Provision Groups</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col sm="12">
            <ProvisionGroupsTable
              provisionGroups={provisionGroups}
              onUpdate={updateProvisionGroupsState}
              showRemove={displayRemoveHandler}
            />
          </Col>
          <Col sm="12">
            <Button onClick={setDisplayAddHandler} variant="primary">
              Add Provision Group
            </Button>
          </Col>
          {showError && <div className="alert alert-danger">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>

          <Button variant="success" onClick={saveProvisionGroups} disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditProvisionGroupsModal;
