import { FC, useEffect, useState } from 'react';
import { ProvisionGroup } from '../../../types/types';
import ProvisionGroupsTable from '../../table/manage-doc-types/ProvisionGroupsTable';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import EditProvisionGroupsModalForm from './forms/EditProvisionGroupsModalForm';
import AddProvisionGroupModalForm from './forms/AddProvisionGroupModalForm';

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

  const displayEditHandler = () => {
    setDisplayAdd(false);
    setDisplayRemove(false);
    setDisplayEdit(true);
  };

  const displayAddHandler = () => {
    console.log('click');
    setDisplayEdit(false);
    setDisplayRemove(false);
    setDisplayAdd(true);
  };

  const displayRemoveHandler = (provisionGroup: ProvisionGroup) => {
    setGroupToRemove(provisionGroup);
    setDisplayAdd(false);
    setDisplayEdit(false);
    setDisplayRemove(true);
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

  const addNewGroupHandler = (provision_group: number, provision_group_text: string, max: number) => {
    if (provisionGroups.find((pg) => pg.provision_group === provision_group)) {
      setError('A provision group with that group number already exists.');
      return;
    }
    if (provisionGroups.find((pg) => pg.provision_group_text === provision_group_text)) {
      setError('A provision group with that description already exists.');
      return;
    }
    // create provision group
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        {displayEdit && (
          <EditProvisionGroupsModalForm
            provisionGroups={provisionGroups}
            loading={loading}
            onHide={onHide}
            saveProvisionGroups={saveProvisionGroups}
            updateProvisionGroupsState={updateProvisionGroupsState}
            displayRemoveHandler={displayRemoveHandler}
            displayAddHandler={displayAddHandler}
          />
        )}
        {displayAdd && (
          <AddProvisionGroupModalForm
            loading={loading}
            displayEditHandler={displayEditHandler}
            onAdd={addNewGroupHandler}
          />
        )}
      </Modal>
    </>
  );
};

export default EditProvisionGroupsModal;
