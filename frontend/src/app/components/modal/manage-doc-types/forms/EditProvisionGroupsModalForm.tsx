import { FC, useState } from 'react';
import { Button, Col, Modal, Spinner } from 'react-bootstrap';
import ProvisionGroupsTable from '../../../table/manage-doc-types/ProvisionGroupsTable';
import { ProvisionGroup } from '../../../../types/types';

interface EditProvisionGroupsModalFormProps {
  provisionGroups: any;
  loading: boolean;
  onHide: () => void;
  saveProvisionGroups: () => void;
  displayAddHandler: () => void;
  displayRemoveHandler: (provisionGroup: ProvisionGroup) => void;
  updateProvisionGroupsState: (newProvisionGroupState: ProvisionGroup[]) => void;
}

const EditProvisionGroupsModalForm: FC<EditProvisionGroupsModalFormProps> = ({
  provisionGroups,
  loading,
  onHide,
  saveProvisionGroups,
  updateProvisionGroupsState,
  displayRemoveHandler,
  displayAddHandler,
}) => {
  return (
    <>
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
          <Button onClick={displayAddHandler} variant="primary">
            Add Provision Group
          </Button>
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>

        <Button variant="success" onClick={saveProvisionGroups} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default EditProvisionGroupsModalForm;
